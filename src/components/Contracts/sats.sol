// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SingleAssetTokens is ERC1155, Ownable, IERC2981, ReentrancyGuard {
    struct TokenInfo {
        address creator;
        string uri;
        uint256 maxSupply;
        uint256 totalSupply;
        uint256 mintAdditionalCost;
        uint256 accumulatedFees;
        uint256 explosionStartTime;
        bool isExploding;
        bool exploded;
        bool antiWhale; // Anti-whale feature flag
    }

    mapping(uint256 => TokenInfo) public tokenDetails;
    mapping(uint256 => mapping(address => uint256)) public tokenBalances;
    address public treasuryAddress;
    uint256 public explosionDelay; // Variable to store the explosion delay in seconds
    uint256 public constant CREATOR_ROYALTY = 200; // 2% (out of 10000)
    uint256 public constant TREASURY_ROYALTY = 400; // 4% (out of 10000)
    uint256 public mintingFee = 1 ether; // Default minting fee
    bool public canCreateNewTokens = true; // Variable to toggle new token creation
    uint256 private currentTokenId = 0; // Counter for current token ID

    event TokenMinted(uint256 tokenId, address indexed minter, uint256 maxSupply, uint256 mintAdditionalCost);
    event TokenExploded(uint256 tokenId);
    event TokenBalanceLogged(uint256 tokenId, address indexed holder, uint256 balance);
    event ToggleNewTokenCreation(bool status);
    event TreasuryAddressUpdated(address treasuryAddress);
    event ExplosionDelayUpdated(uint256 explosionDelay);
    event MintingFeeUpdated(uint256 mintingFee);

    constructor(address _treasuryAddress, uint256 _explosionDelay) ERC1155("") Ownable(msg.sender) {
        require(_treasuryAddress != address(0), "Invalid treasury address");
        treasuryAddress = _treasuryAddress;
        explosionDelay = _explosionDelay; // Initialize the explosion delay in seconds
    }

    function setTreasuryAddress(address _treasuryAddress) external onlyOwner {
        require(_treasuryAddress != address(0), "Invalid treasury address");
        treasuryAddress = _treasuryAddress;
        emit TreasuryAddressUpdated(treasuryAddress);
    }

    function setExplosionDelay(uint256 _explosionDelay) external onlyOwner {
        explosionDelay = _explosionDelay;
        emit ExplosionDelayUpdated(explosionDelay);
    }

    function setMintingFee(uint256 _fee) external onlyOwner {
        mintingFee = _fee;
        emit MintingFeeUpdated(mintingFee);
    }

    function toggleNewTokenCreation() external onlyOwner {
        canCreateNewTokens = !canCreateNewTokens;
        emit ToggleNewTokenCreation(canCreateNewTokens);
    }

    function royaltyInfo(uint256 _tokenId, uint256 _salePrice) external view override returns (address receiver, uint256 royaltyAmount) {
        uint256 totalRoyaltyAmount = (_salePrice * (CREATOR_ROYALTY + TREASURY_ROYALTY)) / 10000;
        return (treasuryAddress, totalRoyaltyAmount);
    }

    function mint(string memory _uri, uint256 maxSupply, uint256 mintAdditionalCost, bool antiWhale) external payable nonReentrant {
        require(canCreateNewTokens, "New token creation is disabled");
        require(maxSupply >= 1, "Max supply must be at least 1");
        require(msg.value == mintingFee, "Incorrect minting fee");

        currentTokenId += 1; // Increment token ID
        uint256 tokenId = currentTokenId;

        tokenDetails[tokenId] = TokenInfo({
            creator: msg.sender,
            uri: _uri,
            maxSupply: maxSupply,
            totalSupply: 1,
            mintAdditionalCost: mintAdditionalCost,
            accumulatedFees: 0,
            explosionStartTime: 0,
            isExploding: false,
            exploded: false,
            antiWhale: antiWhale
        });

        _safeTransfer(treasuryAddress, msg.value);

        _mint(msg.sender, tokenId, 1, "");
        tokenBalances[tokenId][msg.sender] = 1;
        emit TokenBalanceLogged(tokenId, msg.sender, 1);
        emit TokenMinted(tokenId, msg.sender, maxSupply, mintAdditionalCost);
    }

    function mintAdditional(uint256 tokenId, uint256 amount) external payable nonReentrant {
        TokenInfo storage token = tokenDetails[tokenId];
        require(token.creator != address(0), "Token ID not found");
        require(!token.exploded, "Cannot mint additional tokens after explosion");
        require(token.totalSupply + amount <= token.maxSupply, "Exceeds max supply");
        require(msg.value == token.mintAdditionalCost * amount, "Incorrect minting fee");

        if (token.antiWhale) {
            require(tokenBalances[tokenId][msg.sender] + amount <= token.maxSupply / 100, "Exceeds anti-whale limit");
        }

        token.totalSupply += amount;
        token.accumulatedFees += msg.value;
        _mint(msg.sender, tokenId, amount, "");
        tokenBalances[tokenId][msg.sender] += amount;
        emit TokenBalanceLogged(tokenId, msg.sender, tokenBalances[tokenId][msg.sender]);

        // Distribute the minting fee
        uint256 creatorFee = (msg.value * CREATOR_ROYALTY) / 10000;
        uint256 treasuryFee = (msg.value * TREASURY_ROYALTY) / 10000;

        _safeTransfer(token.creator, creatorFee);
        _safeTransfer(treasuryAddress, treasuryFee);
    }

    function explodeToken(uint256 tokenId) external nonReentrant {
        TokenInfo storage token = tokenDetails[tokenId];
        require(msg.sender == token.creator, "Only the token creator can initiate explosion");
        require(!token.isExploding, "Explosion already initiated");

        token.isExploding = true;
        token.explosionStartTime = block.timestamp; // Set the start time of the explosion
    }

    function finalizeExplosion(uint256 tokenId) external nonReentrant {
        TokenInfo storage token = tokenDetails[tokenId];
        require(token.isExploding, "Explosion not initiated");
        require(block.timestamp >= token.explosionStartTime + explosionDelay, "Explosion delay not passed"); // Ensure the delay has passed

        token.isExploding = false;
        token.exploded = true;

        emit TokenExploded(tokenId);
    }

    function claimShrapnel(uint256 tokenId) external nonReentrant {
        TokenInfo storage token = tokenDetails[tokenId];
        require(token.exploded, "Token has not exploded yet");
        uint256 holderBalance = tokenBalances[tokenId][msg.sender];
        require(holderBalance > 0, "No tokens to claim shrapnel for");

        uint256 totalSupply = token.totalSupply;
        require(totalSupply > 0, "Total supply is zero");

        uint256 payoutPerToken = (token.accumulatedFees * 94) / 100 / totalSupply; // Subtracting 6% royalties
        uint256 payout = holderBalance * payoutPerToken;

        require(payout > 0, "Payout is zero");

        payable(msg.sender).transfer(payout);
        _burn(msg.sender, tokenId, holderBalance);
        tokenBalances[tokenId][msg.sender] = 0;

        // Update accumulated fees after payout
        token.accumulatedFees -= payout;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        require(tokenDetails[tokenId].creator != address(0), "Token does not exist");
        return tokenDetails[tokenId].uri;
    }

    function _safeTransfer(address to, uint256 amount) private {
        (bool success, ) = to.call{value: amount}("");
        require(success, "Transfer failed");
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, IERC165) returns (bool) {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }
}
