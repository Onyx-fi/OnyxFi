// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import {ISuperfluidToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluidToken.sol";

/// Contract maintains the state of every kind of payments
/// Paynow , paylater , PayEMI , PayStream
/// Record of the pay and combinations of all other requests
/// events for the payment will be logged and recorded

interface profileWallet {
    function pay(address _reciever, uint256 _amount) external;

    function getBalance() external view returns (uint256);

    function blockAmount(uint256 _amount) external;

    function UnblockAmount(uint256 _amount) external;
}

interface payStream {
    function deleteFlowToReciever(
        ISuperfluidToken token,
        address Sender,
        address Reciever
    ) external;

    function updateFlowToReciever(
        ISuperfluidToken token,
        address Sender,
        address Reciever,
        int96 flowRate
    ) external;

    function createFlowToReciever(
        ISuperfluidToken token,
        address Sender,
        address Reciever,
        int96 flowRate
    ) external;
}

interface profileManager {
    function getWalletContract(address _user)
        external
        view
        returns (address _contract);
}

interface funds {
    function withdrawforUser(
        address _user,
        address payee,
        uint256 amount
    ) external returns (bool _success);
}

contract payments is Ownable {
    struct Stream {
        ISuperfluidToken token;
        address sender;
        address reciever;
        uint256 flowRate;
        uint256 StartTimeStamp;
        uint256 EndTimeStamp;
        uint256 amount;
        bool streaming;
        bool paidFull;
    }

    uint256 public totalStreams;
    mapping(uint256 => Stream) public Streams;

    struct EMI {
        address sender;
        address reciever;
        uint256 totalAmount;
        uint256 tenure;
        uint256 totalWithInterest;
        uint256 perMonth;
        uint256 timePaid;
        uint256 defaults;
        uint256 paid;
        uint256 start;
        uint256 end;
    }

    uint256 public totalEMIs;
    uint256 public interestPerMonthEMI = (15 / 12);
    mapping(uint256 => EMI) public emis;

    struct plRequest {
        address payer;
        address payee;
        uint256 amount;
        uint256 startingTimestamp;
        uint256 endingTimestamp;
        bool paidBack;
        bool active;
    }

    address public payManager;

    uint256 public TotalPlRequests;
    uint256 public interestRateOnPL = (10 / 2628000);
    mapping(uint256 => plRequest) public plRequests;

    address public managerAddress;
    profileManager _manager = profileManager(managerAddress);

    address public streamAddress;
    payStream _stream = payStream(streamAddress);

    address public fundAddress;
    funds _funds = funds(fundAddress);

    mapping(address => bool) public _approved;

    event PaidNow(address sender, address reciever, uint256 amount);

    event PaidLater(
        address sender,
        address reciever,
        uint256 amount,
        uint256 timeperiod
    );

    event PaidViaEMI(
        address sender,
        address reciever,
        uint256 amount,
        uint256 tenure
    );

    event Streaming(
        address sender,
        address reciever,
        uint256 amount,
        uint256 timePeriod
    );

    constructor(
        address _managerAddress,
        address _fundsAddress,
        address _streamAddress
    ) {
        require(_managerAddress != address(0), "Not a valid address");
        managerAddress = _managerAddress;
        require(_fundsAddress != address(0), "Not a valid address");
        fundAddress = _fundsAddress;
        require(_streamAddress != address(0), "Not a valid address");
        streamAddress = _streamAddress;
    }

    modifier onlyApproved() {
        require(_approved[msg.sender], "Not Authorized");
        _;
    }

    function setManager(address _managerAddress) public onlyOwner {
        require(_managerAddress != address(0), "Not a valid Address");
        managerAddress = _managerAddress;
    }

    function setFunds(address _fundsAddress) public onlyOwner {
        require(_fundsAddress != address(0), "Not a valid Address");
        fundAddress = _fundsAddress;
    }

    function setStream(address _streamAddress) public onlyOwner {
        require(_streamAddress != address(0), "Not a valid Address");
        streamAddress = _streamAddress;
    }

    /// reciver : the contract address of the profile wallet of the reciever
    function pay(
        address sender,
        address reciever,
        uint256 _amount
    ) public payable {
        require(msg.value == _amount, "The amount sent is not correct");
        (bool success, ) = reciever.call{value: _amount}("");
        require(success, "request not completed");
        emit PaidNow(sender, reciever, _amount);
    }

    // sender wallet is the registered wallet from the website
    // reciever wallet is any one user prefers
    function payViaWallet(
        address sender,
        address reciever,
        uint256 _amount
    ) public {
        address payee = profileManager.getWalletContract(sender);
        require(_amount > 0, "The amount is not correct");
        profileWallet(payee).pay(reciever, _amount);
        emit PaidNow(sender, reciever, _amount);
    }

    /// @param timePeriod - time in seconds to be able to calculate the flow
    function payStream(
        address sender,
        address reciever,
        uint256 _amount,
        uint256 timePeriod,
        ISuperfluidToken _token
    ) public returns (uint256 _streamId) {
        require(reciever != address(0), "Address is not correct");
        uint256 flowRate = (_amount / timePeriod);
        _stream.createFlowToReciever(_token, sender, reciever, flowRate);
        Streams[totalStreams] = Stream(
            _token,
            sender,
            reciever,
            flowRate,
            block.timestamp,
            block.timestamp + timePeriod,
            _amount,
            true,
            false
        );
        totalStreams += 1;
        return totalStreams - 1;
    }

    ///need to be automatically called after the defined period
    function completePayStream(uint256 _streamID) public onlyApproved {
        Stream _streamer = Streams[_streamID];
        require(
            _streamer.EndTimeStamp >= block.timestamp,
            "Stream not yet ended"
        );
        require(
            _streamer.streaming && !_streamer.paidFull,
            "Stream is already closed"
        );
        _stream.deleteFlowToReciever(
            _streamer.token,
            _streamer.sender,
            _streamer.reciever
        );

        _streamer.streaming = false;
        _streamer.paidFull = true;
    }

    function getStream(uint256 _streamId) public returns (Stream) {
        require(_streamId <= totalStreams, "Not a valid ID ");
        return Streams[_streamId];
    }

    function createPLRequest(
        address _sender,
        address _reciever,
        uint256 _amount,
        uint256 _timePeriod
    ) public returns (uint256 _plID) {
        require(_amount > 0, "amount is not right ");
        address wallet = _manager.getWalletContract(_sender);

        require(
            profileWallet.getBalance() >= _amount,
            "Wallet has less balance than amount to be spent"
        );

        profileWallet(wallet).blockAmount(_amount);

        plRequests[TotalPlRequests] = plRequest(
            _sender,
            _reciever,
            _amount,
            block.timestamp,
            block.timestamp + _timePeriod,
            false,
            true
        );

        _funds.withdrawforUser(_sender, _reciever, _amount);
        emit PaidLater(_sender, _reciever, _amount, _timePeriod);

        TotalPlRequests += 1;
        return TotalPlRequests - 1;
    }

    function payPlRequest(uint256 _plID) public payable {
        plRequest _plrequest = plRequests[_plID];
        require(
            msg.sender == _plrequest.payer,
            "You are not the request creator"
        );

        require(_plrequest.active, "Request not active ");
        require(
            msg.value >= _plrequest.amount,
            "Amount sent is less than expected"
        );
        require(
            _plrequest.endingTimestamp > block.timestamp,
            "TimePeriod Passed , payWith Interest"
        );

        (bool success, ) = fundAddress.call{value: _plrequest.amount}("");
        require(success, "Payment not completed");
        address wallet = _manager.getWalletContract(_plrequest.payer);
        profileWallet(wallet).UnblockAmount(_plrequest.amount);

        _plrequest.paidBack = true;
        _plrequest.active = false;
    }

    function payPlRequestAfterTime(uint256 _plID) public payable {
        plRequest _plrequest = plRequests[_plID];
        require(
            msg.sender == _plrequest.payer,
            "You are not the request creator"
        );

        require(_plrequest.active, "Request not active ");
        uint256 payAmount = calculatePaybackAmount(_plID);
        require(msg.value >= payAmount, "Amount sent is less than expected");
        require(
            _plrequest.endingTimestamp < block.timestamp,
            "TimePeriod is not passed"
        );

        (bool success, ) = fundAddress.call{value: payAmount}("");
        require(success, "Payment not completed");
        address wallet = _manager.getWalletContract(_plrequest.payer);
        profileWallet(wallet).UnblockAmount(_plrequest.amount);

        _plrequest.paidBack = true;
        _plrequest.active = false;
    }

    function calculatePaybackAmount(uint256 _plID) public returns (uint256) {
        plRequest _plrequest = plRequests[_plID];
        require(_plrequest.active, "Request not active ");
        require(
            _plrequest.endingTimestamp < block.timestamp,
            "TimePeriod Passed , payWith Interest"
        );

        uint256 timeElapsed = block.timestamp - _plrequest.endingTimestamp;
        uint256 interestCharged = (_plrequest.amount *
            timeElapsed *
            interestRateOnPL) / 100;
        uint256 paybackAmount = _plrequest.amount + interestCharged;

        return paybackAmount;
    }

    function checkPlRequest(uint256 _plId) public returns (bool) {
        plRequest _plrequest = plRequests[_plId];
        if (block.timestamp > _plrequest.endingTimestamp) {
            return true;
        } else {
            return false;
        }
    }

    function getPlRequest(uint256 _plID) public {
        require(_plID <= TotalPlRequests, "Not a valid request ID");
        return plRequests[_plID];
    }

    // struct EMI {
    //     address merchant;
    //     address user;
    //     uint256 totalAmount;
    //     uint256 tenure;
    //     uint256 totalWithInterest;
    //     uint256 perMonth;
    //     uint256 timePaid;
    //     uint256 defaults;
    //     uint256 paid;
    // }

    function createEMI(
        address _sender,
        address _reciever,
        uint256 _amount,
        uint256 tenure
    ) public returns (uint256 _id) {
        require(_amount > 0, "Amount is Incorrect");
        require(
            tenure == 3 || tenure == 6 || tenure == 9 || tenure == 12,
            "Tenure Not right"
        );

        address wallet = _manager.getWalletContract(_sender);

        require(
            profileWallet.getBalance() >= _amount,
            "Wallet has less balance than amount to be spent"
        );
        profileWallet(wallet).blockAmount(_amount);

        uint256 TotalInterest = (_amount * interestPerMonthEMI * tenure) / 100;
        uint256 amountWithInterest = _amount + TotalInterest;
        uint256 amountPerMonth = amountWithInterest / tenure;
        uint256 timePeriod = tenure * 2628000;
        uint256 endTimestamp = block.timestamp + timePeriod;
        emis[totalEMIs] = EMI(
            _sender,
            _reciever,
            _amount,
            tenure,
            amountWithInterest,
            amountPerMonth,
            0,
            0,
            false,
            block.timestamp,
            endTimestamp
        );

        _funds.withdrawforUser(_sender, _reciever, _amount);
        emit PaidViaEMI(_sender, _reciever, _amount, tenure);

        totalEMIs += 1;
        return totalEMIs - 1;
    }

    function payEMI(uint256 _EMIId) public payable {
        require(_EMIId <= totalEMIs, "Not a valid EMI ID ");
        EMI _emi = emis[_EMIId];

        require(msg.sender == _emi.sender, "You are not the request creator");
        require(!_emi.paid, "Already Paid");
        require(_emi.timePaid != _emi.tenure, "EMI Complete Already");

        require(msg.value >= _emi.perMonth, "Amount is the incorrect");

        (bool success, ) = fundAddress.call{value: _emi.perMonth}("");
        require(success, "Payment not completed");
        address wallet = _manager.getWalletContract(_emi.payer);
        profileWallet(wallet).UnblockAmount(_emi.perMonth);

        _emi.timePaid += 1;
    }

    /// alert user in frontend if defaulted
    /// If 2 defaults the interest will be doubled
    function payEMIwithDefaults(uint256 _EMIId) public payable {
        require(_EMIId <= totalEMIs, "Not a valid EMI ID ");
        EMI _emi = emis[_EMIId];

        require(msg.sender == _emi.sender, "You are not the request creator");
        require(!_emi.paid, "Already Paid");
        require(_emi.timePaid != _emi.tenure, "EMI Complete Already");
        require(_emi.defaults > 2, "Default limit not crossed");

        uint256 newPerMonthAmount = (_emi.perMonth +
            ((_emi.perMonth * interestPerMonthEMI) / 100));
        require(msg.value >= newPerMonthAmount, "Amount is the incorrect");
        _emi.perMonth = newPerMonthAmount;
        (bool success, ) = fundAddress.call{value: newPerMonthAmount}("");
        require(success, "Payment not completed");
        address wallet = _manager.getWalletContract(_emi.payer);
        profileWallet(wallet).UnblockAmount(_emi.perMonth);
        _emi.timePaid += 1;
    }

    function completeEMI(uint256 _EMIId) public {
        require(_EMIId <= totalEMIs, "Not a valid EMI ID ");
        EMI _emi = emis[_EMIId];
        require(!_emi.paid, "Already Complete or not Active");
        require(_emi.timePaid == _emi.tenure, "EMI Not Already");
        require(_emi.end < block.timestamp, "Time period not ended ");
        _emi.paid = true;
    }

    /// defaults to be figured out
    /// regularly checked out , how to work
    function checkEMIDefault(uint256 _EMIId) public {
        require(_EMIId <= totalEMIs, "Not a valid EMI ID ");
        EMI _emi = emis[_EMIId];
        uint256 timePassed = block.timestamp - _emi.start;
        uint256 monthPassed = timePassed % 2628000;
        if (_emi.paid == monthPassed) {
            _emi.defaults = 0;
        } else if (_emi.paid < monthPassed) {
            _emi.defaults = monthPassed - _emi.paid;
        } else {
            _emi.defaults = 0;
        }
    }
}
