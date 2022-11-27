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


    const isAuthenticated = Boolean(account);
    const userAddress = account;
    const nfTombstoneContract = "0xe3525413c2a15daec57C92234361934f510356b8"; //change to mainnet address
    const spotNFTContract = "0x9455aa2aF62B529E49fBFE9D10d67990C0140AFC";
    const [filter, setFilter] = useState("");
    const [savedImage, setSavedImage] = useState("empty image"); //Saving image for sending to IPFS. This part isn't active yet!


    //scribble
    const [contractSelected, setContractSelected] = useState();
    const mindMattersContract = "0xC3C831b19B85FdC2D3E07DE348E7111BE1095Ba1";
    const overloadContract = "0x424F2C77341d692496544197Cc39708F214EEfc4";
    const talesContract = "0x5DF36A4E61800e8cc7e19d6feA2623926C8EF960";
    const peachesAndStrabsContract = "0x8d17f8Ca6EFE4c85981A4C73c5927beEe2Ad1168";
    const abstractContract = "0x8f1e73AA735A33e3E01573665dc7aB66DDFBa4B2";
    const unfinishedContract = "0xeCf0d76AF401E400CBb5C4395C76e771b358FE06";
    const wastelandContract = "0xbc54D075a3b5F10Cc3F1bA69Ee5eDA63d3fB6154";
    const resonateContract = "0xF3544a51b156a3A24a754Cad7d48a901dDbD83d2";

    //Metadata
    const [collectorName, setCollectorName] = useState("");
    const [collectionUsedToClaim, setCollectionUsedToClaim] = useState("");
    const [idClaimedWith, setIdClaimedWith] = useState("");
    const [customColor, setCustomColor] = useState("");
    const [customNoun, setCustomNoun] = useState("");
    const [metaData, setMetaData] = useState([]);
    const [jsonMetaData, setJsonMetaData] = useState([]);
    const [displayNfts, setDisplayNfts] = useState([]);
    let response;

    const [currentID, setCurrentID] = useState("1");
    const [nftId, setNftId] = useState("1");
    const [imageUrl, setImageUrl] = useState("https://thespot.mypinata.cloud/ipfs/QmYnmKqh8ahh1hVY5z4o5c5RJG34BC6fHKyuQnRiYQPpHH");


    async function updateMetaData() {
        setCollectorName(response.data.result[`${currentID}`].normalized_metadata.attributes[0].value);
        setTextinput(response.data.result[`${currentID}`].normalized_metadata.attributes[1].value);
        setCustomColor(response.data.result[`${currentID}`].normalized_metadata.attributes[2].value);
        setCustomNoun(response.data.result[`${currentID}`].normalized_metadata.attributes[3].value);
        setCollectionUsedToClaim(response.data.result[`${currentID}`].normalized_metadata.attributes[4].value);
        setIdClaimedWith(response.data.result[`${currentID}`].normalized_metadata.attributes[5].value);
        setNftId(response.data.result[`${currentID}`].token_id);
        setImageUrl(response.data.result[`${currentID}`].normalized_metadata.image);
        console.log(response.data);
    }



    //for text on canvas
    const [textinput, setTextinput] = useState("1");
    const [collection, setCollection] = useState("0xC3C831b19B85FdC2D3E07DE348E7111BE1095Ba1");
    const [textinputText, setTextinputText] = useState("1");
    const [textinputText1, setTextinputText1] = useState("");




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


    /*async function getHasClaimed(tokenURI, id) {
      setTxProcessing(true);
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          if (ENGRAVER_ABI && ENGRAVER_ADDRESS && signer) {
            const contract = new Contract(ENGRAVER_ADDRESS, ENGRAVER_ABI, signer);
            let options = {
              value: ethers.utils.parseEther(".1"),
            };
            console.log(id);
            console.log(tokenURI);
  
            let tx = await contract.engraveTombstone(id, tokenURI);
            console.log(tx.hash);
            props.setTxProcessing(false);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setTxProcessing(false);
      }
    }
  */
    //For Metadata
    const [tomebstoneBackground, setTombstoneBackground] = useState();
    const [tombstoneBase, setTombstoneBase] = useState();
    const [tombstoneBehind, setTomstoneBehind] = useState();
    const [tombstoneFlair, setTombstoneFlair] = useState();
    const [tombstoneGround, setTombstoneGround] = useState();
    const [tombstoneTop, setTombstoneTop] = useState();
    const [tombstoneId, setTombstoneId] = useState();
    const [name, setName] = useState();
    const [epitaph, setEpitaph] = useState();
    const [epitaph1, setEpitaph1] = useState();

    {
        /* For Image retrieval */
    }
    const [canvasImage, setCanvasImage] = useState({
        TombStone: "",
        Text: "",
    });
    {
        /* For Traits retrieval */
    }
    const [chosenTrait, setChosenTrait] = useState({
        TombStone: "1",
        TombStoneID: "1",
        BackGround: "",
        Base: "",
        Behind: "",
        Flair: "",
        Ground: "",
        Top: "",
        Name: "",
        Epitaph: "",
    });


    {
        /* For retrieval of traits */
    }
    const [walletTraits, setWalletTraits] = useState([]);
    const [apiLoaded, setApiLoaded] = useState(false);
    const [checkMyTraits, setCheckMyTraits] = useState(false);
    const [nftSelected, setNftSelected] = useState(false);

    //https://api.joepegs.dev/v2/users/{address}/items
    //XyVue40t0uzAZRShwfLhTEFSA8piqCRpVIcc

    /*useEffect(() => {
        const getNfts = async () => {
            const options = {
                method: "GET",
                url: `https://cors-anywhere.herokuapp.com/https://api.joepegs.dev/v2/users/${account}/items`,
                params: {
                    collectionAddresses: [collection],
                },
                headers: {
                    accept: "application/json",
                    "x-joepegs-api-key": "XyVue40t0uzAZRShwfLhTEFSA8piqCRpVIcc", //process.env.REACT_APP_MORALIS_API_KEY
                },
            };
            try {
                let response = await axios.request(options);
                console.log(response);
                let data = response.data;
                setWalletTraits(data.result.map((nft) => nft.token_id));
            } catch (error) {
                console.log(error);
            }
        };
        getNfts();
    }, [collection]);
*/
    async function testing() {
        displayNfts.map((nft) => {
            setJsonMetaData(JSON.parse(nft.metadata));
            // return <p>{jsonMetaData}</p>;
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
            /*const awaitingData = await setMetaData(JSON.parse(response.data.result[`${currentID}`].metadata));*/

            /*displayNfts.map((nft) => {
                setJsonMetaData(JSON.parse(nft.metadata));
                console.log(jsonMetaData);
                console.log(jsonMetaData.name);
                // return <p>{jsonMetaData}</p>;
            })*/
            updateMetaData();

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTraits();
    }, [textinputText]);



    function updateCanvasTraits(trait) {
        setCanvasImage((prevImage) => ({
            ...prevImage,
            [trait.traitType]: trait.image,
        }));
        setChosenTrait((prevTrait) => ({
            ...prevTrait,
            [trait.traitType]: trait.traitName,
            [trait.traitType + "ID"]: trait.id,
        }));
        setNftSelected(true);
    }

    function createCard(jsonMetaData) {
        //Building the card here from Card.jsx passing props and simultaneously fetching traits on click.
        return (
            <div
                key={jsonMetaData.image}
            /*onClick={() => {
                updateCanvasTraits(trait);
            }}*/
            >

                <Card
                    nftName={jsonMetaData.attributes[0].value}
                /*traitType={trait.traitType}
                traitName={trait.traitName}
                image={trait.image}
                id={trait.id}*/
                />
            </div>
        );
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



    function updateTraitMetaData() {
        setTombstoneBackground(
            nftombstoneData[`${chosenTrait.TombStoneID - 1}`].attributes[0].value
        );
        setTomstoneBehind(
            nftombstoneData[`${chosenTrait.TombStoneID - 1}`].attributes[1].value
        );
        setTombstoneBase(
            nftombstoneData[`${chosenTrait.TombStoneID - 1}`].attributes[2].value
        );
        setTombstoneFlair(
            nftombstoneData[`${chosenTrait.TombStoneID - 1}`].attributes[3].value
        );
        setTombstoneTop(
            nftombstoneData[`${chosenTrait.TombStoneID - 1}`].attributes[4].value
        );
        setTombstoneGround(
            nftombstoneData[`${chosenTrait.TombStoneID - 1}`].attributes[5].value
        );
        setTombstoneId(chosenTrait.TombStoneID);
    }


    // Add feature: Filter owned trait cards
    const [ownedCards, setOwnedCards] = useState(true);
    //---------------------------------//


    // Main Component Return
    return (
        <div className="flex-auto mx-auto w-full">
            {/* Canvas Row*/}
            <div className="grid 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4 mt-1 ml-6 sm:p-5 bg-slate-900 lg:pb-3">
                {/* canvas div */}

                <div
                    className="flex p-1 mb-10 sm:mb-10">


                    <img src={imageUrl} alt="logo" className="m-0 h-96 pr-6 pt-2"></img>

                    <div
                        className="grow border-dashed border-4 border-slate-500 p-3 pt-2 pl-5 m-1 text-left col-span-1 w-80 md:mt-10 lg:mt-2 mt-10 sm:mt-10 text-sm"
                        style={{ height: "19rem", width: "18rem" }}
                    >
                        {/* Individual Stats */}
                        <div className="font-mono text-white list-none flex pb-3 pt-4">
                            <div
                                className={`text-spot-yellow font-bold pr-3 pl-2`}
                            >
                                Index Number:
                            </div>
                            <input
                                type="number"
                                className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-12 h-6"
                                placeholder="id"
                                value={textinputText}
                                onChange={textinputUserText.bind(this)}
                            />
                        </div>
                        <div className="pr-5 pl-2">
                            <button className="m-1 w-full rounded-lg py-1 border-2 border-gray-200 text-gray-200
       hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base disabled:border-gray-600 disabled:hover:bg-gray-900 disabled:text-gray-600 disabled:hover:text-gray-600" onClick={getTraits}>Refresh Token Metadata</button>
                        </div>


                        {/* End of Indiv Stats */}
                        {/* Buttons */}


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
                            chosenTrait={chosenTrait}
                            walletTraits={walletTraits}
                            id={textinputText}
                            imgURL={`https://ipfs.moralis.io:2053/ipfs/${imgURLHash}`}
                            account={account}
                            canvas={chosenTrait}
                            savedImage={savedImage}
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
                            Flip Paused State
                        </button></div>
                    </div>
                    <div className="pb-6 md: pl-6">
                        <h1 className="text-center font-mono text-lg text-yellow-400 pt-1 pb-6">
                            Scribble Customs Metadata Update
                        </h1>

                        <div className="gap-4 pt-1 pl-2 grid grid-col-4">
                            <div className="flex">
                                <div className="col-span-2 text-white pr-6">NFT ID: </div>
                                <div className="text-spot-yellow font-mono">
                                    {nftId}
                                </div>
                            </div>
                            <div className="flex">
                                <div className="col-span-2 text-white pr-6">Collector's Name: </div>
                                <div className="text-spot-yellow font-mono">
                                    {collectorName}
                                </div>
                            </div>
                            <div className="flex">
                                <div className="col-span-2 text-white pr-5">Piece Name: </div>
                                <div className="text-spot-yellow font-mono">

                                    <input
                                        type="text"
                                        className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-96 h-6"
                                        placeholder="Piece Name"
                                        value={textinput}
                                        onChange={textinputUser.bind(this)}
                                    />
                                </div>
                            </div>
                            <div className="flex">
                                <div className="col-span-2 text-white pr-6">Color: </div>
                                <div className="text-spot-yellow font-mono">
                                    {customColor}
                                </div>


                            </div>
                            <div className="flex">
                                <div className="col-span-2 text-white pr-6">Noun: </div>
                                <div className="text-spot-yellow font-mono">
                                    {customNoun}
                                </div>


                            </div>
                            <div className="flex">
                                <div className="col-span-2 text-white pr-6">Collection Used to Claim: </div>
                                <div className="text-spot-yellow font-mono">
                                    {collectionUsedToClaim}
                                </div>


                            </div>
                            <div className="flex">
                                <div className="col-span-2 text-white pr-6">Id Claimed With: </div>
                                <div className="text-spot-yellow font-mono">
                                    {idClaimedWith}
                                </div>


                            </div>
                            <div className="flex">
                                <div className="col-span-2 text-white pr-6">Lore: </div>
                                <div>
                                    <input
                                        type="text"
                                        className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-96 h-6"
                                        placeholder="Scribble Field"
                                        value={textinputText1}
                                        onChange={textinputUserText1.bind(this)}
                                    />
                                </div>


                            </div>

                            <div className="flex">
                                <div className="col-span-2 text-white pr-6">ImgUrl: </div>
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


            </div>


            {/*<div className='self-end'>
                <button className="w-1/3 m-2 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={() => {
                        setOwnedCards(!ownedCards)
                    }}>{!ownedCards ? 'My Traits' : 'All Traits'}</button></div>
            <div className="overflow-y-auto">
                <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-6 gap-5 font-mono text-spot-yellow">
                    {ownedCards
                        ? ownedFilter.map(createCard)
                        : dataSearch.map(createCard)}
                </div>
                    </div>*/}

        </div>
    );
};
