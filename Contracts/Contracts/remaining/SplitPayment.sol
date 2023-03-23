// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/access/Ownable.sol";

// Tasks
// A particular Split Pay can be done , where a group of addresses pay for a Payment by splitting it

contract SplitPayment is Ownable {
    event payRecieved(address indexed payer, uint256 amount);

    constructor() {}

    /// we can create payment requests to each of the user
    function splitPay(address[] _payers, uint256 _amount) public payable {
        require(_amount > 0, "amount sent should be > 0");
        uint256 noOfPayers = _payers.length();
        uint256 amountPer = amount / noOfPayers;
        for (uint256 i = 0; i < noOfPayers; i++) {
            address _to = owners[i];
            require(_to != address(0), "Address is not valid");
            // create payment reqeusts to each of them
        }
    }

    /// @dev Function to receive Ether. msg.data must be empty
    /// the pay recieved is automatically sent to the setAddresses at the time of deployment
    receive() external payable {
        emit payRecieved(msg.sender, msg.value);
    }

    /// @dev Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
