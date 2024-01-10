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
import { SPOTBOT_ABI, SPOTBOT_ADDRESS } from "../Contracts/SpotBotContract";
import { json } from "react-router-dom";
import spotBotRarity from "../../spotBotRarity.json";
import LogoutButton from "../Logout";
import rankedData from '../../rankedOutput.json'; 

ReactGA.initialize('G-YJ9C2P37P6');


export const Rarity = ({
    account,
    web3Modal,
    loadWeb3Modal,
    web3Provider,
    setWeb3Provider,
    logoutOfWeb3Modal,
    txProcessing,
    setTxProcessing,
    id
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
    function exploreClick(){
      setExplore(!explore);
    }

    function toggleNfts(){
      setNftsToDisplay(!nftsToDisplay);
    }

    const [nftsToDisplay, setNftsToDisplay] = useState(true);
    const [explore, setExplore] = useState(false);
    const [filter, setFilter] = useState("");
    const [savedImage, setSavedImage] = useState("empty image"); //Saving image for sending to IPFS. This part isn't active yet!
    const onClickUrl = (url) => {
      return () => openInNewTab(url);
    };
    const openInNewTab = (url) => {
      const newWindow = window.open(url, "_blank", "noopener,noreferrer");
      if (newWindow) newWindow.opener = null;
    };

    //Ranking
    const getRankById = (id) => {
      return rankedData[id]?.ranking || 'Rank not found';
    }

    const rank = getRankById(id);


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
    const [collection, setCollection] = useState("0x20Ef794f891C050D27bEC63F50B202cce97D7224");
    const [textinputText, setTextinputText] = useState("1");
    const [textinputText1, setTextinputText1] = useState("");

    const [pauseStateFlipped, setPauseStateFlipped] = useState();

    const sortNftsByRank = (nfts) => {
      return nfts.sort((a, b) => {
        const rankA = rankedData[a.token_id]?.ranking || Infinity;
        const rankB = rankedData[b.token_id]?.ranking || Infinity;
        return rankA - rankB;
      });
    };


    //name font info
    const collectionOptions = [
        { value: "0x20Ef794f891C050D27bEC63F50B202cce97D7224", label: "Spot Bot" },

    ];
    const [collectionDescription, setCollectionDescription] = useState("Spot Bot")

    {
        /* For retrieval of traits */
    }
    const [walletTraits, setWalletTraits] = useState([]);
    const [nftSelected, setNftSelected] = useState(false);
    const userAddress = account;

    async function getTraits() {
        const options = {
            method: "GET",
            url: `https://deep-index.moralis.io/api/v2/${account}/nft`,
                params: {
                    chain: "avalanche",
                    format: "decimal",
                    token_addresses: "0x20Ef794f891C050D27bEC63F50B202cce97D7224",
                    normalizeMetadata: "true",
                },
            
            headers: {
                accept: "application/json",
                "X-API-Key": "dHttwdzMWC7XigAxZtqBpTet7Lih3MqBRzUAIjXne0TIhJzXG4wrpdDUmXPPQFXo", //process.env.REACT_APP_MORALIS_API_KEY
            },
        };
        try {
            response = await axios.request(options);
            setJsonMetaData(response.data.result);
          
          
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTraits();
    }, [account, nftsToDisplay]);
    
     async function getNfts() {
        const options = {
            method: "GET",
            url: `https://deep-index.moralis.io/api/v2/nft/0x20Ef794f891C050D27bEC63F50B202cce97D7224`,
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
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getNfts();
    }, [account, nftsToDisplay]);
   

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


    const [data, setData] = useState(null);

   
    
    const getCount = (attributeValue, value) => {
      const item = spotBotRarity.find(item => item.attributeValue === attributeValue && item.value === value);
      return item ? item.count : null;
    };


    // Add feature: Filter owned trait cards
    const [ownedCards, setOwnedCards] = useState(true);
    //---------------------------------//


    // Main Component Return
    return (
        <div className="container mx-auto w-full">
          <div className="pt-6 px-12 bg-slate-900">
        <div className="fixed"><div className="pb-2"><LogoutButton
            account={account}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            web3Provider={web3Provider}
            setWeb3Provider={setWeb3Provider}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
          /></div>
          <div>
          <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-4 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-40
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={exploreClick}
        >
          {explore ? "Hide" : "Explore"}
        </button></div>
        <div className={`${explore ? 'absolute left-0 top-22 w-full opacity-100' : 'absolute -left-60 top-22 w-full opacity-0'} transition-all duration-500`}>
        <div className="py-2 pt-4">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/")}
        >
          Home
        </button>
        </div>
        <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("https://campfire.exchange/collections/0x0c6945e825fc3c80f0a1ea1d3e24d6854f7460d8")}
        >
          Genesis Collection
        </button>
        </div>
        <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/spotbot")}
        >
          Spot Bot
        </button>
        </div>
        <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/goatd")}
        >
          Goatd
        </button>
        </div>
        <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/gravedigger")}
        >
          NFTombstones
        </button>
        </div><div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/unnamed")}
        >
          Unnamed Branding
        </button>
        </div><div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/analog")}
        >
          Analog
        </button>
        </div><div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/staking")}
        >
          Staking
        </button>
        </div><div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/scribble")}
        >
          Scribble Customs
        </button></div>
        <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("https://twitter.com/TheSpotUG")}
        >
          Twitter
        </button>
        </div><div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("https://discord.com/invite/4wvC6xTFyB")}
        >
          Discord
        </button>
          </div></div></div>
     
  </div>
            {/* Canvas Row*/}
            <div className="gap-4 mt-1 ml-6 sm:p-5 bg-slate-900 lg:pb-3">
                {/* canvas div */}
<div className="text-white font-mono text-4xl py-8">Spot Bot Rarity</div>
<div className="text-white font-mono text-2xl py-4">{nftsToDisplay ? 'Your Bots' : 'All Bots Minted'}</div>

<div className="text-white font-mono text-xl py-2">(Trait Type: Value: Count in Collection)</div>

<div className="flex pt-4 align-middle justify-center">
          <button
          className="align-middle w-1/2 rounded-lg sm:px-4 md:px-4 lg:px-4 xl:px-4 px-4 py-4 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-40
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={toggleNfts}
        >
          {nftsToDisplay ? "Show All Bots Minted" : "Show Your Bots Only"}
        </button></div>
                {/* canvas div ends */}
                {/* Stats div*/}
                <div className="">
                    <div className="flex">
                    <div className="p-10 flex flex-wrap gap-5 font-mono text-spot-yellow">
  {nftsToDisplay ? jsonMetaData.map((nfts) => {
    if (!nfts || !nfts.normalized_metadata || !nfts.normalized_metadata.attributes || !nfts.normalized_metadata.attributes[0] || !nfts.normalized_metadata.attributes[1] || !nfts.normalized_metadata.attributes[2] || !nfts.normalized_metadata.attributes[3] || !nfts.normalized_metadata.attributes[4] || !nfts.normalized_metadata.attributes[5]) {
      return null;
    }
    const collectorName = nfts.normalized_metadata.attributes[0].value;
    if (!collectorName) {
      return null;
    }
    return (
      <div key={nfts.token_id} onClick={() => {
        setNftId(nfts.token_id)
      }}>
        <div className="hover:z-0 rounded overflow-hidden shadow-lg bg-slate-700 hover: hover:scale-105 hover:bg-slate-500 duration-300">
          <div className="grid grid-cols-1">
            <img className="h-48 mx-auto pt-4" src={nfts.normalized_metadata.image} alt=""></img>
            <div className="pt-4 pr-2 pl-2">
              <div className="font-bold text-sm mb-2">
                <div className="bg-slate-600">
                  <h1>ID: {nfts.token_id}</h1>
                </div>
                <h2 className="text-blue-400">Rank: {rankedData[nfts.token_id]?.ranking || 'Rank not found'}</h2>
                <div className="pt-2"><h2>Rarest Trait</h2><h2> {rankedData[nfts.token_id]?.rarestTrait || 'Rarest trait not found'}</h2></div>
                <h5 className="text-white pt-2">BG: {collectorName} ({getCount('Background', `${collectorName}`)})</h5>
                <h5 className="text-white">Body: {nfts.normalized_metadata.attributes[1].value} ({getCount('Body', `${nfts.normalized_metadata.attributes[1].value}`)})</h5>
                <h5 className="text-white">Expression: {nfts.normalized_metadata.attributes[2].value} ({getCount('Expression', `${nfts.normalized_metadata.attributes[2].value}`)})</h5>
                <h5 className="text-white">Necklace: {nfts.normalized_metadata.attributes[3].value} ({getCount('Necklace', `${nfts.normalized_metadata.attributes[3].value}`)})</h5>
                <h5 className="text-white">Shirt: {nfts.normalized_metadata.attributes[4].value} ({getCount('Shirt', `${nfts.normalized_metadata.attributes[4].value}`)})</h5>
                <h5 className="text-white">Headwear: {nfts.normalized_metadata.attributes[5].value} ({getCount('Headwear', `${nfts.normalized_metadata.attributes[5].value}`)})</h5>
              </div>
            </div>
          </div>
          <div className="px-6 pt-4 pb-2">
          </div>
        </div>
      </div>
    );
  }
  ) : 
  displayNfts.map((nfts) => {
    if (!nfts || !nfts.normalized_metadata || !nfts.normalized_metadata.attributes || !nfts.normalized_metadata.attributes[0] || !nfts.normalized_metadata.attributes[1] || !nfts.normalized_metadata.attributes[2] || !nfts.normalized_metadata.attributes[3] || !nfts.normalized_metadata.attributes[4] || !nfts.normalized_metadata.attributes[5]) {
      return null;
    }
    const collectorName = nfts.normalized_metadata.attributes[0].value;
    if (!collectorName) {
      return null;
    }
    return (
      <div key={nfts.token_id} onClick={() => {
        setNftId(nfts.token_id)
      }}>
        <div className="hover:z-0 rounded overflow-hidden shadow-lg bg-slate-700 hover: hover:scale-105 hover:bg-slate-500 duration-300">
          <div className="grid grid-cols-1">
            <img className="h-48 mx-auto pt-4" src={nfts.normalized_metadata.image} alt=""></img>
            <div className="pt-4 pr-2 pl-2">
              <div className="font-bold text-sm mb-2">
                <div className="bg-slate-600">
                  <h1>ID: {nfts.token_id}</h1>
                </div>
                <h2 className="text-blue-400">Rank: {rankedData[nfts.token_id]?.ranking || 'Rank not found'}</h2>
                <div className="pt-2"><h2>Rarest Trait</h2><h2> {rankedData[nfts.token_id]?.rarestTrait || 'Rarest trait not found'}</h2></div>
                <h5 className="text-white pt-2">BG: {collectorName} ({getCount('Background', `${collectorName}`)})</h5>
                <h5 className="text-white">Body: {nfts.normalized_metadata.attributes[1].value} ({getCount('Body', `${nfts.normalized_metadata.attributes[1].value}`)})</h5>
                <h5 className="text-white">Expression: {nfts.normalized_metadata.attributes[2].value} ({getCount('Expression', `${nfts.normalized_metadata.attributes[2].value}`)})</h5>
                <h5 className="text-white">Necklace: {nfts.normalized_metadata.attributes[3].value} ({getCount('Necklace', `${nfts.normalized_metadata.attributes[3].value}`)})</h5>
                <h5 className="text-white">Shirt: {nfts.normalized_metadata.attributes[4].value} ({getCount('Shirt', `${nfts.normalized_metadata.attributes[4].value}`)})</h5>
                <h5 className="text-white">Headwear: {nfts.normalized_metadata.attributes[5].value} ({getCount('Headwear', `${nfts.normalized_metadata.attributes[5].value}`)})</h5>
              </div>
            </div>
          </div>
          <div className="px-6 pt-4 pb-2">
          </div>
        </div>
      </div>
    );
  }
  )
}
</div>

                    </div></div>
               
            </div>
        </div>
    );
};
