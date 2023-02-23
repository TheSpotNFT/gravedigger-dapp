import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactGA from 'react-ga';
import Select from "react-select";
import Card from "../Card";
import traits from "../../traits";
import nftombstoneData from "../../contracts/nftombstoneMetadata.json";
import Authenticate from "../Authenticate";
import spotNFTAbi from "../../contracts/spotNFTAbi.json";
import spotTraitsAbi from "../../contracts/spotTraitsAbi.json";
import SetApproval from "../SetApproval";
import ScribbleUpdateMetadata from "../ScribbleUpdateMeta";
import "../../Board.css";
import nfTombstoneABI from "../../contracts/nfTombstoneABI.json";
import axios from "axios";
import { ethers, Contract } from "ethers";
import { SCRIBBLECLAIM_ABI, SCRIBBLECLAIM_ADDRESS } from "../Contracts/ScribbleContract";
import { json } from "react-router-dom";

ReactGA.initialize('G-YJ9C2P37P6');

export const Ded = ({
    account,
    web3Modal,
    loadWeb3Modal,
    web3Provider,
    setWeb3Provider,
    logoutOfWeb3Modal,
    txProcessing,
    setTxProcessing,
}) => {

    useEffect(() => {
        ReactGA.pageview(window.location.pathname + window.location.search);
    }, []);
    //user input text vars

    const textinputUser = (event) => {
        setTextinput(event.target.value);
    };
    const textinputUserText = (event) => {
        setTextinputText(event.target.value);
    };
    const textinputUserText1 = (event) => {
        setTextinputText1(event.target.value);
    };


    const [filter, setFilter] = useState("");
    const [savedImage, setSavedImage] = useState("empty image"); //Saving image for sending to IPFS. This part isn't active yet!


    //Metadata
    const [collectorName, setCollectorName] = useState("");
    const [collectionUsedToClaim, setCollectionUsedToClaim] = useState("");
    const [idClaimedWith, setIdClaimedWith] = useState("");
    const [customColor, setCustomColor] = useState("");
    const [customNoun, setCustomNoun] = useState("");
    const [jsonMetaData, setJsonMetaData] = useState([]);
    const [displayNfts, setDisplayNfts] = useState([]);
    let response;

    const [currentID, setCurrentID] = useState("1");
    const [nftId, setNftId] = useState("1");
    const [imageUrl, setImageUrl] = useState("https://thespot.mypinata.cloud/ipfs/QmYnmKqh8ahh1hVY5z4o5c5RJG34BC6fHKyuQnRiYQPpHH");

    //for text on canvas
    const [textinput, setTextinput] = useState("1");
    const [collection, setCollection] = useState("0xC3C831b19B85FdC2D3E07DE348E7111BE1095Ba1");
    const [textinputText, setTextinputText] = useState("1");
    const [textinputText1, setTextinputText1] = useState("");

    const [pauseStateFlipped, setPauseStateFlipped] = useState();


    //name font info
    const collectionOptions = [
        { value: "0xC3C831b19B85FdC2D3E07DE348E7111BE1095Ba1", label: "Mind Matter" },
        { value: "0x424F2C77341d692496544197Cc39708F214EEfc4", label: "Overload" },
        { value: "0x5DF36A4E61800e8cc7e19d6feA2623926C8EF960", label: "Tales" },
        { value: "0x8d17f8Ca6EFE4c85981A4C73c5927beEe2Ad1168", label: "Peaches and Strawbs" },
        { value: "0x8f1e73AA735A33e3E01573665dc7aB66DDFBa4B2", label: "Abstract" },
        { value: "0xeCf0d76AF401E400CBb5C4395C76e771b358FE06", label: "Unfinished" },
        { value: "0xbc54D075a3b5F10Cc3F1bA69Ee5eDA63d3fB6154", label: "Wasteland" },
        { value: "0xF3544a51b156a3A24a754Cad7d48a901dDbD83d2", label: "Resonate" },
    ];
    const [collectionDescription, setCollectionDescription] = useState("Mind Matter")

    const handleChange = (selectedOption) => {
        console.log("handleChange", selectedOption.value);
        setCollection(selectedOption.value);
        setCollectionDescription(selectedOption.label);
    };


    {
        /* For retrieval of traits */
    }
    const [walletTraits, setWalletTraits] = useState([]);
    const [nftSelected, setNftSelected] = useState(false);
    const [cursor, setCursor] = useState(null);
    const [prevCursor, setPrevCursor] = useState(null);

    async function getTraits() {
        const options = {
            method: "GET",
            url: `https://deep-index.moralis.io/api/v2/0x84b126C2e11689FD8A51c20e7d5beD6616F60558/nft`,
            params: {
                chain: "avalanche",
                format: "decimal",
                normalizeMetadata: "true",

            },
            headers: {
                accept: "application/json",
                "X-API-Key": "dHttwdzMWC7XigAxZtqBpTet7Lih3MqBRzUAIjXne0TIhJzXG4wrpdDUmXPPQFXo", //process.env.REACT_APP_MORALIS_API_KEY
            },
        };
        try {
            response = await axios.request(options);
            setDisplayNfts(response.data.result);
            setCurrentID(textinputText - 1);
            setJsonMetaData(response.data.result);
            setPrevCursor(cursor);
            setCursor(response.data.cursor);
            console.log(cursor);
            console.log(prevCursor);
            console.log(jsonMetaData);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTraits();
    }, []);



    // For Searching traits
    const searchText = (event) => {
        setFilter(event.target.value);
    };

    let dataSearch = traits.filter((item) => {
        return Object.keys(item).some((key) =>
            item[key]
                .toString()
                .toLowerCase()
                .includes(filter.toString().toLowerCase())
        );
    });
    let ownedFilter = traits.filter((item) => {
        if (walletTraits.includes(item.id.toString())) {
            return item;
        }
    });

    const [selectedFile, setSelectedFile] = useState();
    const [imgURLHash, setImgURLHash] = useState("");

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmission = async () => {

        const formData = new FormData();

        formData.append('file', selectedFile)

        const metadata = JSON.stringify({
            name: 'File name',
        });
        formData.append('pinataMetadata', metadata);

        try {
            const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                maxBodyLength: "Infinity",
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZmQ5MzgwYy1mYmI2LTQ1OWQtYjkzYy00Mzk3ZjNmMWVlZjYiLCJlbWFpbCI6ImpqemltbWVyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIzMmY5YWY0YzIwNTE2NTMxOWYyYyIsInNjb3BlZEtleVNlY3JldCI6Ijg3MWYwODVmMGEyM2FiZmU3YjMzOWNkODBiMzNmNGMwOTM5NGMzMTNjODRlYmViNDNkZGY0ZDYwMGFjNjgzYjkiLCJpYXQiOjE2NjY1NjcyMzB9.6GHJUEgK0W_Cc-z9ZxGBGbETjvSUKo8h6yh7u4__t_k`,
                }
            });
            console.log(res.data);
            console.log(res.data.IpfsHash);
            setImgURLHash(res.data.IpfsHash);
        } catch (error) {
            console.log(error);
        }
    };



    function updateTraitMetaData(nfts) {
        setCollectorName(
            nfts.normalized_metadata.attributes[0].value
        );
        setTextinput(
            nfts.normalized_metadata.attributes[1].value
        );
        setCustomColor(
            nfts.normalized_metadata.attributes[2].value
        );
        setCustomNoun(
            nfts.normalized_metadata.attributes[3].value
        );
        setCollectionUsedToClaim(
            nfts.normalized_metadata.attributes[4].value
        );
        setIdClaimedWith(
            nfts.normalized_metadata.attributes[5].value
        );
        setImageUrl(nfts.normalized_metadata.image);

    }

    const [displayGraphic, setDisplayGraphic] = useState()

    function displayImage(nfts) {
        if (nfts.normalized_metadata.image.startsWith("ipfs")) {
            let url = nfts.normalized_metadata.image;
            let slicedUrl = url.slice(7);
            setDisplayGraphic("https://gateway.pinata.cloud/ipfs/" + { slicedUrl });
            console.log(displayGraphic);
            /*return (
                <div><img className="h-48 mx-auto pt-4" src={ipfsUrl} alt=""></img></div>
            )*/
        }
        else {
            setDisplayGraphic(nfts.normalized_metadata.image);
            /*return (
                <div><img className="h-48 mx-auto pt-4" src={nfts.normalized_metadata.image} alt=""></img></div>
            )*/
        }

    }



    // Add feature: Filter owned trait cards
    const [ownedCards, setOwnedCards] = useState(true);
    //---------------------------------//


    // Main Component Return
    return (
        <div className="flex-auto mx-auto w-full">
            {/* Canvas Row*/}
            <div className="grid 2xl:grid-cols-2 xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1 gap-4 mt-1 ml-6 sm:p-5 bg-slate-900 lg:pb-3">
                {/* canvas div */}

                <div
                    className="grid grid-cols-3 p-1 mb-10 sm:mb-10">

                    <div className="w-max">
                        <img src={displayGraphic} alt="logo" className="m-0 h-96 pr-6 pt-2"></img>
                    </div>



                </div>
                {/* canvas div ends */}
                {/* Stats div*/}
                <div className="">
                    <div className="flex">
                        <div className="p-10 grid grid-cols-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-5 font-mono text-spot-yellow">{jsonMetaData.map((nfts) => {

                            return (
                                <div onClick={() => {
                                    //setNftId(nfts.token_id)
                                    //updateTraitMetaData(nfts)
                                }}>
                                    <div className="hover:z-0 rounded overflow-hidden shadow-lg bg-slate-700 hover: hover:scale-105 hover:bg-slate-500 duration-300 w-48">
                                        <div className="grid grid-cols-1">

                                            <img className="h-48 mx-auto pt-4" src={nfts.normalized_metadata.image} alt=""></img>
                                            <div className="pt-4 pr-2 pl-2">
                                                <div className="font-bold text-md mb-2">
                                                    <div className="bg-slate-600"> <h1>Name: {nfts.name}</h1></div>
                                                    <div className="bg-slate-600"> <h1>ID: {nfts.token_id}</h1></div>
                                                    <button className="m-1 w-full rounded-lg py-1 border-2 border-gray-200 text-gray-200
       hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base disabled:border-gray-600 disabled:hover:bg-gray-900 disabled:text-gray-600 disabled:hover:text-gray-600" onClick={displayImage}>Select This NFT</button>

                                                </div>
                                            </div></div>
                                        <div className="px-6 pt-4 pb-2">
                                        </div>
                                    </div></div>


                            )
                        })}</div>
                    </div></div>

            </div>
        </div>
    );
};
