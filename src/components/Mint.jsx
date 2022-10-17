import { stringify } from 'postcss';
import React, { useEffect, useState } from 'react'
import { useWeb3ExecuteFunction, useMoralisCloudFunction } from "react-moralis";
import spotNFTAbi from '../contracts/spotNFTAbi.json';
import Moralis from 'moralis';
import unnamedData from '../metadata';
import unnamedAbi from '../contracts/spotNFTAbi.json';
import nfTombstoneABI from '../contracts/nfTombstoneABI.json';



function Mint(props) {
  const [isLoading, setIsLoading] = useState(false)
  const nfTombstonesContract = "0x9521807adf320d1cdf87afdf875bf438d1d92d87";
  const spotNFTContract = '0x9455aa2aF62B529E49fBFE9D10d67990C0140AFC';
  const chosenNfTombstone = useState();
  const chosenText = useState();
  const contractProcessor = useWeb3ExecuteFunction();
  const [isApproved, setIsApproved] = useState();

  let userAddress = props.userAddress

  const { data: mintData, error: mintError, fetch: mintFetch, isFetching: mintFetching, isLoading: mintLoading } = useWeb3ExecuteFunction();

  function getImage() {
    return props.saveImage()
  }

  async function isApprovedForAll() {
    const approvedForAll = {
      chain: "avalanche",
      address: "0x6BDAd2A83a8e70F459786a96a0a9159574685c0e",
      function_name: "isApprovedForAll",
      abi: unnamedAbi,
      params: {
        owner: userAddress,
        operator: "0xB043aaEb4337EA4BbB20C2ec5D846b00a0825ba5"
      },
    };
    const areYouApproved = await Moralis.Web3API.native.runContractFunction(
      approvedForAll
    );
    setIsApproved(areYouApproved);
  }
  useEffect(() => {
    isApprovedForAll();
  }, []);

  function checkTraits() {
    let isSafeBG = props.solidBG.some(ai => props.chosenTrait.BackgroundID === ai)
    if ((props.walletTraits.includes(String(props.chosenTrait.BackgroundID)) || isSafeBG) && props.walletTraits.includes(String(props.chosenTrait.BodyID)) && props.walletTraits.includes(String(props.chosenTrait.HeadID)) &&
      props.walletTraits.includes(String(props.chosenTrait.MouthID)) && props.walletTraits.includes(String(props.chosenTrait.EyesID)) && (props.walletTraits.includes(String(props.chosenTrait.HeadwearID)) || props.chosenTrait.HeadwearID === '599')) {
      return true;
    } else return false;
  }

  async function engraveTombstone() {

    setIsLoading(true)
    const base64 = await getImage()
    const imageData = new Moralis.File("img.png", { base64: base64 });
    await imageData.saveIPFS();
    const imgURL = await imageData.ipfs();
    console.log(imgURL)

    const metadata = {
      "name": "NFTombstone",
      "description": "Engraved NFTombstone",
      "image": imgURL,
      "edition": props.id,
      "attributes": [
        {
          "trait_type": "Background:",
          "value": props.background
        },
        {
          "trait_type": "Behind",
          "value": props.behind
        },
        {
          "trait_type": "Flair",
          "value": props.flair
        },
        {
          "trait_type": "Ground",
          "value": props.ground
        },
        {
          "trait_type": "Tombstone",
          "value": props.tombstone
        },
        {
          "trait_type": "Top",
          "value": props.top
        },
        {
          "trait_type": "Name",
          "value": props.name
        },
        {
          "trait_type": "Epitaph",
          "value": props.epitaph
        },

      ],
    }
    console.log(metadata)



    const metaDataFile = new Moralis.File("file.json", { base64: btoa(JSON.stringify(metadata)) });
    await metaDataFile.saveIPFS();
    const metaDataUrl = await metaDataFile.ipfs();
    console.log(metaDataUrl)

    await Moralis.enableWeb3();
    const sendOptions = {
      contractAddress: "0xe3525413c2a15daec57C92234361934f510356b8", //nfTombstone mainnet
      functionName: "engraveTombstone",
      abi: nfTombstoneABI,
      msgValue: Moralis.Units.ETH(0.5),
      params: {
        _tokenID: props.id,
        newTokenUri: metaDataUrl
      },
    };
    const transaction = await contractProcessor.fetch({
      params: sendOptions,
      onError: (err) => {
        setIsLoading(false);
        alert(JSON.stringify(err.data.message));
      },
      onSuccess: (tx) => {
        tx.wait(5)
          .then(alert("Minted Successfully! View your NFT on Campfire, Kalao or Joepegs!"))
          .then(setIsLoading(false))
          .then(console.log(tx));
      },
    });

  }


  if (isLoading) {
    return (
      <div><button className="inline-flex m-1 rounded-lg px-4 py-2 border-2 border-spot-yellow text-spot-yellow
     duration-300 font-mono font-bold text-base" disabled>
        <svg className="inline animate-ping h-5 w-5 mr-3" viewBox="0 0 35 35">
          <circle className="path" cx="12" cy="15" r="10" fill="yellow" stroke="yellow" strokeWidth="2"></circle>
        </svg>
        Processing...
      </button>
      </div>
    )
  } else
    return (

      <div className="flex w-full">
        <div className="w-full pr-5 pl-1">
          <button className="m-1 w-full rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={engraveTombstone}>Engrave</button>


        </div>




      </div>

    )
}

export default Mint;
