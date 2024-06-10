import React, { useEffect, useState } from "react";
import axios from "axios";
import { ethers, Contract } from "ethers";
import { SATS_ABI, SATS_ADDRESS } from "../Contracts/SatsContract";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth";

const SatsGallery = () => {
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mintAmount, setMintAmount] = useState({});
    const [tokenDetails, setTokenDetails] = useState({});
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
            setTokens(allFetchedTokens);

            // Fetch token details for each token
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new Contract(SATS_ADDRESS, SATS_ABI, signer);

                const fetchedTokenDetails = await Promise.all(
                    allFetchedTokens.map(async (token) => {
                        const details = await contract.tokenDetails(token.tokenId);
                        return {
                            tokenId: token.tokenId,
                            ...details,
                        };
                    })
                );

                const tokenDetailsMap = {};
                fetchedTokenDetails.forEach(details => {
                    tokenDetailsMap[details.tokenId] = details;
                });
                setTokenDetails(tokenDetailsMap);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllItems();
    }, []);

    const mintAdditional = async (tokenId, amount) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new Contract(SATS_ADDRESS, SATS_ABI, signer);
                const details = tokenDetails[tokenId];
                const mintCost = details.mintAdditionalCost;
                const totalCost = mintCost.mul(amount);
                const options = { value: totalCost };

                const tx = await contract.mintAdditional(tokenId, amount, options);
                console.log(tx.hash);
            }
        } catch (error) {
            console.error("Error on mintAdditional:", error);
            alert(error.message || "An error occurred while minting additional tokens.");
        }
    };

    const claimShrapnel = async (tokenId) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new Contract(SATS_ADDRESS, SATS_ABI, signer);

                const tx = await contract.claimShrapnel(tokenId);
                console.log(tx.hash);
            }
        } catch (error) {
            console.error("Error on claimShrapnel:", error);
            alert(error.message || "An error occurred while claiming shrapnel.");
        }
    };

    const explodeToken = async (tokenId) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new Contract(SATS_ADDRESS, SATS_ABI, signer);

                const tx = await contract.explodeToken(tokenId);
                console.log(tx.hash);
            }
        } catch (error) {
            console.error("Error on explodeToken:", error);
            alert(error.message || "An error occurred while exploding the token.");
        }
    };

    const finalizeExplosion = async (tokenId) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new Contract(SATS_ADDRESS, SATS_ABI, signer);

                const tx = await contract.finalizeExplosion(tokenId);
                console.log(tx.hash);
            }
        } catch (error) {
            console.error("Error on finalizeExplosion:", error);
            alert(error.message || "An error occurred while finalizing the explosion.");
        }
    };

    return (
        <div className="relative min-h-screen font-mono text-white w-3/5">
            <h1 className="text-3xl font-bold mb-4 pt-16">SATs Gallery</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-24">
                    {tokens.map((token) => {
                        const details = tokenDetails[token.tokenId];
                        if (!details) return null;

                        return (
                            <div key={token.tokenId} className="bg-gray-800 p-4 rounded shadow">
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
                                    <p>Anti-Whale Protection: {details.antiWhale ? "Enabled" : "Disabled"}</p>
                                    <p className="text-xs break-words">Creator: {details.creator}</p>
                                </div>
                                {account && account.toLowerCase() === details.creator.toLowerCase() && (
                                    <>
                                        {!details.exploded && (
                                            <div className="pb-4">
                                                <button
                                                    onClick={() => explodeToken(token.tokenId)}
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold w-full px-4 py-2 rounded"
                                                >
                                                    Explode Token
                                                </button>
                                            </div>
                                        )}
                                        {details.isExploding && (
                                            <div className="pb-4">
                                                <button
                                                    onClick={() => finalizeExplosion(token.tokenId)}
                                                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold w-full px-4 py-2 rounded"
                                                >
                                                    Finalize Explosion
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                                {details.exploded && (
                                    <div className="pb-4">
                                        <button
                                            onClick={() => claimShrapnel(token.tokenId)}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold w-full px-4 py-2 rounded"
                                        >
                                            Claim Shrapnel
                                        </button>
                                    </div>
                                )}
                                {details.totalSupply.lt(details.maxSupply) && (
                                    <div className="mt-4">
                                        <div className="pb-4">
                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="Amount to Mint"
                                                value={mintAmount[token.tokenId] || ""}
                                                onChange={(e) => setMintAmount({ ...mintAmount, [token.tokenId]: e.target.value })}
                                                className="bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
                                            />
                                        </div>
                                        <div className="pb-4">
                                            <button
                                                onClick={() => mintAdditional(token.tokenId, mintAmount[token.tokenId])}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-full px-4 py-2 rounded"
                                            >
                                                Mint Tokens
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SatsGallery;
