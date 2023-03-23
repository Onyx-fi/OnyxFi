/// NFT collection that stores all the giftcards created// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract gcCollection is ERC721, ERC721URIStorage, Ownable {
    constructor() ERC721("SwiftFi GiftCards", "SwiftFigc") {}

    address public _creator;

    modifier onlyCreator() {
        require(_creator != address(0), "Creator contract not set ");
        require(msg.sender == _creator, "Unathourized");
        _;
    }

    function changeCreator(address _newCreator) public onlyOwner {
        require(_newCreator != address(0), "not a valid addresss");
        _creator = _newCreator;
    }

    function safeMint(
        address to,
        uint256 tokenId,
        string memory uri
    ) public onlyCreator {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
