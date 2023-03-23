// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

/// Maintain the Common funds for the platform
/// Recieve ethers
/// ablitiy to send ethers to a address
///

contract Funds is Ownable {
    bool paused;
    address public manager;

    mapping(address => uint256) public withdrawls;

    event withdrawn(address user, uint256 amount);
    event recieved(address indexed sender, uint256 amount);

    modifier onlyWhenNotPaused() {
        require(!paused, "Contract is currently paused");
        _;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "not the Manager");
        _;
    }

    function withdrawforUser(
        address _user,
        address payee,
        uint256 amount
    ) public onlyWhenNotPaused onlyManager returns (bool _success) {
        require(amount != 0, "Not a valid amount");
        withdrawls[_user] += amount;
        (bool success, ) = payee.call{value: amount}("");
        require(success, "Payment not completed");
        emit withdrawn(msg.sender, amount);
        return _success;
    }

    function pauseWithdrawls() public onlyOwner {
        paused = !paused;
    }

    function changeManager(address _manager) public onlyOwner {
        require(_manager != address(0), "Not a Valid address");
        manager = _manager;
    }

    /// show the current balance in the frontend
    function getWithdrawls(address user)
        public
        view
        returns (uint256 _balance)
    {
        return withdrawls[user];
    }

    /// @dev Function to receive Ether. msg.data must be empty
    receive() external payable {}

    /// @dev Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
