import React, { useEffect, useState } from 'react'
import { useWeb3ExecuteFunction, useMoralisCloudFunction, useMoralis } from "react-moralis";
import { UNNAMEDBRANDING_ABI, UNNAMEDBRANDING_ADDRESS } from './Contracts/UnnamedBrandedContract';
import Moralis from 'moralis';
import unnamedData from '../components/Contracts/UnnamedMetaData';
import { UNNAMED_ABI, UNNAMED_ADDRESS } from './Contracts/UnnamednftContract';
import axios from "axios";
import { ethers, Contract } from "ethers";



export default function UnnamedMint({
    props,
    id,
    saveImage,
    account,
    unnamedEyes,
    unnamedMouth,
    unnamedHat,
    unnamedSkin,
    unnamedNose,
    unnamedSpecial,
    unnamedLines,
    unnamedBrand,
    unnamedBackGround,
    unnamedNFTID,
    canvas,
    savedImage,
    name,
    epitaph,
    txProcessing,
    setTxProcessing,
    ownedCards,
    web3Provider,
}) {
    const isAuthenticated = Boolean(account);
    const [isLoading, setIsLoading] = useState(false)
    const unnamedNFTBrandingContract = "0xB043aaEb4337EA4BbB20C2ec5D846b00a0825ba5"; //unnamedbranding mainnet contract
    const unnamedNFTContract = '0x6BDAd2A83a8e70F459786a96a0a9159574685c0e'; //unnamed mainnet contract
    //const unnamedNFTdata = unnamedData;
    const spotContract = '0x0C6945E825fc3c80F0a1eA1d3E24d6854F7460d8' //thespot mainnet
    const chosenTrait = useState();
    const chosenBrand = useState();
    const contractProcessor = useWeb3ExecuteFunction();
    const [isApproved, setIsApproved] = useState();
    const [ownSpot, setOwnSpot] = useState();
    const [freeMint, setFreeMint] = useState();


    useEffect(() => {
        const getSpots = async () => {
            const options = {
                method: "GET",
                url: `https://deep-index.moralis.io/api/v2/${account}/nft`,
                params: {
                    chain: "avalanche",
                    format: "decimal",
                    token_addresses: "0x0C6945E825fc3c80F0a1eA1d3E24d6854F7460d8",
                },
                headers: {
                    accept: "application/json",
                    "X-API-Key": 'dHttwdzMWC7XigAxZtqBpTet7Lih3MqBRzUAIjXne0TIhJzXG4wrpdDUmXPPQFXo', //process.env.REACT_APP_MORALIS_API_KEY
                },
            };
            try {
                let response = await axios.request(options);
                console.log(response);
                let data = response.data;
                setOwnSpot(data.result.length);
            } catch (error) {
                console.log(error);
            }
        };
        getSpots();
    }, [account]);

    useEffect(() => {
        const free = async () => {
            if (ownSpot > "1") {
                setFreeMint("1")
            }
            else {
                setFreeMint("0")
            }
        };
        free();
    }, [ownSpot])
    console.log(ownSpot);
    console.log(freeMint);



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


    /* async function isApprovedForAll() {
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
 
 
         /*await Moralis.enableWeb3();
         const sendOptions = {
           contractAddress: "0x6BDAd2A83a8e70F459786a96a0a9159574685c0e", //unnamed mainnet
           functionName: "isApprovedForAll",
           abi: unnamedAbi,
       
           params: {
             owner: userAddress,
             operator: "0xB043aaEb4337EA4BbB20C2ec5D846b00a0825ba5",
           },
         };
         await Moralis.executeFunction(sendOptions);
       
         // setIsApproved(true);
     }
     useEffect(() => {
         isApprovedForAll();
     }, []);
 
     console.log(isApproved, userAddress)
 */


    /*function checkApproval() {
      if (isApproved === false) {
        setIsApproved(false);
      }
      else setIsApproved(true)
    }
    */

    async function setApprovalForAll() {
        setTxProcessing(true);
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                if (UNNAMED_ABI && UNNAMED_ADDRESS && signer) {
                    const contract = new Contract(UNNAMED_ADDRESS, UNNAMED_ABI, signer);


                    let tx = await contract.setApprovalForAll("0xB043aaEb4337EA4BbB20C2ec5D846b00a0825ba5", "1");
                    console.log(tx.hash);
                    setTxProcessing(false);
                    alert(
                        "UnnamedNFT Approved for Branding"
                    );
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTxProcessing(false);
        }
    }

    async function mintUnnamedBranding(uri, unnamedNFTID) {
        setTxProcessing(true);
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                if (UNNAMEDBRANDING_ABI && UNNAMEDBRANDING_ADDRESS && signer) {
                    const contract = new Contract(UNNAMEDBRANDING_ADDRESS, UNNAMEDBRANDING_ABI, signer);
                    let options = {
                        value: ethers.utils.parseEther(".2"),
                    };
                    console.log(unnamedNFTID);
                    console.log(uri);

                    let tx = await contract.mint(unnamedNFTID, uri, options);
                    console.log(tx.hash);
                    setTxProcessing(false);
                    alert(
                        "Branded! Check out your NFT on Campfire, Kalao or Joepegs!"
                    );
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTxProcessing(false);
        }
    }

    async function mintUnnamedBrandingFree(uri, unnamedNFTID) {
        setTxProcessing(true);
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                if (UNNAMEDBRANDING_ABI && UNNAMEDBRANDING_ADDRESS && signer) {
                    const contract = new Contract(UNNAMEDBRANDING_ADDRESS, UNNAMEDBRANDING_ABI, signer);
                    let options = {
                        value: ethers.utils.parseEther(".2"),
                    };
                    console.log(unnamedNFTID);
                    console.log(uri);

                    let tx = await contract.mint(unnamedNFTID, uri);
                    console.log(tx.hash);
                    setTxProcessing(false);
                    alert(
                        "Branded! Check out your NFT on Campfire, Kalao or Joepegs!"
                    );
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTxProcessing(false);
        }
    }

    async function brandUnnamedNft() {
        setTxProcessing(true);
        try {
            let signature = await web3Provider
                .getSigner()
                .signMessage(
                    `Allow The Spot to process mint and set token URI setting for token ${unnamedNFTID}`
                );
            const base64ImgContents = await saveImage();
            let imgResponse = await uploadToMoralis(
                `${unnamedNFTID}-img.png`,
                base64ImgContents
            );

            let imgURL = imgResponse.data.length > 0 ? imgResponse.data[0].path : "";


            const metadata = {
                "name": "Branded",
                "description": "Branded UnnamedNFT",
                "image": imgURL,
                "attributes": [
                    {
                        "trait_type": "Eyes:",
                        "value": unnamedEyes
                    },
                    {
                        "trait_type": "Mouth",
                        "value": unnamedMouth
                    },
                    {
                        "trait_type": "Hat",
                        "value": unnamedHat
                    },
                    {
                        "trait_type": "Skin",
                        "value": unnamedSkin
                    },
                    {
                        "trait_type": "Nose",
                        "value": unnamedNose
                    },
                    {
                        "trait_type": "Special",
                        "value": unnamedSpecial
                    },
                    {
                        "trait_type": "Lines",
                        "value": unnamedLines
                    },
                    {
                        "trait_type": "Background:",
                        "value": unnamedBackGround
                    },
                    {
                        "trait_type": "Brand",
                        "value": unnamedBrand
                    },

                ],
            }

            let jsonResponse = await uploadToMoralis(`${unnamedNFTID}-json.json`, metadata);

            let jsonURL =
                jsonResponse.data.length > 0 ? jsonResponse.data[0].path : "";
            if (freeMint == "1") {
                await mintUnnamedBrandingFree(jsonURL, unnamedNFTID);
            }
            else {
                await mintUnnamedBranding(jsonURL, unnamedNFTID);
            }



        } catch (error) {
            console.log(error);
        } finally {
            setTxProcessing(false);
        }
    }



    /* async function spotMintMyNFT() {
 
         setIsLoading(true)
         const base64 = await getImage()
         const imageData = new Moralis.File("img.png", { base64: base64 });
         await imageData.saveIPFS();
         const imgURL = await imageData.ipfs();
         console.log(imgURL)
 
         const metadata = {
             "name": "Branded",
             "description": "Branded UnnamedNFT",
             "image": imgURL,
             "attributes": [
                 {
                     "trait_type": "Eyes:",
                     "value": props.unnamedEyes
                 },
                 {
                     "trait_type": "Mouth",
                     "value": props.unnamedMouth
                 },
                 {
                     "trait_type": "Hat",
                     "value": props.unnamedHat
                 },
                 {
                     "trait_type": "Skin",
                     "value": props.unnamedSkin
                 },
                 {
                     "trait_type": "Nose",
                     "value": props.unnamedNose
                 },
                 {
                     "trait_type": "Special",
                     "value": props.unnamedSpecial
                 },
                 {
                     "trait_type": "Lines",
                     "value": props.unnamedLines
                 },
                 {
                     "trait_type": "Brand",
                     "value": props.unnamedBrand
                 },
 
             ],
         }
         console.log(metadata)
         console.log(props.unnamedBrand)
 
         const metaDataFile = new Moralis.File("file.json", { base64: btoa(JSON.stringify(metadata)) });
         await metaDataFile.saveIPFS();
         const metaDataUrl = await metaDataFile.ipfs();
         console.log(metaDataUrl)
         console.log(props.unnamedID)
         await Moralis.enableWeb3();
         const sendOptions = {
             contractAddress: "0xB043aaEb4337EA4BbB20C2ec5D846b00a0825ba5", //unnamedbranding fuji
             functionName: "mint",
             //   abi: unnamedNFTBrandingAbi,
             msgValue: Moralis.Units.ETH(0),
             params: {
                 unnamedId: props.unnamedID,
                 uri: metaDataUrl,
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
 
     /*useEffect(() => {
       checkApproval();
      
     }, [])
     */
    async function setApproval() {
        await Moralis.enableWeb3();
        const options = {
            contractAddress: "0x6BDAd2A83a8e70F459786a96a0a9159574685c0e", //unnamedNFT mainnet
            functionName: "setApprovalForAll",
            // abi: unnamedAbi,
            params: {
                operator: "0xB043aaEb4337EA4BbB20C2ec5D846b00a0825ba5", //branding mainnet
                approved: "1",
            },
        };
        await contractProcessor.fetch({
            params: options,
        });
        const transaction = await Moralis.executeFunction(options);
        await transaction.wait()
        //  isApprovedForAll();
    }

    if (txProcessing) {
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

            <div className="flex">
                <div className="flex">
                    <button className="m-1 rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={setApprovalForAll}>Approve Unnamed</button>
                </div>
                <div className="flex">
                    <button className="m-1 rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={brandUnnamedNft}>{freeMint ? "Mint (Free)" : "Mint (0.2)"}</button>
                </div>




            </div>


        )
}


{/*
      <div className="flex">
        <div className={isApproved ? "flex" : "hidden"}>
          <button className="m-1 rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={mintMyNFT}>Mint (0.2)</button>

          <button className="m-1 rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={spotMintMyNFT}>Spot Holder Mint (0)</button>
        </div>

        <div className={isApproved ? "hidden" : "flex"}>
          <button className="m-1 w-max rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={setApproval}>Approve</button>
        </div>
    </div>*/}