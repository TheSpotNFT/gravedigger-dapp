import React, { useState, useEffect, useRef, useCallback } from "react";
import Select from "react-select";
import Card from "../ScribbleCard";
import traits from "../../traits";
import traitsCustoms from "../../scribbleCustoms";
import ScribbleMint from "../ScribbleMint";
import "../../Board.css";
import axios from "axios";
import image1 from "../../assets/scribble/CARD_PLACEHOLDER.jpg"
import DisplayCards from "../ScribbleCard1";
import { SCRIBBLECLAIM_ABI, SCRIBBLECLAIM_ADDRESS } from "../Contracts/ScribbleContract";
import { ethers, Contract } from "ethers";

export const Scribble = ({
    account,
    web3Modal,
    loadWeb3Modal,
    web3Provider,
    setWeb3Provider,
    logoutOfWeb3Modal,
    txProcessing,
    setTxProcessing,
}) => {
    const isAuthenticated = Boolean(account);
    const userAddress = account;
    const [filter, setFilter] = useState("");


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


    const [textinput, setTextinput] = useState("");
    const [collection, setCollection] = useState("0xC3C831b19B85FdC2D3E07DE348E7111BE1095Ba1");
    const [textinputText, setTextinputText] = useState("");
    const [textinputText1, setTextinputText1] = useState("");
    const [textinputText2, setTextinputText2] = useState("");
    const [catalogNumber, setCatalogNumber] = useState("1");


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
    const textinputUserText2 = (event) => {
        setTextinputText2(event.target.value);
    };

    //name font info
    const collectionOptions = [
        { value: "0xC3C831b19B85FdC2D3E07DE348E7111BE1095Ba1", label: "Mind Matter", catalog: "1" },
        { value: "0x424F2C77341d692496544197Cc39708F214EEfc4", label: "Overload", catalog: "2" },
        { value: "0x5DF36A4E61800e8cc7e19d6feA2623926C8EF960", label: "Tales", catalog: "3" },
        { value: "0x8d17f8Ca6EFE4c85981A4C73c5927beEe2Ad1168", label: "Peaches and Strawbs", catalog: "4" },
        { value: "0x8f1e73AA735A33e3E01573665dc7aB66DDFBa4B2", label: "Abstract", catalog: "5" },
        { value: "0xeCf0d76AF401E400CBb5C4395C76e771b358FE06", label: "Unfinished", catalog: "6" },
        { value: "0xbc54D075a3b5F10Cc3F1bA69Ee5eDA63d3fB6154", label: "Wasteland", catalog: "7" },
        { value: "0xF3544a51b156a3A24a754Cad7d48a901dDbD83d2", label: "Resonate", catalog: "8" },
    ];
    const [collectionDescription, setCollectionDescription] = useState("Mind Matter")

    const handleChange = (selectedOption) => {

        setCollection(selectedOption.value);
        setCollectionDescription(selectedOption.label);
        setCatalogNumber(selectedOption.catalog);
    };

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


    {
        /* For Data retrieval */
    }
    const [chosenTrait, setChosenTrait] = useState({
        Scribble: "1",
        ScribbleID: "1",
        Custom: "",
        CustomID: "1",

    });


    {
        /* For retrieval of traits */
    }
    const [walletTraits, setWalletTraits] = useState([]);
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


    useEffect(() => {
        const getTraits = async () => {
            const options = {
                method: "GET",
                url: `https://deep-index.moralis.io/api/v2/${account}/nft`,
                params: {
                    chain: "avalanche",
                    format: "decimal",
                    token_addresses: collection,
                },
                headers: {
                    accept: "application/json",
                    "X-API-Key": "dHttwdzMWC7XigAxZtqBpTet7Lih3MqBRzUAIjXne0TIhJzXG4wrpdDUmXPPQFXo", //process.env.REACT_APP_MORALIS_API_KEY
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
        getTraits();
    }, [collection, account]);

    function updateCanvasTraits(trait) {
        setChosenTrait((prevTrait) => ({
            ...prevTrait,
            [trait.traitType]: trait.traitName,
            [trait.traitType + "ID"]: trait.id,
        }));
        setNftSelected(true);
    }

    async function getHasClaimed(tokenURI, id) {
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
                    console.log(id);
                    console.log(tokenURI);

                    let tx = await contract.changeURI(id, tokenURI);
                    console.log(tx.hash);
                    setTxProcessing(false);
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

    function createMindMatterCard(trait) {
        //Building the card here from Card.jsx passing props and simultaneously fetching traits on click.
        if (collection == "0xC3C831b19B85FdC2D3E07DE348E7111BE1095Ba1") { //Mind Matter
            return (
                <div
                    key={trait.edition}
                    onClick={() => {
                        updateCanvasTraits(trait);
                    }}
                >
                    {" "}
                    <Card
                        nftName={collectionDescription}
                        id={trait.id}
                        image={trait.image1}
                    />
                </div>
            );
        }
        if (collection == "0x424F2C77341d692496544197Cc39708F214EEfc4") { //Overload
            return (
                <div
                    key={trait.edition}
                    onClick={() => {
                        updateCanvasTraits(trait);
                    }}
                >
                    {" "}
                    <Card
                        nftName={collectionDescription}
                        image={trait.image2}
                        id={trait.id}
                    />
                </div>
            );
        }
        if (collection == "0x5DF36A4E61800e8cc7e19d6feA2623926C8EF960") {//Tales
            return (
                <div
                    key={trait.edition}
                    onClick={() => {
                        updateCanvasTraits(trait);
                    }}
                >
                    {" "}
                    <Card
                        nftName={collectionDescription}
                        image={trait.image3}
                        id={trait.id}
                    />
                </div>
            );
        }
        if (collection == "0x8d17f8Ca6EFE4c85981A4C73c5927beEe2Ad1168") {//PNS
            return (
                <div
                    key={trait.edition}
                    onClick={() => {
                        updateCanvasTraits(trait);
                    }}
                >
                    {" "}
                    <Card
                        nftName={collectionDescription}
                        image={trait.image4}
                        id={trait.id}
                    />
                </div>
            );
        }
        if (collection == "0x8f1e73AA735A33e3E01573665dc7aB66DDFBa4B2") {//Abstract
            return (
                <div
                    key={trait.edition}
                    onClick={() => {
                        updateCanvasTraits(trait);
                    }}
                >
                    {" "}
                    <Card
                        nftName={collectionDescription}
                        image={trait.image5}
                        id={trait.id}
                    />
                </div>
            );
        }
        if (collection == "0xeCf0d76AF401E400CBb5C4395C76e771b358FE06") {//Unfinished
            return (
                <div
                    key={trait.edition}
                    onClick={() => {
                        updateCanvasTraits(trait);
                    }}
                >
                    {" "}
                    <Card
                        nftName={collectionDescription}
                        image={trait.image6}
                        id={trait.id}
                    />
                </div>
            );
        }
        if (collection == "0xbc54D075a3b5F10Cc3F1bA69Ee5eDA63d3fB6154") {//Wasteland
            return (
                <div
                    key={trait.edition}
                    onClick={() => {
                        updateCanvasTraits(trait);
                    }}
                >
                    {" "}
                    <Card
                        nftName={collectionDescription}
                        image={trait.image7}
                        id={trait.id}
                    />
                </div>
            );
        }
        if (collection == "0xF3544a51b156a3A24a754Cad7d48a901dDbD83d2") {//Resonate
            return (
                <div
                    key={trait.edition}
                    onClick={() => {
                        updateCanvasTraits(trait);
                    }}
                >
                    {" "}
                    <Card
                        nftName={collectionDescription}
                        image={trait.image8}
                        id={trait.id}
                    />
                </div>
            );
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
    const [mintEnabled, setMintEnabled] = useState(false);

    function colorAndNameEntered() {
        if (textinputText.length != 0 && textinputText1 != 0) {
            setMintEnabled(true);
        }
        else {
            setMintEnabled(false);
        }

    }
    useEffect(() => {
        colorAndNameEntered();
    }, [textinputText, textinputText1]);

    function drawCards() {
        return (
            <div>
                {ownedCards
                    ? ownedFilter.map(createMindMatterCard)
                    : dataSearch.map(createMindMatterCard)}</div>

        );
    }
    const [claimed, setClaimed] = useState();
    let hasClaimed;
    async function getHasClaimed() {

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


                    hasClaimed = await contract.hasBeenClaimed7(chosenTrait.ScribbleID);
                    console.log(hasClaimed);

                    setClaimed(hasClaimed);

                    if (hasClaimed === 1) {
                        setClaimed("ALREADY CLAIMED");
                    }
                    if (hasClaimed === 0) {
                        setClaimed("Not Claimed");
                    }
                }
            }
        } catch (error) {
            console.log(error);
        } finally {

        }
    }
    useEffect(() => {
        getHasClaimed();
    }, [chosenTrait.ScribbleID])
    // Add feature: Filter owned trait cards
    const [ownedCards, setOwnedCards] = useState(true);
    //---------------------------------//

    // Main Component Return
    return (
        <div className="flex-auto mx-auto w-full">
            {/* Canvas Row*/}
            <div className="grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 gap-4 ml-2 sm:p-5 bg-slate-900">
                {/* canvas div */}
                <div className="flex flex-cols place-content-center"><img src={image1} alt="logo" className="m-0 h-96"></img></div>
                <div
                    className="flex flex-cols w-auto col-span-1 p-1 mb-10 sm:mb-10">

                    <div className="pb-6 pl-4">
                        <h1 className="text-center font-mono text-lg text-yellow-400 pt-1 pb-6">
                            Scribble Customs
                        </h1>
                        <h3 className="text-center font-mono text-xs text-white pt-1 pb-6 sm:pr-10">
                            Enter the info for your custom piece below. Collector name is your handle to be included in the metadata of the final piece which is optional. Piece Name is the name you'd like the custom piece to have and is also optional. Color and Noun are required to mint a custom card, these give Scribble Warlock guidance for the piece.
                        </h3>

                        <div className="gap-4 pt-1 pl-2 grid grid-col-1 place-content-center pr-14">
                            <div className="grid grid-cols-2">
                                <div className=" text-white pr-4">Collector: </div>
                                <div className="pl-1 pr-6">
                                    <input
                                        type="text"
                                        className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-36 h-6"
                                        placeholder="Ur Name (opt)"
                                        value={textinput}
                                        onChange={textinputUser.bind(this)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className=" text-white pr-4">Piece: </div>
                                <div className="pl-1 pr-6">
                                    <input
                                        type="text"
                                        className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-36 h-6"
                                        placeholder="Card Name (opt)"
                                        value={textinputText2}
                                        onChange={textinputUserText2.bind(this)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className=" text-white pr-4">Color: </div>
                                <div className="pl-1 pr-6">
                                    <input
                                        type="text"
                                        className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-36 h-6"
                                        placeholder="Color"
                                        value={textinputText}
                                        onChange={textinputUserText.bind(this)}
                                    />
                                </div>


                            </div>
                            <div className="grid grid-cols-2">
                                <div className=" text-white pr-4">Noun: </div>
                                <div className="pl-1 pr-6">
                                    <input
                                        type="text"
                                        className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-36 h-6"
                                        placeholder="Noun"
                                        value={textinputText1}
                                        onChange={textinputUserText1.bind(this)}
                                    />
                                </div>


                            </div>
                        </div>
                        <div className="sm:pr-16 pt-6"><a href="/scribblecustomcheck"><button
                            className="m-1 w-full rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base disabled:border-gray-600 disabled:hover:bg-gray-900 disabled:text-gray-600 disabled:hover:text-gray-600"

                        >
                            Check if an NFT has Claimed
                        </button></a></div>
                    </div>

                </div>
                {/* canvas div ends */}
                {/* Stats div*/}
                <div
                    className="border-dashed border-4 border-slate-500 p-3 pt-4 pl-5 m-1 text-left col-span-1 w-80 md:mt-10 lg:mt-2 mt-10 sm:mt-10 text-sm"
                    style={{ height: "18rem", width: "22rem" }}
                >
                    {/* Individual Stats */}
                    <div className="font-mono text-white list-none flex pb-3">
                        <div
                            className={`text-${walletTraits.includes(`${chosenTrait.ScribbleID}`)
                                ? "spot-yellow"
                                : "[red]"
                                } font-bold pr-3 pl-2`}
                        >
                            {collectionDescription} ID:{" "}
                        </div>
                        {chosenTrait.ScribbleID}
                    </div>


                    <ScribbleMint
                        chosenTrait={chosenTrait}
                        walletTraits={walletTraits}
                        id={chosenTrait.ScribbleID}
                        // saveImage={saveImage}
                        account={account}
                        canvas={chosenTrait}
                        name={textinputText2}
                        color={textinputText}
                        noun={textinputText1}
                        collection={collection}
                        mintEnabled={mintEnabled}
                        collectorName={textinput}
                        collectionDescription={collectionDescription}
                        txProcessing={txProcessing}
                        setTxProcessing={setTxProcessing}
                        ownedCards={ownedCards}
                        web3Provider={web3Provider}
                        nftSelected={nftSelected}
                    />
                    {/* End of Indiv Stats */}
                    {/* Buttons */}

                    <div className="font-mono text-white list-none flex pb-3 text-sm pl-2 pt-2">

                        The chosen NFT has {claimed} a Custom Scribble Card

                    </div>
                    <div className="pr-2">
                        <div className="font-mono text-white list-none flex pb-3 text-sm pl-2 pt-2">

                            Select Collection to use to Claim Custom Token.
                        </div><div className="w-full flex">
                            <div className="w-full pl-2 pr-2">
                                <Select
                                    options={collectionOptions}
                                    onChange={handleChange}
                                    defaultValue={{ label: "Mind Matter", value: "0xC3C831b19B85FdC2D3E07DE348E7111BE1095Ba1" }}
                                />
                            </div>
                        </div></div>



                </div>
            </div>

            {/* Canvas Row Div Ends*/}
            <div className="overflow-y-auto">
                <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-5 font-mono text-spot-yellow">
                    {ownedCards
                        ? ownedFilter.map(createMindMatterCard)
                        : dataSearch.map(createMindMatterCard)}
                </div>
            </div>

        </div>
    );
};