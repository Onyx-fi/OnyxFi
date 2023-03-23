// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/access/Ownable.sol";

/// we can change the condition of the verification
/// this contract address is stored in the manager contract
/// also the same is deployed after passing the arguements and the value to be locked

contract payout is Ownable {
    uint256 public amount;
    address public immutable receiver;
    address public immutable payee;
    bool public claimed;

    event payoutCreated(
        address creator,
        address _receiver,
        uint256 _amount,
        address payoutContract
    );

    event payoutReedemed(address _receiver, address _wallet, uint256 _amount);

    constructor(address _receiver, address _payee) {
        require(_receiver != address(0), "Address is not valid");

        receiver = _receiver;
        payee = _payee;
    }

    modifier onlyReciever() {
        require(msg.sender == receiver, "You are not the reciever");
        _;
    }

    function initialize() public payable {
        require(msg.value > 0, "Amount should be > 0 ");
        amount = msg.value;
        emit payoutCreated(payee, receiver, amount, address(this));
    }

    function redeemPayout(address _recipient) public onlyReciever {
        require(_recipient != address(0), "Invalid reciever address");
        (bool success, ) = _recipient.call{value: amount}("");
        require(success, "request not completed");
        claimed = true;
        selfdestruct(payable(payee));
        emit payoutReedemed(receiver, _recipient, amount);
    }

    function cancelPayout() public onlyOwner {
        selfdestruct(payable(msg.sender));
    }
}
