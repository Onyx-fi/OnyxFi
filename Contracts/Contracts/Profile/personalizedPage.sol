// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/// fetch the payment wallet for the user from the Profile manager

interface profileManager {
    function getWalletContract(address _user)
        external
        view
        returns (address _contract);
}

contract personalizedPayPage {
    profileManager _manager;

    struct pageDetails {
        string _name;
        string _ipfsCID;
        address wallet;
    }

    mapping(address => pageDetails) public pages;

    /// mapping from pageName => userAddress
    mapping(string => address) public users;

    constructor(address _manageraddress) {
        require(_manageraddress != address(0), "Not a Valid Address");
        _manager = profileManager(_manageraddress);
    }

    //  function to create the page
    function createPage(string memory name, string memory IpfsCID) public {
        address _wallet = _manager.getWalletContract(msg.sender);
        pages[msg.sender] = pageDetails(name, IpfsCID, _wallet);
        users[name] = msg.sender;
    }

    // function to update the pageName string
    function updatePageName(string memory newName) public {
        string storage pastName = pages[msg.sender]._name;
        users[pastName] = address(0);

        pages[msg.sender]._name = newName;
        users[newName] = msg.sender;
    }

    // function to update the appearance
    function updateCID(string memory newCID) public {
        pages[msg.sender]._ipfsCID = newCID;
    }

    //  to fetch the User address from the name
    function getAddress(string memory name) public view returns (address) {
        return users[name];
    }

    // fetch Other Details for the page
    function getDetails(address user) public view returns (pageDetails memory) {
        return pages[user];
    }

    function getWallet(address user) public view returns (address _wallet) {
        return pages[user].wallet;
    }
}
