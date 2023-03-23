// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

////creator can set the payment profile
/// issue profile specific payment links - to send somebody to recieve payment
/// set the reciever address
/// might be verify their reciever address with help of a small money transfer and getting a transfer badge
/// wihtdraw all the money they have got into the system

import "@openzeppelin/contracts/access/Ownable.sol";

import "./profileWallet.sol";

contract profileManager is Ownable {
    struct UserProfile {
        address reciever;
        profileWallet _wallet;
        string name;
        bool user;
    }

    mapping(address => UserProfile) public users;
    mapping(address => string[]) public invoices;

    event userCreated(address user, string name, address wallet);

    constructor() payable {}

    modifier onlyUser() {
        require(users[msg.sender].user, "Not a user");
        _;
    }

    /// register as a user on the portal
    function register(address reciever, string memory name) public {
        require(reciever != address(0), "not a valid address");
        profileWallet _wallet = new profileWallet(msg.sender);
        users[msg.sender] = UserProfile(reciever, _wallet, name, true);
        emit userCreated(msg.sender, name, address(_wallet));
    }

    ///to set the reciever address
    function setReciever(address newReciever) public onlyUser {
        require(newReciever != address(0), "not a valid address");
        users[msg.sender].reciever = newReciever;
    }

    function addInvoice(address user, string memory invoiceData) public {
        invoices[user].push(invoiceData);
    }

    ///get the details of user
    function getUser(address _user) public view returns (UserProfile memory) {
        return users[_user];
    }

    function getReciever(address _user) public view returns (address) {
        return users[_user].reciever;
    }

    function getWalletContract(address _user)
        public
        view
        returns (address _contract)
    {
        return address(users[_user]._wallet);
    }

    function checkUser(address _user) public view returns (bool) {
        return users[_user].user;
    }

    /// In case a user is supected, Owner could stop the withdrawl
    function suspectUser(address _user) public onlyOwner {
        users[_user].user = false;
    }
}
