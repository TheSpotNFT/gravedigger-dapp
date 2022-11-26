import { stringify } from 'postcss';
import React, { useEffect, useState } from 'react'
import spotNFTAbi from '../components/Contracts/SpotNFTAbi.json';
import { GOATD_ADDRESS, GOATD_ABI } from '../components/Contracts/GoatdContract';
import axios from "axios";
import { ethers, Contract } from "ethers";

export default function Mint(
  props,
  id,
  saveImage,
  account,
  txProcessing,
  setTxProcessing,
  ownedCards,
  web3Provider,
) {
  const [isLoading, setIsLoading] = useState(false)
  const spotTraitsContract = "0x9521807adf320d1cdf87afdf875bf438d1d92d87";
  const spotNFTContract = '0x9455aa2aF62B529E49fBFE9D10d67990C0140AFC';

  let userAddress = props.userAddress

  function getImage() {
    return props.saveImage()
  }

  function checkTraits() {
    let isSafeBG = props.solidBG.some(ai => props.chosenTrait.BackgroundID === ai)
    if ((props.walletTraits.includes(String(props.chosenTrait.BackgroundID)) || isSafeBG) && props.walletTraits.includes(String(props.chosenTrait.BodyID)) && props.walletTraits.includes(String(props.chosenTrait.HeadID)) &&
      props.walletTraits.includes(String(props.chosenTrait.MouthID)) && props.walletTraits.includes(String(props.chosenTrait.EyesID)) && (props.walletTraits.includes(String(props.chosenTrait.HeadwearID)) || props.chosenTrait.HeadwearID === '599')) {
      return true;
    } else return false;
  }
  //upload to ipfs via moralis
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

  //Ethers
  async function mint(uri, id) {
    props.setTxProcessing(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (GOATD_ABI && GOATD_ADDRESS && signer) {
          const contract = new Contract(GOATD_ADDRESS, GOATD_ABI, signer);
          let options = {
            value: ethers.utils.parseEther(".3"),
          };
          console.log(id);
          console.log(uri);

          let goatdMint = await contract.mint(props.chosenTrait.BackgroundID, props.chosenTrait.BodyID, props.chosenTrait.HeadID, props.chosenTrait.EyesID, props.chosenTrait.MouthID, props.chosenTrait.HeadwearID, uri, options);
          console.log(goatdMint);
          props.setTxProcessing(false);
          alert(
            "Minted! Check out your Goatd NFT on Campfire, Kalao or Joepegs!"
          );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      props.setTxProcessing(false);
    }
  }

  async function mintMyNFT() {
    if (!checkTraits()) {
      alert("Some of the selected traits are not in your wallet. Ensure all trait-titles are yellow. Click 'My Owned Traits' again to refresh wallet traits.")
    }

    else {
      props.setTxProcessing(true);
      try {
        let signature = await props.web3Provider
          .getSigner()
          .signMessage(
            `Allow The Spot to burn ERC-1155 and create a goatd pfp`
          );
        const base64ImgContents = await props.saveImage();
        let imgResponse = await uploadToMoralis(
          `img.png`,
          base64ImgContents
        );

        let imgURL = imgResponse.data.length > 0 ? imgResponse.data[0].path : "";

        const metadata = {
          name: "Goatd",
          description: "Customizable PFP on Avax",
          image: imgURL,
          edition: id,
          attributes: [
            {
              trait_type: "Background",
              value: props.chosenTrait.Background
            },
            {
              trait_type: "Body",
              value: props.chosenTrait.Body
            },
            {
              trait_type: "Head",
              value: props.chosenTrait.Head
            },
            {
              trait_type: "Eyes",
              value: props.chosenTrait.Eyes
            },
            {
              trait_type: "Mouth",
              value: props.chosenTrait.Mouth
            },
            {
              trait_type: "Headwear",
              value: props.chosenTrait.Headwear
            }
          ],
        };

        let jsonResponse = await uploadToMoralis(`goatd.json`, metadata);

        let jsonURL =
          jsonResponse.data.length > 0 ? jsonResponse.data[0].path : "";

        await mint(jsonURL, id);
      } catch (error) {
        console.log(error);
      } finally {
        props.setTxProcessing(false);
      }
    }
  }

  if (isLoading) {
    return (
      <div><button className="inline-flex m-2 rounded-lg px-4 py-2 border-2 border-spot-yellow text-spot-yellow
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
      <div>
        <button className="m-2 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={mintMyNFT} disabled={props.traitsAvailability === '1'}>Mint (0.3)</button>
      </div>
    );
}