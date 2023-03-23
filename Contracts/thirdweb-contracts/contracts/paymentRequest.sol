// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
/// creator can create requests of the amount of money , with name , description for the payment requests
/// show all the payment options for the payee
/// send money to the funds contract directly on transfer , with no hold
/// can even create pay links for some other person , to recieve the money was an when they want to claim
/// can pay in eth
/// choose other currency options to be able to pay with them , support to be added

import "@openzeppelin/contracts/access/Ownable.sol";
import {ISuperfluidToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluidToken.sol";

interface profileManager {
    function checkUser(address _user) external view returns (bool);

    function getWalletContract(address _user)
        external
        view
        returns (address _contract);
}

interface payments {
    /// we will call all the payment options we are offering from this contract for all the payment Requests created by the userss
    /// keep all the other direct payments directly from that contract

    function payViaWallet(
        address sender,
        address reciever,
        uint256 _amount
    ) external;

    function payViaStream(
        address sender,
        address reciever,
        uint256 _amount,
        uint256 timePeriod,
        int96 flowRate,
        ISuperfluidToken _token
    ) external returns (uint256 _streamId);

    function createPLRequest(
        address _sender,
        address _reciever,
        uint256 _amount,
        uint256 _timePeriod
    ) external returns (uint256 _plID);

    function createEMI(
        address _sender,
        address _reciever,
        uint256 _amount,
        uint256 tenure
    ) external returns (uint256 _id);
}

/// pay request notification from the frontend

contract paymentRequests is Ownable {
    address public managerAddress;
    profileManager _manager = profileManager(managerAddress);

    address public paymentsAddress;
    payments _payment = payments(paymentsAddress);

    enum payMode {
        notSelected,
        payNow,
        payLater,
        payEMI,
        payStream
    }

    enum payState {
        intiated,
        paid,
        pending, /// for payLater
        Streaming, /// for payStream
        onEMI /// for payEMI
    }

    struct PaymentRequest {
        address payer;
        uint256 amount;
        string detailsURI;
        payState _state;
        payMode _mode;
    }

    /// mapping from creator Address =>  requestID => PaymentRequest Details
    mapping(address => mapping(uint256 => PaymentRequest)) public requests;

    /// just to find the max for request for each address
    mapping(address => uint256) public totalRequests;

    /// events for request creation to index with graph
    event RequestsCreated(
        address creator,
        address payer,
        uint256 id,
        uint256 amount,
        string detailsURI
    );

    // events for request paid to index with graph
    event RequestPaid(address payee, address payer, uint256 id, uint256 amount);

    constructor(address _managerAddress) {
        require(_managerAddress != address(0), "Not a valid address");
        managerAddress = _managerAddress;
    }

    modifier onlyUser() {
        require(
            _manager.checkUser(msg.sender),
            "You are not a registered user "
        );
        _;
    }

    modifier onlyPayments() {
        require(msg.sender == paymentsAddress, "Not Authorised");
        _;
    }

    function getRequest(uint256 _id, address _user)
        public
        view
        returns (PaymentRequest memory)
    {
        return requests[_user][_id];
    }

    function createRequest(
        uint256 _amount,
        string memory _detailsURI,
        address payer
    ) public returns (uint256 id) {
        require(_amount > 0, "Amount should be greater than 0");
        uint256 _id = totalRequests[msg.sender];
        requests[msg.sender][_id] = PaymentRequest(
            payer,
            _amount,
            _detailsURI,
            payState.intiated,
            payMode.notSelected
        );
        totalRequests[msg.sender] += 1;

        emit RequestsCreated(msg.sender, payer, _id, _amount, _detailsURI);
        return _id;
    }

    ///@dev - pay in whole for the payment request
    ///@param _creator - address of the reciever
    ///@param _id - id of the payment requests
    ///@param choice - Choice of instant payment , via metamask or ProfileWallet
    function PayNow(
        address _creator,
        uint256 _id,
        uint256 choice
    ) public payable {
        require(_creator != address(0), "Not a valid address");
        PaymentRequest memory _request = requests[_creator][_id];
        require(_request._state != payState.paid, "Already Paid");
        require(choice == 1 || choice == 2, "Not a valid choice");

        //via metamask
        if (choice == 1) {
            require(
                msg.value == _request.amount,
                "The amount sent is not correct"
            );
            address wallet = _manager.getWalletContract(_creator);
            (bool success, ) = wallet.call{value: _request.amount}("");
            require(success, "request not completed");
        } else {
            _payment.payViaWallet(_request.payer, _creator, _request.amount);
        }
        /// call payNow from payments contract
        _request._state = payState.paid;
        _request._mode = payMode.payNow;
        emit RequestPaid(_creator, _request.payer, _id, _request.amount);
    }

    ///pay in full via wallet contract they have , just a sign message should work

    ///@dev - pay with streaming , called before starting the stream
    ///@param _creator - address of the reciever
    ///@param _id - id of the payment requests
    function PayStream(
        address _creator,
        uint256 _id,
        uint256 _timePeriod,
        int96 _flowRate,
        ISuperfluidToken _token
    ) public payable returns (uint256 streamID) {
        require(_creator != address(0), "Not a valid address");
        PaymentRequest memory _request = requests[_creator][_id];
        require(_request._state != payState.paid, "Already Paid");
        require(_request._state == payState.intiated, "Not yet intiated");

        /// call paystream to start the stream from the payments contracts
        uint256 _streamID = _payment.payViaStream(
            msg.sender,
            _creator,
            _request.amount,
            _timePeriod,
            _flowRate,
            _token
        );

        _request._state = payState.Streaming;
        _request._mode = payMode.payStream;
        return _streamID;
    }

    /// payStream after completion of the request will be called from here
    function completePayStream(address _creator, uint256 _id) public payable {
        PaymentRequest memory _request = requests[_creator][_id];
        require(_request._mode == payMode.payStream, "Not a stream ");
        require(_request._state != payState.paid, "Already Paid");
        _request._state = payState.paid;
        emit RequestPaid(_creator, _request.payer, _id, _request.amount);
    }

    ///@dev - pay with streaming , called before starting the stream
    ///@param _creator - address of the reciever
    ///@param _id - id of the payment requests
    function PayEMI(
        address _creator,
        uint256 _id,
        uint256 _tenure
    ) public payable {
        require(_creator != address(0), "Not a valid address");
        PaymentRequest memory _request = requests[_creator][_id];
        require(_request._state != payState.paid, "Already Paid");
        require(_request._state == payState.intiated, "Not yet intiated");

        // call payEMI from payments
        _payment.createEMI(msg.sender, _creator, _request.amount, _tenure);

        _request._state = payState.onEMI;
        _request._mode = payMode.payEMI;
    }

    function completePayEMI(address _creator, uint256 _id) public payable {
        PaymentRequest memory _request = requests[_creator][_id];
        require(_request._mode == payMode.payEMI, "Not a EMI");
        require(_request._state != payState.paid, "Already Paid");
        _request._state = payState.paid;
        emit RequestPaid(_creator, _request.payer, _id, _request.amount);
    }

    ///@dev - pay with streaming , called before starting the stream
    ///@param _creator - address of the reciever
    ///@param _id - id of the payment requests
    function PayLater(
        address _creator,
        uint256 _id,
        uint256 _timePeriod
    ) public payable {
        require(_creator != address(0), "Not a valid address");
        PaymentRequest memory _request = requests[_creator][_id];
        require(_request._state != payState.paid, "Already Paid");
        require(_request._state == payState.intiated, "Not yet intiated");

        /// call payLater from the payments
        _payment.createPLRequest(
            msg.sender,
            _creator,
            _request.amount,
            _timePeriod
        );
        _request._state = payState.pending;
        _request._mode = payMode.payLater;
    }

    function completePayLater(address _creator, uint256 _id) public payable {
        PaymentRequest memory _request = requests[_creator][_id];
        require(_request._mode == payMode.payLater, "Not a EMI");
        require(_request._state != payState.paid, "Already Paid");
        _request._state = payState.paid;
        emit RequestPaid(_creator, _request.payer, _id, _request.amount);
    }

    function setManager(address _managerAddress) public onlyOwner {
        require(_managerAddress != address(0), "Not a valid Address");
        managerAddress = _managerAddress;
    }

    function setPayments(address _paymentsAddress) public onlyOwner {
        require(_paymentsAddress != address(0), "Not a valid Address");
        paymentsAddress = _paymentsAddress;
    }
}
