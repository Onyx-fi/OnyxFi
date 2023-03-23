/// handle all the EMI related services
/// create EMI requests and send the amount to the merchant after borrowing
/// payment completed each month for the tenure period along with the interest of 15 % per annum
/// if defaulted, the blocked amount will be deducted automatically
/// each month some requests can be sent each month s

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract payEMI {
    struct EMI {
        address merchant;
        address user;
        uint256 totalAmount;
        uint256 tenure;
        uint256 totalWithInterest;
        uint256 perMonth;
        uint256 defaults;
        uint256 paid;
    }

    uint256 public totalEMIs;
    mapping(uint256 => EMI) public emis;

    // function to create the EMI for 3, 6 , 9 or 12 months -- done
    // to fulfill the purchase and block amount from user's account --  done
    // to pay for the EMI every month which are active --  done
    // send the EMI payment request to user's account --  need to be configured
    // after complete payment for each month , then close it -- done
}
