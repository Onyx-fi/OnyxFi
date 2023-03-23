// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

/// able to create the payouts by deploying the contracts
/// fetch the payoutRequest  and other details
/// Chainlink keeper to expire the GC

import "./giftcard.sol";

interface ERC721 {
    function safeMint(
        address to,
        uint256 tokenId,
        string memory uri
    ) external;
}

contract gcCreator is Ownable {
    address public nftCollection;
    ERC721 _collection = ERC721(nftCollection);

    struct GiftCards {
        address sender;
        address receiver;
        address gcContract;
        giftcard _contract;
        bool reedemed;
        uint256 amount;
        uint256 expiry;
    }

    mapping(uint256 => GiftCards) public _giftCards;

    uint256 public totalGiftCards;

    constructor(address _gcCollection) {
        nftCollection = _gcCollection;
    }

    function createGiftCard(
        address _receiver,
        uint256 validity,
        uint256 _amount,
        string memory _tokenURI
    ) public returns (uint256 _gcID) {
        require(validity > 0, "Validity should be > 0");

        require(_receiver != address(0), "Address is not valid");

        /// minting the GC NFT to the user first
        _collection.safeMint(_receiver, totalGiftCards, _tokenURI);

        /// value send issue
        giftcard _gc = new giftcard(
            nftCollection,
            totalGiftCards,
            _receiver,
            validity
        );

        _giftCards[totalGiftCards] = GiftCards(
            msg.sender,
            _receiver,
            address(_gc),
            _gc,
            false,
            _amount,
            block.timestamp + validity
        );

        totalGiftCards += 1;
        return totalGiftCards - 1;
    }

    function getGcDetails(uint256 _id) public view returns (GiftCards memory) {
        return _giftCards[_id];
    }

    function getGcContractAddress(uint256 _id) public view returns (address) {
        return _giftCards[_id].gcContract;
    }
}
