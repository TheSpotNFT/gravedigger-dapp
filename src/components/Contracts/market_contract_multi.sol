// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SatsMarketplaceMultiV0 is Ownable {
    struct Order {
        address user;
        uint256 tokenId;
        uint256 price;
        uint256 amount;
    }

    // Mapping from token contract address to sell orders mapping: tokenId => array of sell orders
    mapping(address => mapping(uint256 => Order[])) public sellOrders;
    // Mapping from token contract address to buy orders mapping: tokenId => array of buy orders
    mapping(address => mapping(uint256 => Order[])) public buyOrders;
    // Mapping to keep track of allowed token contracts
    mapping(address => bool) public allowedTokenContracts;

    address public treasuryWallet;
    uint256 public royaltyPercent;

    event TokenListed(address indexed seller, address indexed tokenContract, uint256 indexed tokenId, uint256 price, uint256 amount);
    event TokenBought(address indexed buyer, address indexed seller, address indexed tokenContract, uint256 tokenId, uint256 price, uint256 amount);
    event BuyOrderPlaced(address indexed buyer, address indexed tokenContract, uint256 indexed tokenId, uint256 price, uint256 amount);
    event BuyOrderFulfilled(address indexed seller, address indexed buyer, address indexed tokenContract, uint256 tokenId, uint256 price, uint256 amount);
    event TokenContractAdded(address indexed tokenContract);
    event TokenContractRemoved(address indexed tokenContract);

    constructor(address _treasuryWallet, uint256 _royaltyPercent) Ownable() {
        require(_treasuryWallet != address(0), "Invalid treasury wallet address");
        require(_royaltyPercent > 0 && _royaltyPercent < 100, "Invalid royalty percentage");

        treasuryWallet = _treasuryWallet;
        royaltyPercent = _royaltyPercent;
    }

    modifier onlyAllowedToken(address _tokenContract) {
        require(allowedTokenContracts[_tokenContract], "Token contract not allowed");
        _;
    }

    function addTokenContract(address _tokenContract) external onlyOwner {
        require(_tokenContract != address(0), "Invalid token contract address");
        allowedTokenContracts[_tokenContract] = true;
        emit TokenContractAdded(_tokenContract);
    }

    function removeTokenContract(address _tokenContract) external onlyOwner {
        require(allowedTokenContracts[_tokenContract], "Token contract not allowed");
        delete allowedTokenContracts[_tokenContract];
        emit TokenContractRemoved(_tokenContract);
    }

    function listToken(address _tokenContract, uint256 tokenId, uint256 price, uint256 amount) external onlyAllowedToken(_tokenContract) {
        require(price > 0, "Price must be greater than 0");
        require(amount > 0, "Amount must be greater than 0");
        require(ERC1155(_tokenContract).balanceOf(msg.sender, tokenId) >= amount, "Insufficient token balance");
        require(ERC1155(_tokenContract).isApprovedForAll(msg.sender, address(this)), "Marketplace not approved to manage tokens");

        // Fulfill matching buy orders
        uint256 remainingAmount = amount;
        Order[] storage buyOrdersList = buyOrders[_tokenContract][tokenId];
        for (uint256 i = 0; i < buyOrdersList.length && remainingAmount > 0; ) {
            if (buyOrdersList[i].price >= price) {
                uint256 tradeAmount = remainingAmount < buyOrdersList[i].amount ? remainingAmount : buyOrdersList[i].amount;

                // Transfer tokens from seller to buyer
                ERC1155(_tokenContract).safeTransferFrom(msg.sender, buyOrdersList[i].user, tokenId, tradeAmount, "");

                // Calculate royalties
                uint256 totalCost = buyOrdersList[i].price * tradeAmount;
                uint256 royalty = (totalCost * royaltyPercent) / 100;
                uint256 sellerProceeds = totalCost - royalty;

                // Transfer Ether to the seller and treasury
                payable(msg.sender).transfer(sellerProceeds);
                payable(treasuryWallet).transfer(royalty);

                emit TokenBought(buyOrdersList[i].user, msg.sender, _tokenContract, tokenId, buyOrdersList[i].price, tradeAmount);

                // Update the buy order
                buyOrdersList[i].amount -= tradeAmount;
                remainingAmount -= tradeAmount;

                // Remove the order if amount is 0
                if (buyOrdersList[i].amount == 0) {
                    buyOrdersList[i] = buyOrdersList[buyOrdersList.length - 1];
                    buyOrdersList.pop();
                }
            } else {
                i++;
            }
        }

        // Add remaining amount to sell orders if not fully matched
        if (remainingAmount > 0) {
            sellOrders[_tokenContract][tokenId].push(Order({
                user: msg.sender,
                tokenId: tokenId,
                price: price,
                amount: remainingAmount
            }));

            // Sort orders by price
            Order[] storage orders = sellOrders[_tokenContract][tokenId];
            for (uint i = orders.length - 1; i > 0; i--) {
                if (orders[i].price < orders[i - 1].price) {
                    Order memory temp = orders[i];
                    orders[i] = orders[i - 1];
                    orders[i - 1] = temp;
                } else {
                    break;
                }
            }

            emit TokenListed(msg.sender, _tokenContract, tokenId, price, remainingAmount);
        }
    }

    function placeBuyOrder(address _tokenContract, uint256 tokenId, uint256 price, uint256 amount) external payable onlyAllowedToken(_tokenContract) {
        require(price > 0, "Price must be greater than 0");
        require(amount > 0, "Amount must be greater than 0");
        require(msg.value == price * amount, "Incorrect Ether value sent");

        // Fulfill matching sell orders
        uint256 remainingAmount = amount;
        Order[] storage sellOrdersList = sellOrders[_tokenContract][tokenId];
        for (uint256 i = 0; i < sellOrdersList.length && remainingAmount > 0; ) {
            if (sellOrdersList[i].price <= price) {
                uint256 tradeAmount = remainingAmount < sellOrdersList[i].amount ? remainingAmount : sellOrdersList[i].amount;

                // Transfer tokens from seller to buyer
                ERC1155(_tokenContract).safeTransferFrom(sellOrdersList[i].user, msg.sender, tokenId, tradeAmount, "");

                // Calculate royalties
                uint256 totalCost = sellOrdersList[i].price * tradeAmount;
                uint256 royalty = (totalCost * royaltyPercent) / 100;
                uint256 sellerProceeds = totalCost - royalty;

                // Transfer Ether to the seller and treasury
                payable(sellOrdersList[i].user).transfer(sellerProceeds);
                payable(treasuryWallet).transfer(royalty);

                emit TokenBought(msg.sender, sellOrdersList[i].user, _tokenContract, tokenId, sellOrdersList[i].price, tradeAmount);

                // Update the sell order
                sellOrdersList[i].amount -= tradeAmount;
                remainingAmount -= tradeAmount;

                // Remove the order if amount is 0
                if (sellOrdersList[i].amount == 0) {
                    sellOrdersList[i] = sellOrdersList[sellOrdersList.length - 1];
                    sellOrdersList.pop();
                } else {
                    i++;
                }
            } else {
                i++;
            }
        }

        // Add remaining amount to buy orders if not fully matched
        if (remainingAmount > 0) {
            buyOrders[_tokenContract][tokenId].push(Order({
                user: msg.sender,
                tokenId: tokenId,
                price: price,
                amount: remainingAmount
            }));

            // Sort orders by price
            Order[] storage orders = buyOrders[_tokenContract][tokenId];
            for (uint i = orders.length - 1; i > 0; i--) {
                if (orders[i].price > orders[i - 1].price) {
                    Order memory temp = orders[i];
                    orders[i] = orders[i - 1];
                    orders[i - 1] = temp;
                } else {
                    break;
                }
            }

            emit BuyOrderPlaced(msg.sender, _tokenContract, tokenId, price, remainingAmount);
        }
    }

    function buyUpToLimit(address _tokenContract, uint256 tokenId, uint256 avaxLimit) external payable onlyAllowedToken(_tokenContract) {
        require(msg.value == avaxLimit, "Incorrect Ether value sent");

        Order[] storage orders = sellOrders[_tokenContract][tokenId];
        uint256 remainingValue = avaxLimit;

        for (uint256 i = 0; i < orders.length && remainingValue > 0; ) {
            uint256 tradeValue = orders[i].price * orders[i].amount;
            uint256 tradeAmount;

            if (tradeValue <= remainingValue) {
                tradeAmount = orders[i].amount;
            } else {
                tradeAmount = remainingValue / orders[i].price;
            }

            // Transfer tokens from seller to buyer
            ERC1155(_tokenContract).safeTransferFrom(orders[i].user, msg.sender, tokenId, tradeAmount, "");

            // Calculate royalties
            uint256 royalty = (orders[i].price * tradeAmount * royaltyPercent) / 100;
            uint256 sellerProceeds = orders[i].price * tradeAmount - royalty;

            // Transfer Ether to the seller and treasury
            payable(orders[i].user).transfer(sellerProceeds);
            payable(treasuryWallet).transfer(royalty);

            emit TokenBought(msg.sender, orders[i].user, _tokenContract, tokenId, orders[i].price, tradeAmount);

            remainingValue -= orders[i].price * tradeAmount;

            // Update the sell order
            orders[i].amount -= tradeAmount;

            // Remove the order if amount is 0
            if (orders[i].amount == 0) {
                orders[i] = orders[orders.length - 1];
                orders.pop();
            } else {
                i++;
            }
        }

        if (remainingValue > 0) {
            payable(msg.sender).transfer(remainingValue);
        }
    }

    function cancelSellOrder(address _tokenContract, uint256 tokenId, uint256 price, uint256 amount) external onlyAllowedToken(_tokenContract) {
        Order[] storage orders = sellOrders[_tokenContract][tokenId];
        for (uint256 i = 0; i < orders.length; i++) {
            if (orders[i].user == msg.sender && orders[i].price == price && orders[i].amount == amount) {
                orders[i] = orders[orders.length - 1];
                orders.pop();
                return;
            }
        }
        revert("Sell order not found");
    }

    function cancelBuyOrder(address _tokenContract, uint256 tokenId, uint256 price, uint256 amount) external onlyAllowedToken(_tokenContract) {
        Order[] storage orders = buyOrders[_tokenContract][tokenId];
        for (uint256 i = 0; i < orders.length; i++) {
            if (orders[i].user == msg.sender && orders[i].price == price && orders[i].amount == amount) {
                payable(msg.sender).transfer(price * amount);
                orders[i] = orders[orders.length - 1];
                orders.pop();
                return;
            }
        }
        revert("Buy order not found");
    }

    function getSellOrders(address _tokenContract, uint256 tokenId) external view onlyAllowedToken(_tokenContract) returns (Order[] memory) {
        return sellOrders[_tokenContract][tokenId];
    }

    function getBuyOrders(address _tokenContract, uint256 tokenId) external view onlyAllowedToken(_tokenContract) returns (Order[] memory) {
        return buyOrders[_tokenContract][tokenId];
    }

    function setTreasuryWallet(address _treasuryWallet) external onlyOwner {
        require(_treasuryWallet != address(0), "Invalid treasury wallet address");
        treasuryWallet = _treasuryWallet;
    }

    function setRoyaltyPercent(uint256 _royaltyPercent) external onlyOwner {
        require(_royaltyPercent > 0 && _royaltyPercent < 100, "Invalid royalty percentage");
        royaltyPercent = _royaltyPercent;
    }
}
