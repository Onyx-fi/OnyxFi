/// handle pay later service for the payment option
///  create Late requests , storing all the details of the start and ending point
///  payment completed within 30 days
/// after 30 days , 15 % interest per annum , 1.25% per month
///  these payment requests can be sent then

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract payLater {
    struct plRequest {
        address payer;
        address payee;
        uint256 amount;
        uint256 startingTimestamp;
        uint256 endingTimestamp;
        bool paidBack;
        bool active;
    }

    address public payManager;

    uint256 public TotalRequests;
    mapping(uint256 => plRequest) public plRequests;

    /// function createRequest  - - done
    /// fulfill request (merchant to be paid) and block the amount from the user's account -- done
    /// payBackAmount interest free -- done
    /// pay after 30 days with the interest amount (send payBack requests) . -- done
    /// complete and close request -- done
    /// calculate the current amount -- done

    modifier onlyPayManager() {
        require(msg.sender == payManager, "Not the pay manager");
        _;
    }

    function createPLRequest(
        address _sender,
        address _reciever,
        uint256 _amount,
        uint256 _timePeriod
    ) public onlyPayManager {
        require(_amount > 0, "amount is not right ");
        address wallet = _manager.getWalletContract(_sender);
    }

    function fulfillPLRequest() public {}
}
