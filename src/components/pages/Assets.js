import React, { useEffect, useState } from "react";
import axios from "axios";
import { ethers, Contract } from "ethers";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth";
import { WALLET_REGISTRY_ABI, WALLET_REGISTRY_ADDRESS } from "../Contracts/WalletRegistryContract";

const WalletAssetPage = () => {
    const [registeredAccounts, setRegisteredAccounts] = useState([]);
    const [newAccount, setNewAccount] = useState("");
    const [newNickname, setNewNickname] = useState("");
    const [nicknames, setNicknames] = useState({});
    const [assets, setAssets] = useState({});
    const [loading, setLoading] = useState({});
    const [visibility, setVisibility] = useState({});
    const [pageTokens, setPageTokens] = useState({});
    const navigate = useNavigate();
    const { account, web3Modal, loadWeb3Modal, web3Provider, setWeb3Provider, logoutOfWeb3Modal } = useAuth();

    const fetchRegisteredAccounts = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const walletRegistryContract = new Contract(WALLET_REGISTRY_ADDRESS, WALLET_REGISTRY_ABI, signer);
                const accounts = await walletRegistryContract.getRegisteredWallets(account);
                setRegisteredAccounts(accounts);

                const fetchedNicknames = {};
                for (const account of accounts) {
                    const nickname = await walletRegistryContract.getWalletNickname(account);
                    fetchedNicknames[account] = nickname;
                }
                setNicknames(fetchedNicknames);
            }
        } catch (error) {
            console.error("Error fetching registered accounts:", error);
        }
    };

    const registerAccount = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const walletRegistryContract = new Contract(WALLET_REGISTRY_ADDRESS, WALLET_REGISTRY_ABI, signer);
                const tx = await walletRegistryContract.registerWallet(newAccount, newNickname);
                await tx.wait();
                fetchRegisteredAccounts();
                setNewAccount("");
                setNewNickname("");
            }
        } catch (error) {
            console.error("Error registering account:", error);
        }
    };

    const fetchErc20Assets = async (account, pageToken = null) => {
        try {
            setLoading(prevLoading => ({ ...prevLoading, [account + '_erc20']: true }));
            const chainId = 43114; // Avalanche C-Chain
            const apiKey = "YOUR_GLACIER_API_KEY"; // Replace with your Glacier API key
            const pageTokenParam = pageToken ? `&pageToken=${pageToken}` : "";

            const response = await axios.get(`https://glacier-api.avax.network/v1/chains/${chainId}/addresses/${account}/balances:listErc20?${pageTokenParam}`, {
                headers: {
                    accept: "application/json",
                    "x-api-key": apiKey
                }
            });

            const erc20 = response.data.erc20TokenBalances ? response.data.erc20TokenBalances.map(token => ({
                name: token.tokenSymbol,
                balance: token.balance
            })) : [];

            setAssets(prevAssets => ({
                ...prevAssets,
                [account]: {
                    ...prevAssets[account],
                    erc20: [...(prevAssets[account]?.erc20 || []), ...erc20]
                }
            }));

            const nextPageToken = response.data.nextPageToken;

            setPageTokens(prevPageTokens => ({
                ...prevPageTokens,
                [account + '_erc20']: nextPageToken
            }));
        } catch (error) {
            console.error("Error fetching ERC-20 assets:", error);
            alert(`Error fetching ERC-20 assets for account ${account}: ${error.message}`);
        } finally {
            setLoading(prevLoading => ({ ...prevLoading, [account + '_erc20']: false }));
        }
    };

    const fetchErc721Assets = async (account, pageToken = null) => {
        try {
            setLoading(prevLoading => ({ ...prevLoading, [account + '_erc721']: true }));
            const chainId = 43114; // Avalanche C-Chain
            const apiKey = "YOUR_GLACIER_API_KEY"; // Replace with your Glacier API key
            const pageTokenParam = pageToken ? `&pageToken=${pageToken}` : "";

            const response = await axios.get(`https://glacier-api.avax.network/v1/chains/${chainId}/addresses/${account}/balances:listErc721?${pageTokenParam}`, {
                headers: {
                    accept: "application/json",
                    "x-api-key": apiKey
                }
            });

            const erc721 = response.data.erc721TokenBalances ? response.data.erc721TokenBalances.map(token => ({
                name: token.name,
                tokenId: token.tokenId,
                imageUri: token.metadata.imageUri,
                description: token.metadata.description
            })) : [];

            setAssets(prevAssets => ({
                ...prevAssets,
                [account]: {
                    ...prevAssets[account],
                    erc721: [...(prevAssets[account]?.erc721 || []), ...erc721]
                }
            }));

            const nextPageToken = response.data.nextPageToken;

            setPageTokens(prevPageTokens => ({
                ...prevPageTokens,
                [account + '_erc721']: nextPageToken
            }));
        } catch (error) {
            console.error("Error fetching ERC-721 assets:", error);
            alert(`Error fetching ERC-721 assets for account ${account}: ${error.message}`);
        } finally {
            setLoading(prevLoading => ({ ...prevLoading, [account + '_erc721']: false }));
        }
    };

    const fetchErc1155Assets = async (account, pageToken = null) => {
        try {
            setLoading(prevLoading => ({ ...prevLoading, [account + '_erc1155']: true }));
            const chainId = 43114; // Avalanche C-Chain
            const apiKey = "YOUR_GLACIER_API_KEY"; // Replace with your Glacier API key
            const pageTokenParam = pageToken ? `&pageToken=${pageToken}` : "";

            const response = await axios.get(`https://glacier-api.avax.network/v1/chains/${chainId}/addresses/${account}/balances:listErc1155?${pageTokenParam}`, {
                headers: {
                    accept: "application/json",
                    "x-api-key": apiKey
                }
            });

            const erc1155 = response.data.erc1155TokenBalances ? response.data.erc1155TokenBalances.map(token => ({
                name: token.metadata.name,
                tokenId: token.tokenId,
                balance: token.balance,
                imageUri: token.metadata.imageUri,
                description: token.metadata.description
            })) : [];

            setAssets(prevAssets => ({
                ...prevAssets,
                [account]: {
                    ...prevAssets[account],
                    erc1155: [...(prevAssets[account]?.erc1155 || []), ...erc1155]
                }
            }));

            const nextPageToken = response.data.nextPageToken;

            setPageTokens(prevPageTokens => ({
                ...prevPageTokens,
                [account + '_erc1155']: nextPageToken
            }));
        } catch (error) {
            console.error("Error fetching ERC-1155 assets:", error);
            alert(`Error fetching ERC-1155 assets for account ${account}: ${error.message}`);
        } finally {
            setLoading(prevLoading => ({ ...prevLoading, [account + '_erc1155']: false }));
        }
    };

    const toggleVisibility = async (account) => {
        if (!visibility[account]) {
            await Promise.all([fetchErc20Assets(account), fetchErc721Assets(account), fetchErc1155Assets(account)]);
        }
        setVisibility(prevVisibility => ({
            ...prevVisibility,
            [account]: !prevVisibility[account]
        }));
    };

    useEffect(() => {
        if (account) {
            fetchRegisteredAccounts();
        }
    }, [account]);

    return (
        <div className="min-h-screen font-mono text-white w-full md:w-3/5 sm:pt-24">
            <div className="flex justify-between mb-4 space-x-2">
                <button onClick={() => navigate('/home')} className="flex-1 px-4 py-2 rounded bg-blue-500 hover:bg-blue-700 text-white font-bold">
                    Home
                </button>
                <button onClick={() => navigate('/profile')} className="flex-1 px-4 py-2 rounded bg-blue-500 hover:bg-blue-700 text-white font-bold">
                    Profile
                </button>
                <button disabled={true} className="flex-1 px-4 py-2 rounded font-bold text-white bg-blue-700">
                    Wallet Assets
                </button>
            </div>
            <h1 className="text-3xl font-bold mb-4 pt-16">Wallet Assets</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="New Account Address"
                    value={newAccount}
                    onChange={(e) => setNewAccount(e.target.value)}
                    className="bg-gray-700 text-white font-bold py-2 px-4 rounded w-full mb-2"
                />
                <input
                    type="text"
                    placeholder="Nickname"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    className="bg-gray-700 text-white font-bold py-2 px-4 rounded w-full mb-2"
                />
                <button onClick={registerAccount} className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded w-full">
                    Register Account
                </button>
            </div>
            {Object.values(loading).some(load => load) && <p>Loading assets...</p>}
            <div className="grid grid-cols-1 gap-4">
                {registeredAccounts.map(account => (
                    <div key={account} className="bg-gray-800 p-4 rounded shadow">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold">{nicknames[account]}</h3>
                                <h2 className="text-xl font-bold mb-2">Account: {account}</h2>
                            </div>
                            <button
                                onClick={() => toggleVisibility(account)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
                            >
                                {visibility[account] ? "Hide" : "Show"}
                            </button>
                        </div>
                        {visibility[account] && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <h3 className="text-lg font-bold">ERC-20 Tokens</h3>
                                    {assets[account]?.erc20?.map((token, index) => (
                                        <p key={index}>{token.name}: {token.balance}</p>
                                    ))}
                                    {pageTokens[account + '_erc20'] && (
                                        <button
                                            onClick={() => fetchErc20Assets(account, pageTokens[account + '_erc20'])}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded w-full mt-4"
                                        >
                                            Load More
                                        </button>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">ERC-721 Tokens</h3>
                                    {assets[account]?.erc721?.map((token, index) => (
                                        <div key={index}>
                                            <p>{token.name} (ID: {token.tokenId})</p>
                                            <img src={token.imageUri} alt={token.name} className="w-full h-auto mb-2 rounded" />
                                            <p>{token.description}</p>
                                        </div>
                                    ))}
                                    {pageTokens[account + '_erc721'] && (
                                        <button
                                            onClick={() => fetchErc721Assets(account, pageTokens[account + '_erc721'])}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded w-full mt-4"
                                        >
                                            Load More
                                        </button>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">ERC-1155 Tokens</h3>
                                    {assets[account]?.erc1155?.map((token, index) => (
                                        <div key={index}>
                                            <p>{token.name} (ID: {token.tokenId}): {token.balance}</p>
                                            <img src={token.imageUri} alt={token.name} className="w-full h-auto mb-2 rounded" />
                                            <p>{token.description}</p>
                                        </div>
                                    ))}
                                    {pageTokens[account + '_erc1155'] && (
                                        <button
                                            onClick={() => fetchErc1155Assets(account, pageTokens[account + '_erc1155'])}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded w-full mt-4"
                                        >
                                            Load More
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WalletAssetPage;
