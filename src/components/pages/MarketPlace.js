import React, { useEffect, useState } from "react";
import axios from "axios";
import { ethers, Contract } from "ethers";
import { SATS_ABI, SATS_ADDRESS } from "../Contracts/SatsContract";
import { MARKET_ABI, MARKET_ADDRESS } from "../Contracts/MarketContract";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth";
import { GiWhaleTail } from "react-icons/gi";

const MarketPlace = () => {
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tokenDetails, setTokenDetails] = useState({});
    const [selectedToken, setSelectedToken] = useState(null);
    const [sellOrders, setSellOrders] = useState([]);
    const [buyOrders, setBuyOrders] = useState([]);
    const [listPrice, setListPrice] = useState("");
    const [listAmount, setListAmount] = useState("");
    const [buyPrice, setBuyPrice] = useState("");
    const [buyAmount, setBuyAmount] = useState("");
    const [spendAvax, setSpendAvax] = useState("");
    const [isApproved, setIsApproved] = useState(false);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [view, setView] = useState('list');
    const [transfers, setTransfers] = useState([]);
    const navigate = useNavigate();
    const {
        account,
        web3Modal,
        loadWeb3Modal,
        web3Provider,
        setWeb3Provider,
        logoutOfWeb3Modal,
    } = useAuth();

    const [userSellOrders, setUserSellOrders] = useState([]);
    const [userBuyOrders, setUserBuyOrders] = useState([]);
    const [showUserOrders, setShowUserOrders] = useState(false);

    const tokenIdToName = tokens.reduce((acc, token) => {
        acc[token.tokenId] = token.metadata.name;
        return acc;
    }, {});

    const fetchUserOrders = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const marketContract = new Contract(MARKET_ADDRESS, MARKET_ABI, signer);

                // Fetch all sell orders
                const allSellOrders = [];
                for (let token of tokens) {
                    const sellOrders = await marketContract.getSellOrders(token.tokenId);
                    const userSellOrdersForToken = sellOrders
                        .filter(order => order.user.toLowerCase() === account.toLowerCase())
                        .map(order => ({ ...order, name: token.metadata.name }));
                    allSellOrders.push(...userSellOrdersForToken);
                }
                setUserSellOrders(allSellOrders);

                // Fetch all buy orders
                const allBuyOrders = [];
                for (let token of tokens) {
                    const buyOrders = await marketContract.getBuyOrders(token.tokenId);
                    const userBuyOrdersForToken = buyOrders
                        .filter(order => order.user.toLowerCase() === account.toLowerCase())
                        .map(order => ({ ...order, name: token.metadata.name }));
                    allBuyOrders.push(...userBuyOrdersForToken);
                }
                setUserBuyOrders(allBuyOrders);
            }
        } catch (error) {
            console.error("Error fetching user orders:", error);
        }
    };

    const getTimeAgo = (timestamp) => {
        const seconds = Math.floor((new Date() - new Date(timestamp * 1000)) / 1000);

        let interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";

        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";

        return Math.floor(seconds) + " seconds ago";
    };

    useEffect(() => {
        if (tokens.length > 0 && account) {
            fetchUserOrders();
        }
    }, [tokens, account, showUserOrders]);

    const formatSmallValue = (value) => {
        if (value < 0.0001 && value !== 0) {
            return value.toExponential(2); // 2 decimal places in exponent
        }
        return value.toFixed(8); // Default to 8 decimal places for small values
    };

    const formatLargeNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const formatPriceWithNotation = (price) => {
        const parts = price.split('.');
        if (parts.length === 1) return formatLargeNumber(price);

        const integerPart = formatLargeNumber(parts[0]);
        let decimalPart = parts[1];

        if (parseFloat(`0.${decimalPart}`) < 0.0001 && parseFloat(`0.${decimalPart}`) !== 0) {
            return formatSmallValue(parseFloat(price));
        }

        // Trim trailing zeros from the decimal part
        decimalPart = decimalPart.replace(/0+$/, '');

        return `${integerPart}.${decimalPart}`;
    };

    const formatEtherWithNotation = (value) => {
        const etherValue = parseFloat(ethers.utils.formatEther(value));
        return formatPriceWithNotation(etherValue.toString());
    };

    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const fetchAllItems = async () => {
        setLoading(true);
        let allFetchedTokens = [];
        let currentPageToken = null;
        const chainId = 43113;

        try {
            while (true) {
                const pageTokenParam = currentPageToken ? `&pageToken=${currentPageToken}` : "";
                const url = `https://glacier-api.avax.network/v1/chains/${chainId}/nfts/collections/${SATS_ADDRESS}/tokens?pageSize=100${pageTokenParam}`;
                const options = { method: "GET", headers: { accept: "application/json" } };

                const response = await axios.get(url, options);
                const data = response.data;
                if (Array.isArray(data.tokens)) {
                    allFetchedTokens = [...allFetchedTokens, ...data.tokens];
                    if (data.nextPageToken) {
                        currentPageToken = data.nextPageToken;
                    } else {
                        break;
                    }
                } else {
                    throw new Error(data.message || "Error fetching data");
                }
            }

            // Sort the tokens by latest minted (highest token ID number)
            allFetchedTokens.sort((a, b) => b.tokenId - a.tokenId);

            // Fetch token details for each token
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
              
                const satsContract = new Contract(SATS_ADDRESS, SATS_ABI, provider);
                const marketContract = new Contract(MARKET_ADDRESS, MARKET_ABI, provider);

                const fetchedTokenDetails = await Promise.all(
                    allFetchedTokens.map(async (token) => {
                        const details = await satsContract.tokenDetails(token.tokenId);
                        const sellOrders = await marketContract.getSellOrders(token.tokenId);
                        const clonedSellOrders = [...sellOrders]; // Clone the sellOrders array
                        const lowestSellOrder = clonedSellOrders.sort((a, b) => a.price - b.price)[0];
                        const marketCap = lowestSellOrder
                            ? calculateMarketCap(details, lowestSellOrder)
                            : 'N/A';
                        return {
                            tokenId: token.tokenId,
                            ...details,
                            lowestSellOrder,
                            marketCap,
                        };
                    })
                );

                const tokenDetailsMap = {};
                fetchedTokenDetails.forEach(details => {
                    tokenDetailsMap[details.tokenId] = details;
                });

                setTokens(allFetchedTokens);
                setTokenDetails(tokenDetailsMap);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async (tokenId) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const marketContract = new Contract(MARKET_ADDRESS, MARKET_ABI, signer);
                const sellOrders = await marketContract.getSellOrders(tokenId);
                const buyOrders = await marketContract.getBuyOrders(tokenId);
                setSellOrders(sellOrders.slice(0, 10));
                setBuyOrders(buyOrders.slice(0, 10).sort((a, b) => a.price - b.price));
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const fetchBalance = async (tokenId) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const satsContract = new Contract(SATS_ADDRESS, SATS_ABI, signer);
                const balance = await satsContract.balanceOf(account, tokenId);
                setTokenBalance(balance.toString());
            }
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    const checkApproval = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const satsContract = new Contract(SATS_ADDRESS, SATS_ABI, signer);
                const approved = await satsContract.isApprovedForAll(account, MARKET_ADDRESS);
                setIsApproved(approved);
            }
        } catch (error) {
            console.error("Error checking approval:", error);
        }
    };

    const approveMarketplace = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const satsContract = new Contract(SATS_ADDRESS, SATS_ABI, signer);
                const tx = await satsContract.setApprovalForAll(MARKET_ADDRESS, true);
                await tx.wait();
                setIsApproved(true);
                console.log("Marketplace approved:", tx.hash);
            }
        } catch (error) {
            console.error("Error approving marketplace:", error);
        }
    };

    const listTokenForSale = async (tokenId, price, amount) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const marketContract = new Contract(MARKET_ADDRESS, MARKET_ABI, signer);
                const tx = await marketContract.listToken(tokenId, ethers.utils.parseEther(price), amount);
                await tx.wait(); // Wait for the transaction to be confirmed
                console.log(tx.hash);
                // Re-fetch orders after listing a token
                fetchOrders(tokenId);
            }
        } catch (error) {
            console.error("Error listing token:", error);
            alert("Something is not as it should be.");
        }
    };

    const placeBuyOrder = async (tokenId, price, amount) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const marketContract = new Contract(MARKET_ADDRESS, MARKET_ABI, signer);
                const totalCost = ethers.utils.parseEther(price).mul(amount);
                const tx = await marketContract.placeBuyOrder(tokenId, ethers.utils.parseEther(price), amount, { value: totalCost.toString() });
                await tx.wait(); // Wait for the transaction to be confirmed
                console.log(tx.hash);
                // Re-fetch orders after placing a buy order
                fetchOrders(tokenId);
            }
        } catch (error) {
            console.error("Error placing buy order:", error);
            alert("Something is not as it should be.");
        }
    };

    const cancelSellOrder = async (tokenId, price, amount) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const marketContract = new Contract(MARKET_ADDRESS, MARKET_ABI, signer);
                const tx = await marketContract.cancelSellOrder(tokenId, price, amount);
                await tx.wait(); // Wait for the transaction to be confirmed
                console.log(tx.hash);
                // Re-fetch orders after cancelling a sell order
                fetchOrders(tokenId);
            }
        } catch (error) {
            console.error("Error cancelling sell order:", error);
            alert("An error occurred while cancelling the sell order.");
        }
    };

    const cancelBuyOrder = async (tokenId, price, amount) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const marketContract = new Contract(MARKET_ADDRESS, MARKET_ABI, signer);
                const tx = await marketContract.cancelBuyOrder(tokenId, price, amount);
                await tx.wait(); // Wait for the transaction to be confirmed
                console.log(tx.hash);
                // Re-fetch orders after cancelling a buy order
                fetchOrders(tokenId);
            }
        } catch (error) {
            console.error("Error cancelling buy order:", error);
            alert("An error occurred while cancelling the buy order.");
        }
    };

    const buyUpToLimit = async (tokenId, avaxLimit) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const marketContract = new Contract(MARKET_ADDRESS, MARKET_ABI, signer);
                const tx = await marketContract.buyUpToLimit(tokenId, ethers.utils.parseEther(avaxLimit), {
                    value: ethers.utils.parseEther(avaxLimit),
                    gasLimit: 3000000 // Increase the gas limit
                });
                await tx.wait(); // Wait for the transaction to be confirmed
                console.log(tx.hash);
                // Re-fetch orders after buying up to limit
                fetchOrders(tokenId);
            }
        } catch (error) {
            console.error("Error buying up to limit:", error);
            alert("You need to create a limit.");
        }
    };

    const selectToken = async (token) => {
        setSelectedToken(token);
        await fetchOrders(token.tokenId);
        await fetchBalance(token.tokenId);
        checkApproval();
        fetchRecentTransfers(token.tokenId);
    };

    const fetchRecentTransfers = async (tokenId) => {
        const chainId = 43113;
        const url = `https://glacier-api.avax.network/v1/chains/${chainId}/addresses/${SATS_ADDRESS}/transactions`;
        const options = { method: "GET", headers: { accept: "application/json" } };

        try {
            const response = await axios.get(url, options);
            const data = response.data;
            if (Array.isArray(data.transactions)) {
                setTransfers(data.transactions);
                console.log(transfers);
            } else {
                console.error("No transactions found");
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        fetchAllItems();
    }, []);

    const calculateMarketCap = (details, lowestSellOrder) => {
        if (!details || !lowestSellOrder) return 'N/A';
        const price = ethers.utils.formatEther(lowestSellOrder.price);
        const totalSupply = details.totalSupply.toString();
        return (price * totalSupply).toFixed(2);
    };

    return (
        <div className="relative min-h-screen font-mono text-white w-full md:w-3/5 sm:pt-24">
            <div className="flex justify-between mb-4 space-x-2">
                <button
                    onClick={() => navigate('/sats')}
                    className="flex-1 px-4 py-2 rounded bg-blue-500 hover:bg-blue-700 text-white font-bold"
                >
                    Create SATs
                </button>
                <button
                    onClick={() => navigate('/satsgallery')}
                    className="flex-1 px-4 py-2 rounded bg-blue-500 hover:bg-blue-700 text-white font-bold"
                >
                    Mint SATs
                </button>
                <button
                    onClick={() => navigate('/market')}
                    disabled={true}
                    className={`flex-1 px-4 py-2 rounded font-bold text-white ${
                        true ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-700'
                    }`}
                >
                    SATs Marketplace
                </button>
            </div>
            <h1 className="text-3xl font-bold mb-4 pt-16">SATs Marketplace</h1>
            <div className="flex justify-end mb-4">
                <button
                    className={`px-4 py-2 rounded ${view === 'card' ? 'bg-blue-500' : 'bg-gray-700'}`}
                    onClick={() => setView('card')}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <rect x="4" y="4" width="7" height="7" stroke="currentColor" strokeWidth="2"></rect>
                        <rect x="13" y="4" width="7" height="7" stroke="currentColor" strokeWidth="2"></rect>
                        <rect x="4" y="13" width="7" height="7" stroke="currentColor" strokeWidth="2"></rect>
                        <rect x="13" y="13" width="7" height="7" stroke="currentColor" strokeWidth="2"></rect>
                    </svg>
                </button>
                <button
                    className={`px-4 py-2 rounded ml-2 ${view === 'list' ? 'bg-blue-500' : 'bg-gray-700'}`}
                    onClick={() => setView('list')}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2"></line>
                        <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2"></line>
                        <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2"></line>
                    </svg>
                </button>
                <button
                    className={`px-4 py-2 rounded ml-2 ${showUserOrders ? 'bg-blue-500' : 'bg-gray-700'}`}
                    onClick={() => setShowUserOrders(true)}
                >
                    My Orders
                </button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : view === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-24">
                    {tokens.map((token) => {
                        const details = tokenDetails[token.tokenId];
                        if (!details) return null;

                        return (
                            <div key={token.tokenId} className="bg-gray-800 p-4 rounded shadow cursor-pointer" onClick={() => selectToken(token)}>
                                <img 
                                    src={`https://gateway.ipfs.io/ipfs/${token.metadata.imageUri.split("ipfs://")[1]}`} 
                                    alt={token.metadata.name} 
                                    className="w-full h-auto mb-2 rounded" 
                                />
                                <div className="mb-2">
                                    <h2 className="text-4xl font-bold mb-2 text-spot-yellow">{token.metadata.name}</h2>
                                    <div className="pt-2 pb-2 bg-gray-700 rounded-md"><p>Total Supply: {formatNumber(details.maxSupply.toString())}</p></div>
                                    <div className="pt-2 pb-2"><p className="">Current Supply: {formatNumber(details.totalSupply.toString())}</p></div>
                                    <div className="pt-2 pb-2 bg-gray-700 rounded-md"><p>Mint Price: {formatEtherWithNotation(details.mintAdditionalCost.toString())} AVAX</p></div>
                                    <div className="pt-2 pb-2"><p>Lowest Sell Order: {details.lowestSellOrder ? formatEtherWithNotation(details.lowestSellOrder.price) : 'N/A'} AVAX</p></div>
                                    <div className="pt-2 pb-2 bg-gray-700 rounded-md"><p className="">Anti-Whale Protection: {details.antiWhale ? "Enabled" : "Disabled"}</p></div>
                                    <div className="pt-2 pb-2"><p className="text-spot-yellow">Market Cap: {details.marketCap.toString()} AVAX</p></div>
                                    <div className="pt-2 pb-2 bg-gray-700 rounded-md">
                                        <p className="text-xs break-words">
                                            Creator: 
                                            <a 
                                                href={`https://snowscan.xyz/address/${details.creator}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-spot-yellow underline pl-4"
                                            >
                                                {details.creator.slice(0, 4)}...{details.creator.slice(-4)}
                                            </a>
                                        </p>
                                    </div>
                                    <div className="pt-2"><p className="">Exploded: {details.exploded.toString()}</p></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 pt-24">
                    <div className="p-4 rounded shadow flex items-center hidden md:flex">
                        <div className="w-16 h-16"></div> {/* Placeholder for image column */}
                        <div className="ml-4 flex flex-col md:flex-row md:items-center w-full">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-spot-yellow">Name</h2>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold">Current Supply</h2>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold">Lowest Sell Order</h2>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold">Market Cap</h2>
                            </div>
                        </div>
                    </div>
                    {tokens.map((token) => {
                        const details = tokenDetails[token.tokenId];
                        if (!details) return null;

                        return (
                            <div key={token.tokenId} className="bg-gray-800 p-4 shadow flex items-center cursor-pointer" onClick={() => selectToken(token)}>
                                <img 
                                    src={`https://gateway.ipfs.io/ipfs/${token.metadata.imageUri.split("ipfs://")[1]}`} 
                                    alt={token.metadata.name} 
                                    className="w-16 h-16 object-cover rounded" 
                                />
                                <div className="ml-4 flex flex-col md:flex-row md:items-center w-full">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-spot-yellow">{token.metadata.name}</h2>
                                        <p className="md:hidden">Current Supply: {formatNumber(details.totalSupply.toString())}</p>
                                        <p className="md:hidden flex items-center"><div className="pr-2">Lowest Sell Order: {details.lowestSellOrder ? formatEtherWithNotation(details.lowestSellOrder.price) : 'N/A'} AVAX</div>{!details.antiWhale && (
                                                <GiWhaleTail />
                                            )}</p>
                                        <p className="md:hidden">Market Cap: {details.marketCap} AVAX</p>
                                    </div>
                                    <div className="flex-1 hidden md:block">
                                        <p>{formatNumber(details.totalSupply.toString())}</p>
                                    </div>
                                    <div className="flex-1 hidden md:block">
                                    <div className="flex items-center justify-center mx-auto">
        <p className="flex items-center">
                                        {details.lowestSellOrder ? formatEtherWithNotation(details.lowestSellOrder.price) : 'N/A'} AVAX {!details.antiWhale && (
                <GiWhaleTail className="ml-2" />
            )}
        </p>
    </div>
</div>
                                    <div className="flex-1 hidden md:block">
                                        <p>{details.marketCap} AVAX</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedToken && (
                <div className="fixed inset-0 flex items-start justify-center pt-16 bg-black bg-opacity-75 overflow-y-auto">
                    <div className="bg-gray-900 p-4 rounded shadow-lg max-w-6xl w-full relative">
                        <button 
                            onClick={() => setSelectedToken(null)} 
                            className="text-white font-bold absolute top-2 right-2"
                        >
                            Close
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h2 className="text-4xl font-bold mb-2 text-spot-yellow">{selectedToken.metadata.name}</h2>
                                <img 
                                    src={`https://gateway.ipfs.io/ipfs/${selectedToken.metadata.imageUri.split("ipfs://")[1]}`} 
                                    alt={selectedToken.metadata.name} 
                                    className="w-full h-auto mb-2 rounded" 
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-4">Recent Transfers</h3>
                                <div className="grid grid-cols-6 gap-4 pb-4 border-b-2 border-gray-700">
                <div className="text-gray-400 col-span-1">Seller</div>
                <div className="text-gray-400 col-span-1">Buyer</div>
                <div className="text-gray-400 col-span-2">Value</div>
                <div className="text-gray-400 col-span-2">Time Ago</div>
            </div>
                              
                                {transfers.map((tx, index) => (
                <div key={index} className="grid grid-cols-6 gap-4 py-2 border-b-2 border-gray-700">
                    <div className="col-span-1 text-red-700">{tx.nativeTransaction.from.address.slice(-4)}</div>
                    <div className="col-span-1 text-green-700">{tx.nativeTransaction.to.address.slice(-4)}</div>
                    <div className="col-span-2">{formatEtherWithNotation(tx.nativeTransaction.value.toString())} AVAX</div>
                    <div className="col-span-2">{getTimeAgo(tx.nativeTransaction.blockTimestamp)}</div>
                </div>
            ))}
                                
                            </div>
                        </div>
                        <p className="text-center pb-4 pt-4">Your Token Balance: {tokenBalance}</p>
                        <p className="pb-4 text-spot-yellow font-bold text-lg">Market Cap: {tokenDetails[selectedToken.tokenId]?.marketCap} AVAX</p>
                        {!isApproved && (
                            <div className="pt-4 pb-4"> 
                                <button
                                    onClick={approveMarketplace}
                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold w-full px-4 py-2 rounded mb-2"
                                >
                                    Approve Marketplace to Sell Tokens
                                </button>
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="mb-4 w-full pr-4">
                                <h3 className="text-xl font-bold mb-2">Create Sell Order</h3>
                                <input
                                    type="text"
                                    placeholder="Price in AVAX"
                                    value={listPrice}
                                    onChange={(e) => setListPrice(e.target.value)}
                                    className="bg-gray-700 text-white font-bold py-2 px-4 rounded w-full mb-2 placeholder:text-xs md:placeholder:text-base"
                                />
                                <input
                                    type="number"
                                    placeholder="Token Amount"
                                    value={listAmount}
                                    onChange={(e) => setListAmount(e.target.value)}
                                    className="bg-gray-700 text-white font-bold py-2 px-4 rounded w-full mb-2 placeholder:text-xs md:placeholder:text-base"
                                />
                                <button
                                    onClick={() => listTokenForSale(selectedToken.tokenId, listPrice, listAmount)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-full px-4 py-2 rounded"
                                >
                                    List for Sale
                                </button>
                            </div>
                            <div className="mb-4 w-full">
                                <h3 className="text-xl font-bold mb-2">Create Buy Order</h3>
                                <input
                                    type="text"
                                    placeholder="Price in AVAX"
                                    value={buyPrice}
                                    onChange={(e) => setBuyPrice(e.target.value)}
                                    className="bg-gray-700 text-white font-bold py-2 px-4 rounded w-full mb-2 placeholder:text-xs md:placeholder:text-base"
                                />
                                <input
                                    type="number"
                                    placeholder="Token Amount"
                                    value={buyAmount}
                                    onChange={(e) => setBuyAmount(e.target.value)}
                                    className="bg-gray-700 text-white font-bold py-2 px-4 rounded w-full mb-2 placeholder:text-xs md:placeholder:text-base"
                                />
                                <button
                                    onClick={() => placeBuyOrder(selectedToken.tokenId, buyPrice, buyAmount)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-full px-4 py-2 rounded"
                                >
                                    Place Buy Order
                                </button>
                            </div>
                            <div className="mb-4 w-full pl-4">
                                <h3 className="text-xl font-bold mb-2">Buy Tokens Up to Limit</h3>
                                <input
                                    type="text"
                                    placeholder="AVAX to Spend"
                                    value={spendAvax}
                                    onChange={(e) => setSpendAvax(e.target.value)}
                                    className="bg-gray-700 text-white font-bold py-2 px-4 rounded w-full mb-2 placeholder:text-xs md:placeholder:text-base"
                                />
                                <button
                                    onClick={() => buyUpToLimit(selectedToken.tokenId, spendAvax)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-full px-4 py-2 rounded"
                                >
                                    Buy Up to Limit
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold mb-2 border-b-2 border-gray-700">Sell Orders</h3>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="text-gray-400">Price</div>
                                    <div className="text-gray-400">Amount</div>
                                    <div className="text-gray-400">Total</div>
                                    <div></div>
                                </div>
                                {sellOrders.length > 0 ? (
                                    sellOrders.map((order, index) => (
                                        <div key={index} className="grid grid-cols-4 gap-4 border-b-2 border-gray-700 p-2 text-sm items-center">
                                            <div>{formatEtherWithNotation(order.price)}</div>
                                            <div>{order.amount.toString()}</div>
                                            <div>{(ethers.utils.formatEther(order.price) * order.amount).toFixed(2)} AVAX</div>
                                            <div className="text-right">
                                                {order.user.toLowerCase() === account.toLowerCase() && (
                                                    <button
                                                        onClick={() => cancelSellOrder(order.tokenId, order.price, order.amount)}
                                                        className="bg-red-500 hover:bg-red-700 text-white font-bold px-2 py-1 rounded"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No sell orders available.</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <h3 className="text-lg font-bold mb-2 border-b-2 border-gray-700">Buy Orders</h3>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="text-gray-400">Price</div>
                                    <div className="text-gray-400">Amount</div>
                                    <div className="text-gray-400">Total</div>
                                    <div></div>
                                </div>
                                {buyOrders.length > 0 ? (
                                    buyOrders.map((order, index) => (
                                        <div key={index} className="grid grid-cols-4 gap-4 border-b-2 border-gray-700 text-sm p-2 items-center">
                                            <div>{formatEtherWithNotation(order.price)}</div>
                                            <div>{order.amount.toString()}</div>
                                            <div>{(ethers.utils.formatEther(order.price) * order.amount).toFixed(2)} AVAX</div>
                                            <div className="text-right">
                                                {order.user.toLowerCase() === account.toLowerCase() && (
                                                    <button
                                                        onClick={() => cancelBuyOrder(order.tokenId, order.price, order.amount)}
                                                        className="bg-red-500 hover:bg-red-700 text-white font-bold px-2 py-1 rounded"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No buy orders available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showUserOrders && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="bg-gray-900 p-4 rounded shadow-lg max-w-6xl w-full relative">
                        <button 
                            onClick={() => setShowUserOrders(false)} 
                            className="text-white font-bold absolute top-2 right-2"
                        >
                            Close
                        </button>
                        <h3 className="text-2xl font-bold mb-4 text-spot-yellow">My Orders</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold mb-2 border-b-2 border-gray-700">My Sell Orders</h3>
                                <div className="grid grid-cols-5 gap-4">
                                    <div className="text-gray-400">Ticker</div>
                                    <div className="text-gray-400">Price</div>
                                    <div className="text-gray-400">Amount</div>
                                    <div className="text-gray-400">Total</div>
                                    <div></div>
                                </div>
                                {userSellOrders.length > 0 ? (
                                    userSellOrders.map((order, index) => (
                                        <div key={index} className="grid grid-cols-5 gap-4 border-b-2 border-gray-700 p-2 text-sm items-center">
                                            <div className="">{order.name}</div>
                                            <div>{formatEtherWithNotation(order.price)}</div>
                                            <div>{order.amount.toString()}</div>
                                            <div>{(ethers.utils.formatEther(order.price) * order.amount).toFixed(2)} AVAX</div>
                                            <div className="text-right">
                                                <button
                                                    onClick={() => cancelSellOrder(order.tokenId, order.price, order.amount)}
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold px-2 py-1 rounded"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No sell orders available.</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <h3 className="text-lg font-bold mb-2 border-b-2 border-gray-700">My Buy Orders</h3>
                                <div className="grid grid-cols-5 gap-4">
                                <div className="text-gray-400">Ticker</div>
                                    <div className="text-gray-400">Price</div>
                                    <div className="text-gray-400">Amount</div>
                                    <div className="text-gray-400">Total</div>
                                    <div></div>
                                </div>
                                {userBuyOrders.length > 0 ? (
                                    userBuyOrders.map((order, index) => (
                                        <div key={index} className="grid grid-cols-5 gap-4 border-b-2 border-gray-700 text-sm p-2 items-center">
                                             <div>{order.name}</div>
                                            <div>{formatEtherWithNotation(order.price)}</div>
                                            <div>{order.amount.toString()}</div>
                                            <div>{(ethers.utils.formatEther(order.price) * order.amount).toFixed(2)} AVAX</div>
                                            <div className="text-right">
                                                <button
                                                    onClick={() => cancelBuyOrder(order.tokenId, order.price, order.amount)}
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold px-2 py-1 rounded"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No buy orders available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <footer className=" text-white text-center py-4 pt-24">
                <p>
                    As a platform, we do not condone or support any tokens created or traded on this platform. All users are responsible for their own actions and decisions regarding token transactions. Use at your own risk.
                </p>
            </footer>
        </div>
    );
};

export default MarketPlace;
