// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/access/Ownable.sol";

contract payNow {
    function pay(
        address sender,
        address reciever,
        uint256 _amount
    ) public payable {
        require(msg.value == _amount, "The amount sent is not correct");
        (bool success, ) = reciever.call{value: _amount}("");
        require(success, "request not completed");
    }

    // sender wallet is the registered wallet from the website
    // reciever wallet is any one user prefers
    function payViaWallet(
        address sender,
        address reciever,
        uint256 _amount
    ) public payable {
        /// deduct the amount from the user Wallet First
        //  direct function call that pays to the defined address
        // Already 2 premade functions exsists in the wallet contract , to make it flexible for the user
    }
}
