import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers, Contract } from "ethers";
import { SATS_ABI, SATS_ADDRESS } from "../Contracts/SatsContract";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth";

const Sats = ({  }) => {
    const [txProcessing, setTxProcessing] = useState(false);
    const navigate = useNavigate();
    const [antiWhale, setAntiWhale] = useState(false);
    const {
        account,
        web3Modal,
        loadWeb3Modal,
        web3Provider,
        setWeb3Provider,
        logoutOfWeb3Modal,
        // ... any other states or functions you need ...
      } = useAuth();

    const goToGallery = () => {
        navigate('/satsgallery');
    };
    console.log(account);
    const [nftDetails, setNftDetails] = useState({
        ticker: '',
        totalSupply: '',
        mintPrice: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    useEffect(() => {
        if (account) {
            setNftDetails(prevDetails => ({
                ...prevDetails,
                creator: account
            }));
        }
    }, [account]);

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImageFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadToIPFS = async () => {
        if (!imageFile) {
            alert('No image file selected!');
            return;
        }

        const formData = new FormData();
        formData.append('file', imageFile);

        try {
            const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                headers: {
                    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZmQ5MzgwYy1mYmI2LTQ1OWQtYjkzYy00Mzk3ZjNmMWVlZjYiLCJlbWFpbCI6ImpqemltbWVyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI5NWQ0NmYxZDA2OWJlYjI0N2I1ZCIsInNjb3BlZEtleVNlY3JldCI6ImQ4NTM5MDMyZjQyZTU0MWQyMzZlOTljM2I4NjJlM2JiZjcxZTRlYWY5NDNkYTllOGI1NDhmMjk2YzM1YWMwYWEiLCJpYXQiOjE3MTYwNDk4NTh9.MiwhFpT1RdiswICA12Dt2IxDFMQqVkFJeSK9A416Afc`
                }
            });
            console.log("Image uploaded to IPFS:", response.data);
            return response.data.IpfsHash;
        } catch (error) {
            console.error("Failed to upload image to IPFS:", error);
            return null;
        }
    };

    async function mintNFT(metadataUrl) {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                if (SATS_ABI && SATS_ADDRESS && signer) {
                    const contract = new Contract(
                        SATS_ADDRESS,
                        SATS_ABI,
                        signer
                    );
                    let options = { value: ethers.utils.parseEther("1") };
                    let tx = await contract.mint(metadataUrl, nftDetails.totalSupply, nftDetails.mintPrice, antiWhale, options);
                    console.log(tx.hash);
                } else {
                    console.log("Error with contract ABI, address, or signer");
                }
            }
        } catch (error) {
            console.log("Error on mint:", error);
            if (error.data && error.data.message) {
                alert(error.data.message);
            } else {
                alert(error.message || "An error occurred while minting the NFT.");
            }
        }
    }

    const handleSubmit = async () => {
        const { ticker, totalSupply, mintPrice } = nftDetails;
        console.log(`account:`, account)
        if (!ticker || !totalSupply || !mintPrice || !account) {
            alert("All fields are required.");
            return;
        }
        if (!account) {
            alert("No account found. Connect your wallet.");
            return;
        }
        try {
            const imageUrl = await uploadToIPFS();
            if (!imageUrl) {
                alert("Failed to upload image. Please try again.");
                return;
            }
            const metadata = {
                name: ticker,
                description: `NFT created by ${account}`,
                image: `ipfs://${imageUrl}`,
                properties: [
                    { trait_type: "Total Supply", value: totalSupply },
                    { trait_type: "Mint Price", value: `${mintPrice} AVAX` },
                    { trait_type: "Creator", value: account },
                    { trait_type: "Anti-Whale Protection", value: antiWhale ? "Enabled" : "Disabled" }
                ]
            };
            console.log(metadata);
            const metadataUrl = await uploadMetadataToIPFS(metadata);
            console.log(metadataUrl);
            if (metadataUrl) {
                await mintNFT(metadataUrl);
                
            } else {
                alert("Failed to upload metadata. Please try again.");
            }
        } catch (error) {
            console.error("Error during NFT minting:", error);
        }
    };

    const handleReset = () => {
        setNftDetails({
            ticker: '',
            totalSupply: '',
            mintPrice: '',
            creator: account || ''
        });
        setAntiWhale(false);
        setImageFile(null);
        setImagePreviewUrl('');
        document.getElementById('fileInput').value = null;
    };

    const uploadMetadataToIPFS = async (metadata) => {
        const jsonString = JSON.stringify(metadata);
        const formData = new FormData();
        formData.append('file', new Blob([jsonString], { type: 'application/json' }), 'metadata.json');
        try {
            const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                maxBodyLength: "Infinity",
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZmQ5MzgwYy1mYmI2LTQ1OWQtYjkzYy00Mzk3ZjNmMWVlZjYiLCJlbWFpbCI6ImpqemltbWVyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI5NWQ0NmYxZDA2OWJlYjI0N2I1ZCIsInNjb3BlZEtleVNlY3JldCI6ImQ4NTM5MDMyZjQyZTU0MWQyMzZlOTljM2I4NjJlM2JiZjcxZTRlYWY5NDNkYTllOGI1NDhmMjk2YzM1YWMwYWEiLCJpYXQiOjE3MTYwNDk4NTh9.MiwhFpT1RdiswICA12Dt2IxDFMQqVkFJeSK9A416Afc`
                }
            });
            const ipfsHash = response.data.IpfsHash;
            return `ipfs://${ipfsHash}`;
        } catch (error) {
            console.error("Error uploading metadata to IPFS:", error);
            return null;
        }
    };

    return (
        <div className="relative min-h-screen font-mono text-white">
            <div className="py-8 md:py-0 relative">
                <div className="mx-auto pointer-events-none block md:hidden md:pb-8 relative">
                    {/* SVG logo or image can be here */}
                </div>
            </div>
            <div className="relative text-xl text-avax-black p-8 pt-36 md:pt-36 px-4 md:px-36 lg:px-40 xl:px-96">
                Mint your Single Sided Asset by providing the details below.
            </div>
            <div className="relative text-xl text-avax-black pb-8 px-4 md:px-36 lg:px-40 xl:px-96">
                Fill out the form below to mint your SSA.
            </div>
            <div className="relative pb-16">
                <button onClick={handleReset} className="bg-neutral-600 hover:bg-neutral-500 duration-300 rounded-md p-4 font-bold text-xl">
                    Reset Form
                </button>
            </div>
            <div className="sm:max-w-md md:max-w-xl mx-auto p-4 bg-avax-black text-gray-100 rounded-lg relative opacity-95">
                <div className="pb-4 font-bold"><h1>Upload an image which will be your single asset</h1></div>
                <input type="file" id="fileInput" onChange={handleImageChange} />
                {imagePreviewUrl && (
                    <div className="mt-4">
                        <img src={imagePreviewUrl} alt="Uploaded Preview" className="max-w-full h-auto rounded p-4" />
                    </div>
                )}
                <div className="mb-4">
                    <input
                        type="text"
                        className="block w-full mt-4 mb-2 px-3 py-2 bg-zinc-700 border border-zinc-800 rounded-md text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ticker"
                        value={nftDetails.ticker}
                        onChange={e => {
                            const sanitizedValue = e.target.value.replace(/[^a-zA-Z0-9]/g, ''); // Allow only alphanumeric characters
                            setNftDetails({ ...nftDetails, ticker: sanitizedValue.startsWith('$') ? sanitizedValue : `$${sanitizedValue}` });
                        }}
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="number"
                        className="block w-full mt-4 mb-2 px-3 py-2 bg-zinc-700 border border-zinc-800 rounded-md text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Total Supply"
                        min="1"
                        value={nftDetails.totalSupply}
                        onChange={e => setNftDetails({ ...nftDetails, totalSupply: e.target.value })}
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="number"
                        step="0.01"
                        className="block w-full mt-4 mb-2 px-3 py-2 bg-zinc-700 border border-zinc-800 rounded-md text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Mint Price (in Avax: Wei Units)"
                        min="0.01"
                        value={nftDetails.mintPrice}
                        onChange={e => setNftDetails({ ...nftDetails, mintPrice: e.target.value })}
                    />
                </div>
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        checked={antiWhale}
                        onChange={e => setAntiWhale(e.target.checked)}
                        className="mr-2"
                    />
                    <label className="block text-gray-100">Anti-Whale Protection</label>
                </div>
                <button onClick={handleSubmit} disabled={txProcessing} className="bg-spot-yellow text-black hover:bg-avax-red duration-300 rounded-md p-4 font-bold text-xl">
                    {txProcessing ? "Processing..." : "Create your Sats!"}
                </button>
            </div>
        </div>
    );
};

export default Sats;
