import React, { useEffect, useState } from "react";
import axios from "axios";
import { ethers, Contract } from "ethers";
import { SATS_ABI, SATS_ADDRESS } from "../Contracts/SatsContract";
import { MARKET_ABI, MARKET_ADDRESS } from "../Contracts/MarketContract";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth";

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
    const navigate = useNavigate();
    const {
        account,
        web3Modal,
        loadWeb3Modal,
        web3Provider,
        setWeb3Provider,
        logoutOfWeb3Modal,
    } = useAuth();

    const formatPriceWithNotation = (price) => {
        const parts = price.split('.');
        if (parts.length === 1) return price;

        const integerPart = parts[0];
        let decimalPart = parts[1];

        const leadingZeros = decimalPart.match(/^0+/);
        const zeroCount = leadingZeros ? leadingZeros[0].length : 0;

        decimalPart = decimalPart.replace(/^0+/, '');

        return (
            <span>
                {integerPart}.0{zeroCount > 0 && <sup>{`(${zeroCount})`}</sup>}{decimalPart}
            </span>
        );
    };

    const formatEtherWithNotation = (value) => {
        return formatPriceWithNotation(ethers.utils.formatEther(value));
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
                const signer = provider.getSigner();
                const satsContract = new Contract(SATS_ADDRESS, SATS_ABI, signer);
                const marketContract = new Contract(MARKET_ADDRESS, MARKET_ABI, signer);
    
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
            alert(error.message || "An error occurred while listing the token for sale.");
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
            alert(error.message || "An error occurred while placing the buy order.");
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
            alert(error.message || "An error occurred while cancelling the sell order.");
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
            alert(error.message || "An error occurred while cancelling the buy order.");
        }
    };

    const buyToken = async (order) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const marketContract = new Contract(MARKET_ADDRESS, MARKET_ABI, signer);
                const totalCost = ethers.utils.parseUnits(order.price.toString(), 'wei').mul(order.amount);
                const tx = await marketContract.buyToken(order.tokenId, order.price, order.amount, { value: totalCost.toString() });
                await tx.wait(); // Wait for the transaction to be confirmed
                console.log(tx.hash);
                // Re-fetch orders after buying a token
                fetchOrders(order.tokenId);
            }
        } catch (error) {
            console.error("Error buying token:", error);
            alert(error.message || "An error occurred while buying the token.");
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
            alert(error.message || "An error occurred while buying tokens up to the limit.");
        }
    };

    const selectToken = async (token) => {
        setSelectedToken(token);
        await fetchOrders(token.tokenId);
        await fetchBalance(token.tokenId);
        checkApproval();
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
        <div className="relative min-h-screen font-mono text-white w-full md:w-3/5">
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
                                <h2 className="text-2xl font-bold mb-2">{token.metadata.name}</h2>
                                <img 
                                    src={`https://gateway.ipfs.io/ipfs/${token.metadata.imageUri.split("ipfs://")[1]}`} 
                                    alt={token.metadata.name} 
                                    className="w-full h-auto mb-2" 
                                />
                                <div className="mb-2">
                                    <p>Total Supply: {details.maxSupply.toString()}</p>
                                    <p className="text-spot-yellow">Current Supply: {details.totalSupply.toString()}</p>
                                    <p>Mint Price: {formatEtherWithNotation(details.mintAdditionalCost.toString())} AVAX</p>
                                    <p className="text-spot-yellow">Anti-Whale Protection: {details.antiWhale ? "Enabled" : "Disabled"}</p>
                                    <p className="text-xs break-words">Creator: {details.creator}</p>
                                    <p className="pt-4 text-spot-yellow">Exploded: {details.exploded.toString()}</p>
                                    <p>Lowest Sell Order: {details.lowestSellOrder ? formatEtherWithNotation(details.lowestSellOrder.price) : 'N/A'} AVAX</p>
                                    <p className="text-spot-yellow">Market Cap: {details.marketCap.toString()} AVAX</p>
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
                                <h2 className="text-xl font-bold">Name</h2>
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
                                        <h2 className="text-xl font-bold">{token.metadata.name}</h2>
                                        <p className="md:hidden">Current Supply: {details.totalSupply.toString()}</p>
                                        <p className="md:hidden">Lowest Sell Order: {details.lowestSellOrder ? formatEtherWithNotation(details.lowestSellOrder.price) : 'N/A'} AVAX</p>
                                        <p className="md:hidden">Market Cap: {details.marketCap} AVAX</p>
                                    </div>
                                    <div className="flex-1 hidden md:block">
                                        <p>{details.totalSupply.toString()}</p>
                                    </div>
                                    <div className="flex-1 hidden md:block">
                                        <p>{details.lowestSellOrder ? formatEtherWithNotation(details.lowestSellOrder.price) : 'N/A'} AVAX</p>
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
                        <h2 className="text-2xl font-bold mb-2">{selectedToken.metadata.name}</h2>
                        <img 
                            src={`https://gateway.ipfs.io/ipfs/${selectedToken.metadata.imageUri.split("ipfs://")[1]}`} 
                            alt={selectedToken.metadata.name} 
                            className="w-1/2 mx-auto h-auto mb-2" 
                        />
                        
                        <p className="text-center pb-4 pt-4">Your Token Balance: {tokenBalance}</p>
                        <p className="pb-4">Market Cap: {tokenDetails[selectedToken.tokenId]?.marketCap} AVAX</p>
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
                                    className="bg-gray-700 text-white font-bold py-2 px-4 rounded w-full mb-2"
                                />
                                <input
                                    type="number"
                                    placeholder="Token Amount"
                                    value={listAmount}
                                    onChange={(e) => setListAmount(e.target.value)}
                                    className="bg-gray-700 text-white font-bold py-2 px-4 rounded w-full mb-2"
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
                                    className="bg-gray-700 text-white font-bold py-2 px-4 rounded w-full mb-2"
                                />
                                <input
                                    type="number"
                                    placeholder="Token Amount"
                                    value={buyAmount}
                                    onChange={(e) => setBuyAmount(e.target.value)}
                                    className="bg-gray-700 text-white font-bold py-2 px-4 rounded w-full mb-2"
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
                                    className="bg-gray-700 text-white font-bold py-2 px-4 rounded w-full mb-2"
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
                                                {order.user.toLowerCase() === account.toLowerCase() ? (
                                                    <button
                                                        onClick={() => cancelSellOrder(order.tokenId, order.price, order.amount)}
                                                        className="bg-red-500 hover:bg-red-700 text-white font-bold px-2 py-1 rounded"
                                                    >
                                                        Cancel
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => buyToken(order)}
                                                        className="bg-green-500 hover:bg-green-700 text-white font-bold px-2 py-1 rounded"
                                                    >
                                                        Buy
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
        </div>
    );
};

export default MarketPlace;
