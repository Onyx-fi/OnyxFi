// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/access/Ownable.sol";

contract walletVerifier {
    struct Request {
        address owner;
        bool verified;
        bool compromised;
        bool sent;
        uint256 timesRequested;
    }

    mapping(address => Request) public verifyRequests;

    uint256 amount = 0.001 ether;

    event verified(address indexed _user, address indexed _owner);
    event compromised(address indexed _user, address indexed _owner);

    constructor() payable {}

    function startVerification(address user) public {
        Request storage _request = verifyRequests[user];
        require(!_request.verified, "Already verified");
        require(_request.timesRequested < 3, "No. of requests created");
        _request.owner = msg.sender;
        _request.timesRequested += 1;
        (bool success, ) = user.call{value: amount}("");
        require(success, "request not completed");
        _request.sent = success;
    }

    function checkVerification(address user) public {
        Request storage _request = verifyRequests[user];
        require(_request.sent, "Amount not yet sent");
        /// fetches the ETH balance of the wallet
        uint256 balance = address(user).balance;
        if (balance >= amount) {
            _request.compromised = false;
            _request.verified = true;
            emit verified(user, _request.owner);
        } else {
            _request.compromised = true;
            _request.verified = false;
            emit compromised(user, _request.owner);
        }
    }

    receive() external payable {}

    fallback() external payable {}
}
