import React, { useEffect, useState } from "react";
import axios from "axios";
import { ethers, Contract } from "ethers";
import { SATS_ABI, SATS_ADDRESS } from "../Contracts/SatsContract";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth";
import { GiWhaleTail } from "react-icons/gi";

const SatsGallery = () => {
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mintAmount, setMintAmount] = useState({});
    const [tokenDetails, setTokenDetails] = useState({});
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

    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const formatEtherWithNotation = (value) => {
        const etherValue = parseFloat(ethers.utils.formatEther(value));
        return formatPriceWithNotation(etherValue.toString());
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

    const formatLargeNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const formatSmallValue = (value) => {
        if (value < 0.0001 && value !== 0) {
            return value.toExponential(2); // 2 decimal places in exponent
        }
        return value.toFixed(8); // Default to 8 decimal places for small values
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
                    disabled={true}
                    className={`flex-1 px-4 py-2 rounded font-bold text-white ${
                        true ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-700'
                    }`}
                >
                    Mint SATs
                </button>
                <button
                    onClick={() => navigate('/market')}
                    className="flex-1 px-4 py-2 rounded bg-blue-500 hover:bg-blue-700 text-white font-bold"
                >
                    SATs Marketplace
                </button>
            </div>
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
            <h1 className="text-3xl font-bold mb-4 pt-16">SATs Minting</h1>
            {loading ? (
                <p>Loading...</p>
            ) : view === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-24">
                    {tokens.map((token) => {
                        const details = tokenDetails[token.tokenId];
                        if (!details) return null;

                        return (
                            <div key={token.tokenId} className="bg-gray-800 p-4 rounded shadow">
                              
                                <img 
                                    src={`https://gateway.ipfs.io/ipfs/${token.metadata.imageUri.split("ipfs://")[1]}`} 
                                    alt={token.metadata.name} 
                                    className="w-full h-auto mb-2" 
                                />
                                  <h2 className="text-4xl font-bold mb-2 text-spot-yellow py-4">{token.metadata.name}</h2>
                                <div className="mb-2">
                                    <div className="pt-2 pb-2 bg-gray-700 rounded-md"><p>Total Supply: {formatNumber(details.maxSupply.toString())}</p></div>
                                    <div className="pt-2 pb-2"><p>Current Supply: {formatNumber(details.totalSupply.toString())}</p></div>
                                    <div className="pt-2 pb-2 bg-gray-700 rounded-md"><p>Mint Price: {formatEtherWithNotation(details.mintAdditionalCost.toString())} AVAX</p></div>
                                    <div className="pt-2 pb-2"> <p>Anti-Whale Protection: {details.antiWhale ? "Enabled" : "Disabled"}</p></div>
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
            ) : (
                <div className="grid grid-cols-1 gap-4 pt-24">
    <div className="p-4 rounded flex items-center hidden md:flex">
        <div className="w-20 h-16"></div> {/* Placeholder for image column */}
        <div className="grid grid-cols-5 md:flex-row md:items-center w-full">
            <div className="col-start-1 pl-4">
                <h2 className="text-xl font-bold text-spot-yellow">Name</h2>
            </div>
            <div className="">
                <h2 className="text-xl font-bold">Max Supply</h2>
            </div>
            <div className="">
                <h2 className="text-xl font-bold">Current Supply</h2>
            </div>
            <div className="">
                <h2 className="text-xl font-bold">Mint Price</h2>
            </div>
           
        </div>
    </div>
    {tokens.map((token) => {
        const details = tokenDetails[token.tokenId];
        if (!details) return null;

        return (
            <div key={token.tokenId} className="bg-gray-800 p-4 shadow flex flex-col md:flex-row items-center">
                <img 
                    src={`https://gateway.ipfs.io/ipfs/${token.metadata.imageUri.split("ipfs://")[1]}`} 
                    alt={token.metadata.name} 
                    className="w-16 h-16 object-cover rounded mb-4 md:mb-0" 
                />
                <div className="ml-4 flex flex-col md:flex-row md:items-center w-full">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-spot-yellow">{token.metadata.name}</h2>
                        <p className="md:hidden">Max Supply: {formatNumber(details.maxSupply.toString())}</p>
                        <p className="md:hidden">Current Supply: {formatNumber(details.totalSupply.toString())}</p>
                        <p className="md:hidden flex items-center">
                                           <div className="pr-2">Mint Price: {formatEtherWithNotation(details.mintAdditionalCost.toString())} AVAX</div>
                                            {!details.antiWhale && (
                                                <GiWhaleTail />
                                            )}
                                        </p>
                    </div>
                    <div className="flex-1 hidden md:block">
                        <p>{formatNumber(details.maxSupply.toString())}</p>
                    </div>
                    <div className="flex-1 hidden md:block">
                        <p>{formatNumber(details.totalSupply.toString())}</p>
                    </div>
                    <div className="flex-1 hidden md:block">
    <div className="flex items-center justify-center mx-auto">
        <p className="flex items-center">
            {formatEtherWithNotation(details.mintAdditionalCost.toString())} AVAX
            {!details.antiWhale && (
                <GiWhaleTail className="ml-2" />
            )}
        </p>
    </div>
</div>

                    <div className="flex-1 w-40 mt-4 md:mt-0 md:flex md:items-center md:justify-end">
    <div className="grid grid-cols-2">
        <input
            type="number"
            min="1"
            placeholder="Amount"
            value={mintAmount[token.tokenId] || ""}
            onChange={(e) => setMintAmount({ ...mintAmount, [token.tokenId]: e.target.value })}
            className="bg-gray-700 text-white font-bold py-2 px-2 sm:px-4 rounded mb-2 sm:mb-0 sm:mr-2 sm:w-auto col-span-1 placeholder:text-xs"
        />
        <button
            onClick={() => mintAdditional(token.tokenId, mintAmount[token.tokenId])}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded m:w-auto col-span-1 text-xs"
        >
            Mint
        </button>
    </div>
</div>

                </div>
            </div>
        );
    })}
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

export default SatsGallery;
