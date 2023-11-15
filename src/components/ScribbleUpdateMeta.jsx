import { stringify } from "postcss";
import React, { useEffect, useState } from "react";
import spotNFTAbi from "../contracts/spotNFTAbi.json";
import Moralis from "moralis";
import unnamedData from "../metadata";
import unnamedAbi from "../contracts/spotNFTAbi.json";
import nfTombstoneABI from "../contracts/nfTombstoneABI.json";
import axios from "axios";
import { ethers, Contract } from "ethers";
import { SCRIBBLECLAIM_ABI, SCRIBBLECLAIM_ADDRESS } from "./Contracts/ScribbleContract";
import { ENGRAVER_ABI, ENGRAVER_ADDRESS } from "./Contracts/EngraverContract";
import image1 from "../assets/scribble/CARD_PLACEHOLDER.jpg"

export default function ScribbleUpdateMetadata({
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
    customNoun,
    customColor,
    pieceName,
    collectorName,
    imgURL,
    scribbleNote,
    collectionClaimedWith,
    idClaimedWith,
    nftId,
    nftSelected,
    txProcessing,
    setTxProcessing,
    ownedCards,
    web3Provider,
    tombstoneSelected,
    buttonLabel,
}) {



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

    async function setTokenURI(tokenURI, nftId) {
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

                    let tx = await contract.changeURI(nftId, tokenURI);
                    props.setTxProcessing(false);
                    alert(
                        "Customized! Refresh the metadata on Campfire, Kalao or Joepegs!"
                    );
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTxProcessing(false);
        }
    }

    async function customizeScribbleCard() {
        setTxProcessing(true);
        try {
            let signature = await web3Provider
                .getSigner()

            const metadata = {
                name: `SCRIBBLE CARD CUSTOM - ${nftId}`,
                description: "The official collectable trading cards of SCRIBBLE WARLOCK. \n \nA special subseries of claimable CUSTOMS that can be unlocked through the owning of a piece from one of SCRIBBLE WARLOCK'S listed collections: ABSTRACT, MIND MATTER, OVERLOAD, PEACHES N STRAWBS, RESONATE, TALES FROM THE SCRIBBLE WARLOCK, UNFINISHED, & WASTELAND. \n \nCUSTOMS claimable at: https://thespot.art/scribble",
                image: imgURL, //ipfs CID
                attributes: [
                    {
                        trait_type: "Collector's Name:",
                        value: collectorName,
                    },
                    {
                        trait_type: "Piece Name:",
                        value: pieceName,
                    },
                    {
                        trait_type: "Color",
                        value: customColor,
                    },
                    {
                        trait_type: "Noun",
                        value: customNoun,
                    },
                    {
                        trait_type: "Collection Claimed With",
                        value: collectionClaimedWith,
                    },
                    {
                        trait_type: "Claimed With ID",
                        value: idClaimedWith,
                    },
                    {
                        trait_type: "Lore",
                        value: scribbleNote,
                    },
                ],
            };

            let jsonResponse = await uploadToMoralis(`${nftId}-json.json`, metadata);

            let jsonURL =
                jsonResponse.data.length > 0 ? jsonResponse.data[0].path : "";
            console.log(jsonURL);
            await setTokenURI(jsonURL, nftId);

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
                        onClick={() => customizeScribbleCard()}
                    >
                        {buttonLabel} {nftId}
                    </button>
                </div>
            </div>
        );
}