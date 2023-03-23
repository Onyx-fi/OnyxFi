// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./paySplitterWallet.sol";

/// split wallet creator
contract SplitManger {
    struct Splitter {
        paySplitterWallet _split;
        address _creator;
        address[] owners;
        uint256 no;
        bool active;
    }

    mapping(uint256 => Splitter) public _splitterWallets;
    uint256 _totalSplitWallets = 0;

    function createSplitterWallet(address[] memory _owners, uint256 noOfOwner)
        public
    {
        paySplitterWallet _wallet = new paySplitterWallet(
            _owners,
            noOfOwner,
            msg.sender
        );
        _splitterWallets[_totalSplitWallets] = Splitter(
            _wallet,
            msg.sender,
            _owners,
            noOfOwner,
            true
        );
    }

    modifier onlyOwner(uint256 _id) {
        require(
            _splitterWallets[_id]._creator == msg.sender,
            "Not the creator"
        );
        _;
    }

    function pauseSplitterWallet(uint256 _id) public onlyOwner(_id) {
        _splitterWallets[_id].active = false;
    }
}
