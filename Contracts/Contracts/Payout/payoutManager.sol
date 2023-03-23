// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

/// able to create the payouts by deploying the contracts
/// fetch the payoutRequest  and other details
import "./payout.sol";

contract payoutManager is Ownable {
    struct payoutRequest {
        address creator;
        address receiver;
        address payoutContract;
        payout _contract;
        bool completed;
        uint256 amount;
    }

    mapping(uint256 => payoutRequest) public payouts;

    uint256 public totalRequests = 0;

    constructor() {}

    function createPayout(address _receiver, uint256 amount) public {
        uint256 _amount = amount;
        require(_receiver != address(0), "Address is not valid");

        payout _payout = new payout(_receiver, msg.sender);
        payouts[totalRequests] = payoutRequest(
            msg.sender,
            _receiver,
            address(_payout),
            _payout,
            false,
            _amount
        );
        totalRequests += 1;
    }

    function completePayout(uint256 _id) public {
        payoutRequest storage _request = payouts[_id];
        require(msg.sender == _request.receiver, "You can not complete it");
        _request.completed = true;
    }

    function getPayoutDetails(uint256 _id)
        public
        view
        returns (payoutRequest memory)
    {
        return payouts[_id];
    }

    function getPayoutContractAddress(uint256 _id)
        public
        view
        returns (address)
    {
        return payouts[_id].payoutContract;
    }
}
