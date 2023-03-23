// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/access/Ownable.sol";

/// this is a personal secured contract for each registered user on the website
/// manages every kind of funds , can only be controlled by owner

/// import IERC20

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract profileWallet is Ownable, ERC721Holder {
    address public payments;
    address public constant developer =
        0xe22eCBbA8fB9C0124eeCb6AfE0bf6A487424989f;
    /// @dev events to keep track of ether receive and Withdrawl
    event received(address user, uint256 amount);
    event withdrawal(address user, uint256 amount);

    bool paused;

    uint256 public blockedAmount = 0;
    uint256 public totalBalance = address(this).balance;
    uint256 public reedemableBalance = totalBalance - blockedAmount;

    uint256 public EMIamountPerMonth = 0;
    uint256 public constant interestRatePerMonth = 12;
    uint256 public constant interestFreePeriod = 30 days;

    /// add or deduct the amount to be deducted per month

    constructor(address _owner) {
        transferOwnership(_owner);
    }

    modifier onlyWhenNotPaused() {
        require(!paused, "Contract is currently paused");
        _;
    }

    modifier onlyDev() {
        require(msg.sender == developer, "Not authorised");
        _;
    }

    modifier onlyApproved() {
        require(
            msg.sender == payments || msg.sender == owner(),
            "Not Approved "
        );
        _;
    }

    /// @dev check the balance of the contract at any point of time
    /// @return returns balance of contract address (DAO)
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function setPayment(address _payments) public onlyDev {
        require(_payments != address(0), "Not a valid address");
        payments = _payments;
    }

    function allowBlocking(address _contractAddress, uint256 _amount)
        public
        onlyOwner
    {}

    // to block the amount when the EMI is Started
    function blockAmount(uint256 _amount) public onlyApproved {
        require(
            _amount < reedemableBalance,
            "Amount should be less than unblocked amount "
        );
        blockedAmount += _amount;
    }

    function UnblockAmount(uint256 _amount) public onlyApproved {
        require(
            _amount < blockedAmount,
            "Amount should be less than blocked amount "
        );
        blockedAmount -= _amount;
    }

    function pay(address _reciever, uint256 _amount) public onlyApproved {
        require(
            _amount <= reedemableBalance,
            "Amount should be less than reedemable amount"
        );
        require(_reciever != address(0), "Not a valid address");
        (bool success, ) = _reciever.call{value: _amount}("");
        require(success, "Payment Not Completed");
    }

    function payinToken(
        address token,
        address reciever,
        uint256 _amount
    ) public onlyApproved {
        require(
            _amount <= IERC20(token).balanceOf(msg.sender) && _amount > 0,
            "Amount not Valid or not available "
        );
        require(reciever != address(0), "Not a valid address");
        IERC20(token).transferFrom(msg.sender, reciever, _amount);
    }

    /// to pay out the amount every month if any EMI is running for the contract
    function payEMI(uint256 emiID, address reciever) external onlyApproved {
        require(EMIamountPerMonth > 0, "No EMI remaining");
        (bool success, ) = reciever.call{value: EMIamountPerMonth}("");
        require(success, "Payment Not Completed");
        UnblockAmount(EMIamountPerMonth);
    }

    // payment for the EMI starts and it deducts the EMI amount by a Chainlink Keeper call
    // tenure - time period in months
    function createEMI(
        uint256 emiID,
        uint256 _totalAmount,
        uint256 tenure
    ) external onlyApproved {
        require(
            _totalAmount < reedemableBalance,
            "Amount should be less than the blocked amount "
        );
        uint256 totalAmount = (_totalAmount * 112) / 100;
        blockAmount(totalAmount);
        uint256 emiamount = totalAmount / tenure;
        EMIamountPerMonth += emiamount;
    }

    function completeEMI(
        uint256 emiID,
        uint256 _totalAmount,
        uint256 tenure
    ) external onlyOwner {
        uint256 totalAmount = (_totalAmount * 112) / 100;
        uint256 emiamount = totalAmount / tenure;
        EMIamountPerMonth -= emiamount;
    }

    function createPayLater(uint256 plID, uint256 _totalAmount)
        external
        onlyApproved
    {
        require(
            _totalAmount < reedemableBalance,
            "Amount should be less than the blocked amount "
        );
        blockAmount(_totalAmount);
    }

    function completePayLater(
        uint256 plID,
        uint256 _totalAmount,
        address _receiver
    ) external onlyOwner {
        require(
            _totalAmount < reedemableBalance,
            "Amount should be less than the blocked amount "
        );
        (bool success, ) = _receiver.call{value: _totalAmount}("");
        require(success, "Payment Not Completed");

        UnblockAmount(_totalAmount);
    }

    // We can implement the payLater with offer to pay under 30 days back with no interest
    // then interest starts after 30 days

    // similarly we can create a credit wallet too , that allows them to spend upto some limit
    //

    /// @dev to deposit ETH
    function deposit() external payable onlyWhenNotPaused {
        require(msg.value > 0, "Value can't be 0");
        emit received(msg.sender, msg.value);
    }

    /// @dev to deposit any kind of ERC20 token
    /// @param _token : address of the token contract that needs to be deposited
    /// @param _amount : Amount of the tokens to be deposited , in the converted format
    function depositToken(address _token, uint256 _amount)
        external
        onlyWhenNotPaused
    {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
    }

    /// @dev withdraw eth to a particular address in case of grants
    /// @param _to : to the address to pay
    /// @param _amount :  amount to be withdrawn
    function withdrawEthTo(address payable _to, uint256 _amount)
        public
        onlyOwner
        onlyWhenNotPaused
        returns (bool)
    {
        require(
            _amount < reedemableBalance,
            "Can't withdraw more than the limit"
        );
        (bool success, ) = _to.call{value: _amount}("");
        emit withdrawal(_to, _amount);
        return success;
    }

    /// @dev withdraw tokens to a particular address in case of grants
    /// @param _to : to the address to pay
    /// @param _amount :  amount to be withdrawn
    function withdrawTokens(
        address token,
        address payable _to,
        uint256 _amount
    ) public onlyOwner onlyWhenNotPaused returns (bool) {
        IERC20(token).transfer(_to, _amount);
        emit withdrawal(_to, _amount);
        return true;
    }

    /// @dev Pause the contract's withdrawl or deposit
    function pauseContract() public onlyOwner {
        paused = !paused;
    }

    /// @dev Function to receive Ether. msg.data must be empty
    receive() external payable {
        require(!paused, "Contract is currently paused");
        emit received(msg.sender, msg.value);
    }

    /// @dev Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
