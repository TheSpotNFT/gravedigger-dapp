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
import metadataRanked from '../../spotBotMetadata_Ranked.json';
import spotBotTokens from '../../spotBotTokens.json';
import NFTCard from './RarityCard'; // Adjust the path based on your file structure
import { useAuth } from "../../Auth";


ReactGA.initialize('G-YJ9C2P37P6');


export const Rarity = ({
    id
}) => {
  const {
    account,
    web3Modal,
    loadWeb3Modal,
    web3Provider,
    setWeb3Provider,
    logoutOfWeb3Modal,
    // ... any other states or functions you need ...
  } = useAuth();
  
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

    //Filter 
    const [filterId, setFilterId] = useState('');

    //LOOKUP
    const [tokenId, setTokenId] = useState('');
    const [ranking, setRanking] = useState('');
    const findRanking = () => {
      const rank = metadataRanked[tokenId]?.attributes[6].value || 'Rank not found';
      console.log(tokenId, metadataRanked[tokenId]);
      setRanking(rank);
    };

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

//LOADER
    const [displayedNFTs, setDisplayedNFTs] = useState([]);
    useEffect(() => {
      // Reset displayedNFTs when filter changes
      setDisplayedNFTs([]);
      loadMoreNFTs();
  }, [filter]);
  
  const loadMoreNFTs = () => {
    // Filter metadataRanked first based on the filter, then slice it for pagination
    const filteredNFTs = filter ? metadataRanked.filter(nft => nft.edition === parseInt(filter)) : metadataRanked;
    const nextNFTs = filteredNFTs.slice(displayedNFTs.length, displayedNFTs.length + batchSize);
    setDisplayedNFTs(prevNFTs => [...prevNFTs, ...nextNFTs]);
};
  
  const observer = useRef();
  const lastNFTElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            loadMoreNFTs();
        }
    });
    if (node) observer.current.observe(node);
}, [displayedNFTs]);

//Filter
 const [filteredItem, setFilteredItem] = useState(null);
 const handleFilterChange = (filterCriterion) => {
  console.log("Filter Criterion:", filterCriterion); // Debug log
  const item = metadataRanked.find(nft => {
      console.log("Comparing:", nft.edition, filterCriterion); // Debug log
      return nft.edition === parseInt(filterCriterion);
  });
  console.log("Filtered Item:", item); // Debug log
  setFilteredItem(item);
};


    const batchSize = 20;
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


    /*async function getNFTs() {
      const options = {
          method: "GET",
          url: "https://glacier-api.avax.network/v1/chains/43114/nfts/collections/0x20Ef794f891C050D27bEC63F50B202cce97D7224/tokens", // Updated URL
          params: {
              // Updated parameters as required by the new API
          },
          headers: {
              accept: "application/json",
              "X-API-Key": "ac_5fHkJ9Tt5PWhpDy3oMy-0eiFyROF3QyukW8tuVHwhP0_zPN2mdElJEWL1MrMEYjOjimcc_d0Mv4PPRRP6D9cmw" //process.env.REACT_APP_NEW_API_KEY // Updated API Key
          },
      };
      
      try {
          const response = await axios.request(options);
          setJsonMetaData(response.data); // Adjust according to the new response structure
      } catch (error) {
          console.log(error);
      }
  };

  useEffect(() => {
      getNFTs();
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
            console.log(displayNfts);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getNfts();
    }, [account, nftsToDisplay]);

*/

    const [data, setData] = useState(null);
    const toggleShowOnlyYellowBorder = () => {
      setShowOnlyYellowBorder(!showOnlyYellowBorder);
    };
    const [showOnlyYellowBorder, setShowOnlyYellowBorder] = useState(false);

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
        
            {/* Canvas Row*/}
            <div className="gap-4 mt-1 ml-6 sm:p-5 bg-slate-900 lg:pb-3">
                {/* canvas div */}
<div className="text-white font-mono text-4xl py-8">Spot Bot Rarity</div>
  <div className="pt-4 pb-4">
    <div className="text-mono text-white">Filter by ID:</div>
  <div className="pb-8"><input 
    type="number" 
    value={filter} 
    onChange={(e) => {
      setFilter(e.target.value);
      handleFilterChange(e.target.value);
  }}
    placeholder="Enter ID Number" 
    className="pl-2"
  /></div>
    <button
          className="align-middle w-1/2 mx-auto rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/yourRarity")}
        >
          View Your NFTs
        </button>
        <div className="pt-4">
        <button 
        onClick={toggleShowOnlyYellowBorder}
        className="align-middle w-1/2 mx-auto rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
        hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
      >
         {showOnlyYellowBorder ? "Show Entire Collection" : "Show Minted NFTs Only"}
      </button></div>
</div>

<div className="nft-list grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-8">
{filteredItem && Object.keys(filteredItem).length > 0 ? (
// Render the filtered NFT
<div className={`grid grid-cols-1  bg-white bg-opacity-10 ${spotBotTokens.token_ids.includes(filteredItem.edition) ? 'border-4 border-spot-yellow cursor-pointer' : ''}`} key={filteredItem.edition} onClick={() => window.open(`https://avax.hyperspace.xyz/collection/avax/71bc03c0-0229-47d7-927a-9dbb7bc746d6?tokenAddress=0x20ef794f891c050d27bec63f50b202cce97d7224_${filteredItem.edition}`, "_blank")}>
  <div className="aspect-w-16 aspect-h-9 overflow-hidden">
    <img className="object-cover object-center w-full h-full" src={filteredItem.image} alt={`SPOT bot #${filteredItem.edition}`}></img>
  </div>
  <div className="p-4">
    <div className="pr-2 pl-2 h-60 overflow-y-auto">
      <div className="font-bold text-sm mb-2">
        <div className="bg-slate-600">
          <h2 className="text-blue-400 text-lg font-mono">Rank: {filteredItem.attributes.find(attr => attr.trait_type === "Rank")?.value || 'Rank not found'}</h2>
        </div>
        <h1 className="pt-2 pb-2 text-md font-mono text-spot-yellow">ID: {filteredItem.edition}</h1>
        {filteredItem.attributes.map(attr => {
          const count = getCount(attr.trait_type, attr.value);
          return count ? (
            <h5 key={attr.trait_type} className="text-white break-words font-mono">{attr.trait_type}: {attr.value} (Count: {count})</h5>
          ) : null;
        })}
      </div>
    </div>
  </div>
</div>
) : (
  // Render all NFTs
  displayedNFTs.map((nft, index) => (
    <div 
    className={`${
      showOnlyYellowBorder && !spotBotTokens.token_ids.includes(nft.edition) ? 'hidden' : 'grid grid-cols-1'
    } bg-white bg-opacity-10 ${spotBotTokens.token_ids.includes(nft.edition) ? 'border-4 border-spot-yellow cursor-pointer' : ''}`}
    
      key={nft.edition} 
      onClick={() => window.open(`https://salvor.io/collections/0x20ef794f891c050d27bec63f50b202cce97d7224/${nft.edition}`, "_blank")}
      ref={index === displayedNFTs.length - 1 ? lastNFTElementRef : null}
    >
      <div className="aspect-w-16 aspect-h-9 overflow-hidden">
        <img className="object-cover object-center w-full h-full" src={nft.image} alt={`SPOT bot #${nft.edition}`}></img>
      </div>
      <div className="p-4">
        <div className="pr-2 pl-2 h-60 overflow-y-auto">
          <div className="font-bold text-sm mb-2">
            <h2 className="text-blue-400 text-lg font-mono">Rank: {nft.attributes.find(attr => attr.trait_type === "Rank")?.value || 'Rank not found'}</h2>
            <h1 className="pt-2 pb-2 text-md font-mono text-spot-yellow">ID: {nft.edition}</h1>
            {nft.attributes.map(attr => {
              const count = getCount(attr.trait_type, attr.value);
              return count ? (
                <h5 key={attr.trait_type} className="text-white break-words font-mono">{attr.trait_type}: {attr.value} (Count: {count})</h5>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  ))
)}
</div>


    
            </div>
        </div>
    );
};