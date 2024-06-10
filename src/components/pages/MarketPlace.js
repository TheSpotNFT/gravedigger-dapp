import React, { useEffect, useState } from "react";
import axios from "axios";
import { ethers, Contract } from "ethers";
import { SATS_ABI, SATS_ADDRESS } from "../Contracts/SatsContract";
import { MARKET_ABI, MARKET_ADDRESS } from "../Contracts/MarketContract";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth";

const SatsGallery = () => {
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tokenDetails, setTokenDetails] = useState({});
    const [selectedToken, setSelectedToken] = useState(null);
    const [sellOrders, setSellOrders] = useState([]);
    const [listPrice, setListPrice] = useState("");
    const navigate = useNavigate();
    const {
        account,
        web3Modal,
        loadWeb3Modal,
        web3Provider,
        setWeb3Provider,
        logoutOfWeb3Modal,
    } = useAuth();

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

            // Fetch token details for each token
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const satsContract = new Contract(SATS_ADDRESS, SATS_ABI, signer);

                const fetchedTokenDetails = await Promise.all(
                    allFetchedTokens.map(async (token) => {
                        const details = await satsContract.tokenDetails(token.tokenId);
                        return {
                            tokenId: token.tokenId,
                            ...details,
                        };
                    })
                );

                // Filter tokens where totalSupply equals currentSupply
                const filteredTokens = fetchedTokenDetails.filter(details => 
                    details.totalSupply.eq(details.maxSupply)
                );

                const tokenDetailsMap = {};
                filteredTokens.forEach(details => {
                    tokenDetailsMap[details.tokenId] = details;
                });

                setTokens(filteredTokens.map(token => ({
                    tokenId: token.tokenId,
                    metadata: allFetchedTokens.find(t => t.tokenId === token.tokenId).metadata
                })));
                setTokenDetails(tokenDetailsMap);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSellOrders = async (tokenId) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const marketContract = new Contract(MARKET_ADDRESS, MARKET_ABI, signer);
                const orders = await marketContract.getSellOrders(tokenId);
                setSellOrders(orders);
            }
        } catch (error) {
            console.error("Error fetching sell orders:", error);
        }
    };

    const listTokenForSale = async (tokenId, price) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const marketContract = new Contract(MARKET_ADDRESS, MARKET_ABI, signer);
                const tx = await marketContract.listToken(tokenId, ethers.utils.parseEther(price), 1); // Assuming amount is 1 for simplicity
                console.log(tx.hash);
            }
        } catch (error) {
            console.error("Error listing token:", error);
            alert(error.message || "An error occurred while listing the token for sale.");
        }
    };

    const buyToken = async (order) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const marketContract = new Contract(MARKET_ADDRESS, MARKET_ABI, signer);
                const tx = await marketContract.buyToken(order.tokenId, order.price, { value: order.price });
                console.log(tx.hash);
            }
        } catch (error) {
            console.error("Error buying token:", error);
            alert(error.message || "An error occurred while buying the token.");
        }
    };

    const selectToken = (token) => {
        setSelectedToken(token);
        fetchSellOrders(token.tokenId);
    };

    useEffect(() => {
        fetchAllItems();
    }, []);

    return (
        <div className="relative min-h-screen font-mono text-white w-3/5">
            <h1 className="text-3xl font-bold mb-4 pt-16">SATs Marketplace</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
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
                                    <p>Current Supply: {details.totalSupply.toString()}</p>
                                    <p>Mint Price: {ethers.utils.formatEther(details.mintAdditionalCost.toString())} AVAX</p>
                                    <p className="font-bold text-xl">Exploded: {details.exploded.toString()}</p>
                                    <p>Anti-Whale Protection: {details.antiWhale ? "Enabled" : "Disabled"}</p>
                                    <p className="text-xs break-words">Creator: {details.creator}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedToken && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
                    <div className="bg-gray-900 p-4 rounded shadow-lg max-w-2xl w-full relative">
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
                            className="w-full h-auto mb-2" 
                        />
                        <div className="mb-4">
                            <h3 className="text-xl font-bold mb-2">Sell Orders</h3>
                            {sellOrders.length > 0 ? (
                                sellOrders.map((order, index) => (
                                    <div key={index} className="mb-2">
                                        <p>Price: {ethers.utils.formatEther(order.price)} AVAX</p>
                                        <p>Amount: {order.amount.toString()}</p>
                                        <button
                                            onClick={() => buyToken(order)}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold w-full px-4 py-2 rounded"
                                        >
                                            Buy
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>No sell orders available.</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <h3 className="text-xl font-bold mb-2">List Token for Sale</h3>
                            <input
                                type="text"
                                placeholder="Price in AVAX"
                                value={listPrice}
                                onChange={(e) => setListPrice(e.target.value)}
                                className="bg-gray-700 text-white font-bold py-2 px-4 rounded w-full mb-2"
                            />
                            <button
                                onClick={() => listTokenForSale(selectedToken.tokenId, listPrice)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-full px-4 py-2 rounded"
                            >
                                List for Sale
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SatsGallery;
