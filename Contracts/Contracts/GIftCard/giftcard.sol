// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/access/Ownable.sol";

/// we can change the condition of the verification
/// this contract address is stored in the manager contract
/// also the same is deployed after passing the arguements and the value to be locked
interface IERC721 {
    function balanceOf(address owner) external view returns (uint256 balance);

    function ownerOf(uint256 tokenId) external view returns (address owner);
}

contract giftcard is Ownable {
    IERC721 _nftcollection;
    uint256 public amount;
    address public immutable payee;
    address public collectionAddress;
    uint256 public tokenId;
    uint256 public expiry;
    bool public claimed;

    event giftCardCreated(
        address creator,
        address nftCollection,
        uint256 _tokenId,
        address giftCardAddress
    );

    event giftCardReedemed(address _receiver, address _wallet, uint256 _amount);
    event giftCardExpired(address owner, uint256 _amount);

    constructor(
        address _nftCollectionAddress,
        uint256 _tokenId,
        address _payee,
        uint256 validity
    ) {
        require(_nftCollectionAddress != address(0), "Invalid address");
        require(validity > 0, "Validity should be > 0");
        collectionAddress = _nftCollectionAddress;
        _nftcollection = IERC721(_nftCollectionAddress);
        tokenId = _tokenId;
        payee = _payee;
        expiry = block.timestamp + validity;
        transferOwnership(_payee);
        emit giftCardCreated(
            payee,
            _nftCollectionAddress,
            _tokenId,
            address(this)
        );
    }

    modifier onlyHolder() {
        require(
            _nftcollection.ownerOf(tokenId) == msg.sender,
            "You are not the token holder"
        );
        _;
    }

    function initialize() public payable onlyOwner {
        require(msg.value > 0, "Amount should be > 0 ");
        amount = msg.value;
    }

    function redeemGiftCard(address _recipient) public onlyHolder {
        require(_recipient != address(0), "Invalid reciever address");
        (bool success, ) = _recipient.call{value: amount}("");
        require(success, "request not completed");
        claimed = true;
        selfdestruct(payable(payee));
        emit giftCardReedemed(msg.sender, _recipient, amount);
    }

    function expireGC() public {
        require(block.timestamp > expiry, "Not yet Expired");
        selfdestruct(payable(owner()));
    }
}
