import { stringify } from "postcss";
import React, { useEffect, useState } from "react";
import { useWeb3ExecuteFunction, useMoralisCloudFunction } from "react-moralis";
import spotNFTAbi from "../contracts/spotNFTAbi.json";
import Moralis from "moralis";
import unnamedData from "../metadata";
import unnamedAbi from "../contracts/spotNFTAbi.json";
import nfTombstoneABI from "../contracts/nfTombstoneABI.json";
import axios from "axios";
import { ethers, Contract } from "ethers";
import {
    TOMBSTONE_ADDRESS,
    TOMBSTONE_ABI,
} from "./Contracts/TombstoneContract";
import { SCRIBBLECLAIM_ABI, SCRIBBLECLAIM_ADDRESS } from "./Contracts/ScribbleContract";
import image1 from "../assets/scribble/CARD_PLACEHOLDER.jpg"

export default function ScribbleMint({
    props,
    chosenTrait,
    walletTraits,
    background,
    behind,
    flair,
    ground,
    tombstone,
    top,
    id,
    saveImage,
    account,
    noun,
    name,
    color,
    collection,
    collectorName,
    collectionDescription,
    nftSelected,
    txProcessing,
    setTxProcessing,
    ownedCards,
    mintEnabled,
    web3Provider,
    tombstoneSelected,
}) {
    const {
        data: mintData,
        error: mintError,
        fetch: mintFetch,
        isFetching: mintFetching,
        isLoading: mintLoading,
    } = useWeb3ExecuteFunction();

    function alertClick() {
        alert("Wen Mint??! Follow @ScribbleWarl0ck on bird app to find out more..");
    }


    async function uploadToMoralis(filename, contents) {
        const options = {
            method: "POST",
            url: "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                "X-API-Key": process.env.REACT_APP_MORALIS_API_KEY,
            },
            data: [{ path: filename, content: contents }],
        };

        let response = await axios.request(options);
        return response;
    }

    async function mint(tokenURI, id) {
        setTxProcessing(true);
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                if (SCRIBBLECLAIM_ABI && SCRIBBLECLAIM_ADDRESS && signer) {
                    const contract = new Contract(SCRIBBLECLAIM_ADDRESS, SCRIBBLECLAIM_ABI, signer);
                    let options = {
                        value: ethers.utils.parseEther(".1"),
                    };
                    console.log(tokenURI);

                    let tx = await contract.mint(id, tokenURI, collection);
                    console.log(tx.hash);
                    props.setTxProcessing(false);
                    alert(
                        "Your Custom Token Has Been Minted! Join the Discord to Chat with Scribble Warlock!!!"
                    );
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTxProcessing(false);
        }
    }

    async function scribbleMint() {
        setTxProcessing(true);
        try {
            let signature = await web3Provider
                .getSigner()

            const metadata = {
                name: "Scribble Custom Card",
                description: "Scribble Custom Card",
                image: "https://thespot.mypinata.cloud/ipfs/QmYnmKqh8ahh1hVY5z4o5c5RJG34BC6fHKyuQnRiYQPpHH", //ipfs CID
                attributes: [
                    {
                        trait_type: "Collector Name:",
                        value: collectorName,
                    },
                    {
                        trait_type: "Custom Name:",
                        value: name,
                    },
                    {
                        trait_type: "Color",
                        value: color,
                    },
                    {
                        trait_type: "Noun",
                        value: noun,
                    },
                    {
                        trait_type: "Collection Claimed With",
                        value: collectionDescription,
                    },
                    {
                        trait_type: "Claimed With ID",
                        value: id,
                    },

                ],
            };

            let jsonResponse = await uploadToMoralis(`${id}-json.json`, metadata);

            let jsonURL =
                jsonResponse.data.length > 0 ? jsonResponse.data[0].path : "";

            await mint(jsonURL, id);
        } catch (error) {
            console.log(error);
        } finally {
            setTxProcessing(false);
        }
    }

    if (txProcessing) {
        return (
            <div>
                <button
                    className="inline-flex m-1 rounded-lg px-4 py-2 border-2 border-spot-yellow text-spot-yellow
     duration-300 font-mono font-bold text-base"
                    disabled
                >
                    <svg className="inline animate-ping h-5 w-5 mr-3" viewBox="0 0 35 35">
                        <circle
                            className="path"
                            cx="12"
                            cy="15"
                            r="10"
                            fill="yellow"
                            stroke="yellow"
                            strokeWidth="2"
                        ></circle>
                    </svg>
                    Processing...
                </button>
            </div>
        );
    } else
        return (
            <div className="flex w-full">
                <div className="w-full pr-5 pl-1">
                    <button
                        className="m-1 w-full rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base disabled:border-gray-600 disabled:hover:bg-gray-900 disabled:text-gray-600 disabled:hover:text-gray-600"

                        onClick={alertClick}
                    >
                        Mint Custom Card
                    </button>
                    {/*<button
                        className="m-1 w-full rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base disabled:border-gray-600 disabled:hover:bg-gray-900 disabled:text-gray-600 disabled:hover:text-gray-600"
                        disabled={!mintEnabled || mintEnabled}
                        onClick={() => scribbleMint()}
                    >
                        Mint Custom Card
        </button>*/}
                </div>
            </div>
        );


}