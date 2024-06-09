import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const TokenInfo = () => {
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAllItems = async () => {
        if (loading) return;
        setLoading(true);
        let allFetchedTokens = [];
        let currentPageToken = null;

        try {
            while (true) {
                const pageTokenParam = currentPageToken ? `&pageToken=${currentPageToken}` : "";
                const url = `https://glacier-api.avax.network/v1/chains/43114/nfts/collections/0x9521807ADF320D1CDF87AFDf875Bf438d1D92d87/tokens?pageSize=100${pageTokenParam}`;
                const options = { method: "GET", headers: { accept: "application/json" } };

                const response = await fetch(url, options);
                const data = await response.json();
                if (response.ok && Array.isArray(data.tokens)) {
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

            const tokenData = allFetchedTokens.map(token => ({
                tokenId: token.tokenId,
                name: token.metadata.name,
                description: token.metadata.description,
                imageUrl: token.metadata.imageUri,
                totalSupply: token.totalSupply, // Adjust this if the actual field is different
                price: ethers.utils.formatEther(token.mintAdditionalCost), // Adjust this if the actual field is different
            }));

            setTokens(tokenData);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllItems();
    }, []);

    return (
        <div className="relative min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-4">Token Information</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tokens.map((token) => (
                        <div key={token.tokenId} className="bg-gray-800 p-4 rounded shadow">
                            <h2 className="text-2xl font-bold mb-2">{token.name}</h2>
                            <img src={token.imageUrl} alt={`Token ${token.tokenId}`} className="w-full h-auto mb-4" />
                            <p>{token.description}</p>
                            <p>Token ID: {token.tokenId}</p>
                            <p>Total Supply: {token.totalSupply}</p>
                            <p>Mint Price: {token.price} AVAX</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TokenInfo;
