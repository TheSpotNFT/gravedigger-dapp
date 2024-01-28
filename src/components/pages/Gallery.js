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
import NFTCard from '../NFTCard'; // Adjust the path based on your file structure


ReactGA.initialize('G-YJ9C2P37P6');


export const Gallery = ({
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

    //Page Token

    const [items, setItems] = useState([]); // State to store the items
    const [pageToken, setPageToken] = useState(null); // State to store the current page token
    const [loading, setLoading] = useState(false); // State to track loading status


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
const lastItemRef = useCallback(node => {
  if (loading) return; // Don't do anything if already loading
  if (observer.current) observer.current.disconnect();
  observer.current = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && pageToken) {
      fetchItems(); // Load more items when the last item is visible and there's a page token
    }
  });
  if (node) observer.current.observe(node);
}, [loading, pageToken]);


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
    const [nftSelected, setNftSelected] = useState([]);
  
    const userAddress = account;
   
    const options = {method: 'GET', headers: {accept: 'application/json'}};

    const fetchItems = async () => {
        if (loading) return;
        setLoading(true);
      
        const pageTokenParam = pageToken ? `&pageToken=${pageToken}` : '';
        const url = `https://glacier-api.avax.network/v1/chains/43114/addresses/${account}/balances:listErc721?pageSize=100${pageTokenParam}`;
      
        try {
          const response = await fetch(url, options);
          const data = await response.json();
          if (response.ok) {
            setItems(prevItems => [...prevItems, ...data.erc721TokenBalances]);
            setPageToken(data.nextPageToken); // Update only if response is OK
          } else {
            throw new Error(data.message || 'Error fetching data');
          }
        } catch (err) {
          console.error('Fetch error:', err);
        } finally {
          setLoading(false);
        }
      };
      
    
      useEffect(() => {
        fetchItems(); // Initial fetch
      }, [account]);
  

    const [tokenIds, setTokenIds] = useState([]);
    const [apiResponse, setApiResponse] = useState([]);
   


    const tokenIdsFromQuery = nftSelected.map(item => item.tokenId);
    const filteredMetadata = metadataRanked.filter(item => tokenIdsFromQuery.includes(item.edition.toString()));
    console.log('items', items);
    console.log('account', account);


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
<div className="text-white font-mono text-4xl py-8">Your NFT Gallery</div>


<div className="nft-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 pt-8 w-full">

{items.map((item, index) => {
    const key = item.metadataLastUpdatedTimestamp + "-" + index;
    return (
      <div key={key}>
        {/* Render your NFT card here */}
        <NFTCard nft={item} />
      </div>
    );
  })}
</div>


    
            </div>
        </div>
    );
};