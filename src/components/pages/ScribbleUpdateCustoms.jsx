import React, { useState, useEffect, useRef, useCallback } from "react";
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


export const ScribbleUpdate = ({
    account,
    web3Modal,
    loadWeb3Modal,
    web3Provider,
    setWeb3Provider,
    logoutOfWeb3Modal,
    txProcessing,
    setTxProcessing,
}) => {

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
    let pausedState;
    const [isPaused, setIsPaused] = useState("");

    async function getPausedState() {
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

                    pausedState = await contract.paused();
                    if (pausedState) {
                        setIsPaused("Minting is Currently Paused")
                    }
                    if (!pausedState) {
                        setIsPaused("Minting is Currently Live")
                    }
                    console.log(pausedState);
                    console.log(isPaused);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTxProcessing(false);
        }
    }

    useEffect(() => {
        getPausedState();
    }, [txProcessing])

    async function flipPauseState() {
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

                    let tx = await contract.flipPausedState();
                    console.log(tx.hash);
                    setTxProcessing(false);
                    alert(
                        "Flipped Pause State!"
                    );
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTxProcessing(false);
        }
    }


    {
        /* For retrieval of traits */
    }
    const [walletTraits, setWalletTraits] = useState([]);
    const [nftSelected, setNftSelected] = useState(false);

    //https://api.joepegs.dev/v2/users/{address}/items
    //XyVue40t0uzAZRShwfLhTEFSA8piqCRpVIcc

    async function testing() {
        displayNfts.map((nft) => {
            setJsonMetaData(JSON.parse(nft.metadata));
        })
    }

    async function getTraits() {
        const options = {
            method: "GET",
            url: `https://deep-index.moralis.io/api/v2/nft/0x4b819687607f0772a1fa81ff550758B4024cD531`,
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
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTraits();
    }, []);

    function displayPausedState() {
        if (pausedState) {
            return (
                <div>Minting is Currently Paused</div>
            )
        }
        if (!pausedState) {
            return (
                <div>Minting is Currently Live</div>
            )
        }
    }


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
                        <img src={imageUrl} alt="logo" className="m-0 h-96 pr-6 pt-2"></img>
                    </div>
                    <div
                        className="grow border-dashed border-4 border-slate-500 p-3 pt-2 pl-5 m-1 text-left col-span-1 w-80 md:mt-10 lg:mt-2 mt-10 sm:mt-10 text-sm"
                        style={{ height: "15rem", width: "18rem" }}
                    >

                        <div
                            className={`text-spot-yellow text-lg font-bold pr-3 pl-2`}
                        >
                            Upload Image
                        </div>
                        <div className="pr-2">
                            <div className="w-full flex">
                                <div className="w-full pl-1 pr-3">

                                    <div className="container">
                                        <div className="pl-1 pb-2"><label className="text-white form-label">Choose File</label></div>
                                        <input className="text-white pb-2 pl-1" type="file" onChange={changeHandler} />
                                        <button className="m-1 w-full rounded-lg py-1 border-2 border-gray-200 text-gray-200
       hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base disabled:border-gray-600 disabled:hover:bg-gray-900 disabled:text-gray-600 disabled:hover:text-gray-600" onClick={handleSubmission}>Upload Custom Image</button>
                                    </div>


                                </div>
                            </div></div>

                        <ScribbleUpdateMetadata
                            id={textinputText}
                            imgURL={`https://ipfs.moralis.io:2053/ipfs/${imgURLHash}`}
                            account={account}
                            pieceName={textinput}
                            collectorName={collectorName}
                            customColor={customColor}
                            customNoun={customNoun}
                            collectionClaimedWith={collectionUsedToClaim}
                            idClaimedWith={idClaimedWith}
                            nftId={nftId}
                            scribbleNote={textinputText1}
                            txProcessing={txProcessing}
                            setTxProcessing={setTxProcessing}
                            ownedCards={ownedCards}
                            web3Provider={web3Provider}
                            nftSelected={nftSelected}
                        />
                        <div className="pl-1 pr-5 pt-10"><button
                            className="m-1 w-full rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base disabled:border-gray-600 disabled:hover:bg-gray-900 disabled:text-gray-600 disabled:hover:text-gray-600"

                            onClick={flipPauseState}
                        >
                            Flip Paused State for Minting: {isPaused}
                        </button></div>


                    </div>
                    <div className="pb-6 bg-slate-800">
                        <h1 className="text-center font-mono text-lg text-yellow-400 pt-1 pb-6">
                            Scribble Customs Metadata Update
                        </h1>

                        <div className="grid grid-cols-1 gap-4 pt-1 pl-4">
                            <div className="flex">
                                <div className=" text-white pr-6">NFT ID: </div>
                                <div className="text-spot-yellow font-mono">
                                    {nftId}
                                </div>
                            </div>
                            <div className="flex">
                                <div className=" text-white pr-6">Collector's Name: </div>
                                <div className="text-spot-yellow font-mono">
                                    {collectorName}
                                </div>
                            </div>
                            <div className="flex">
                                <div className=" text-white pr-5">Piece Name: </div>
                                <div className="text-spot-yellow font-mono">

                                    <input
                                        type="text"
                                        className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-48 h-6"
                                        placeholder="Piece Name"
                                        value={textinput}
                                        onChange={textinputUser.bind(this)}
                                    />
                                </div>
                            </div>
                            <div className="flex">
                                <div className=" text-white pr-6">Color: </div>
                                <div className="text-spot-yellow font-mono">
                                    {customColor}
                                </div>


                            </div>
                            <div className="flex">
                                <div className=" text-white pr-6">Noun: </div>
                                <div className="text-spot-yellow font-mono">
                                    {customNoun}
                                </div>


                            </div>
                            <div className="flex">
                                <div className=" text-white pr-6">Collection Used to Claim: </div>
                                <div className="text-spot-yellow font-mono">
                                    {collectionUsedToClaim}
                                </div>


                            </div>
                            <div className="flex">
                                <div className=" text-white pr-6">Id Claimed With: </div>
                                <div className="text-spot-yellow font-mono">
                                    {idClaimedWith}
                                </div>


                            </div>
                            <div className="flex">
                                <div className=" text-white pr-6">Lore: </div>
                                <div>
                                    <input
                                        type="text"
                                        className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-48 h-6"
                                        placeholder="Scribble Field"
                                        value={textinputText1}
                                        onChange={textinputUserText1.bind(this)}
                                    />
                                </div>


                            </div>

                            <div className="flex">
                                <div className=" text-white pr-6">ImgUrl: </div>
                                <div className="text-white">
                                    <a href={`https://ipfs.moralis.io:2053/ipfs/${imgURLHash}`} target="_blank"> https://ipfs.moralis.io:2053/ipfs/{imgURLHash}</a>
                                </div>


                            </div>
                            <div><img src={`https://ipfs.moralis.io:2053/ipfs/${imgURLHash}`} alt="New Image" className="m-0 h-96 pr-6 pt-2 text-white"></img></div>
                        </div>
                    </div>

                </div>
                {/* canvas div ends */}
                {/* Stats div*/}
                <div className="">
                    <div className="flex">
                        <div className="p-10 grid grid-cols-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-5 font-mono text-spot-yellow">{jsonMetaData.map((nfts) => {
                            return (
                                <div onClick={() => {
                                    setNftId(nfts.token_id)
                                    updateTraitMetaData(nfts)
                                }}>
                                    <div className="hover:z-0 rounded overflow-hidden shadow-lg bg-slate-700 hover: hover:scale-105 hover:bg-slate-500 duration-300">
                                        <div className="grid grid-cols-1">
                                            <img className="h-48 mx-auto pt-4" src={nfts.normalized_metadata.image} alt={nfts.normalized_metadata.attributes[0].value}></img>
                                            <div className="pt-4 pr-2 pl-2">
                                                <div className="font-bold text-md mb-2">
                                                    <div className="bg-slate-600"> <h1>ID: {nfts.token_id}</h1></div>
                                                    <h5 className="text-white">Collector Name: {nfts.normalized_metadata.attributes[0].value}</h5>
                                                    <div className="bg-slate-600"><h5>Piece Name: {nfts.normalized_metadata.attributes[1].value}</h5></div>
                                                    <h5 className="text-white">Color: {nfts.normalized_metadata.attributes[2].value}</h5>
                                                    <div className="bg-slate-600"><h5>Noun: {nfts.normalized_metadata.attributes[3].value}</h5></div>
                                                    <h5 className="text-white">Collection Claimed with: {nfts.normalized_metadata.attributes[4].value}</h5>
                                                    <div className="bg-slate-600"><h5>ID Claimed with: {nfts.normalized_metadata.attributes[5].value}</h5></div>
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
