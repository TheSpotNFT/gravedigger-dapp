import React, { useState, useEffect, useRef, useCallback } from 'react';
import Card from '../Card';
import traits from '../../traits';
import unnamedData from '../../metadata.jsx'
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import Moralis from 'moralis';
import Authenticate from '../Authenticate';
import SetApproval from '../SetApproval';
import Engrave from '../Engrave';
import '../../Board.css'
import nfTombstoneABI from '../../contracts/nfTombstoneABI.json';
import axios from 'axios';
import { ethers, Contract } from "ethers";
import { ENGRAVER_ABI, ENGRAVER_ADDRESS } from "../Contracts/EngraverContract";
import image1 from "../../tombstoneimages/1.png"

export const Ded = ({
    account,
    web3Modal,
    loadWeb3Modal,
    web3Provider,
    setWeb3Provider,
    logoutOfWeb3Modal,
    txProcessing,
    setTxProcessing, }) => {
    const isAuthenticated = Boolean(account);
    const userAddress = account
    const spotTraitsContract = "0x6BDAd2A83a8e70F459786a96a0a9159574685c0e";
    const spotNFTContract = '0x9455aa2aF62B529E49fBFE9D10d67990C0140AFC';
    const [filter, setFilter] = useState('');
    const contractProcessor = useWeb3ExecuteFunction();
    const [activeTombstone, setActiveTombstone] = useState();
    const [graveyardInventory, setGraveyardInventory] = useState();

    async function getActiveTombstone() {
        setTxProcessing(true);
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                if (ENGRAVER_ABI && ENGRAVER_ADDRESS && signer) {
                    const contract = new Contract(ENGRAVER_ADDRESS, ENGRAVER_ABI, signer);

                    let activeTombstoneHex = await contract.addressToTombstone(account);
                    setActiveTombstone(parseInt(activeTombstoneHex, 16));

                    console.log(activeTombstoneHex);

                    setTxProcessing(false);
                    alert(
                        `Active Tombstone ${activeTombstoneHex}`
                    );
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTxProcessing(false);
        }
    }

    useEffect(() => {
        getActiveTombstone()

    }
        , [])

    //need function to set approval to send ded nfts to contract
    async function setApprovalForAll() {
        setTxProcessing(true);
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                if (ENGRAVER_ABI && ENGRAVER_ADDRESS && signer) {
                    const contract = new Contract(ENGRAVER_ADDRESS, ENGRAVER_ABI, signer);

                    let activeTombstoneHex = await contract.setApprovalForAll(account);
                    setActiveTombstone(parseInt(activeTombstoneHex, 16));

                    console.log(activeTombstoneHex);

                    setTxProcessing(false);
                    alert(
                        `Approval to send ded nft to graveyard!`
                    );
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTxProcessing(false);
        }
    }

    useEffect(() => {
        setApprovalForAll()
    }
        , [])

    //need function to send ded nfts
    async function sendDedNft() {
        setTxProcessing(true);
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                if (ENGRAVER_ABI && ENGRAVER_ADDRESS && signer) {
                    const contract = new Contract(ENGRAVER_ADDRESS, ENGRAVER_ABI, signer);

                    let sendNft = await contract.dedOne(contract, "");//need to input selected nft to be sent
                    console.log();

                    setTxProcessing(false);
                    alert(
                        `NFT sent to graveyard!`
                    );
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTxProcessing(false);
        }
    }

    useEffect(() => {
        sendDedNft()
    }
        , [])


    useEffect(() => {
        const getGraveyardNfts = async () => {
            const options = {
                method: "GET",
                url: `https://deep-index.moralis.io/api/v2/0xc5578685415D720BF7d17f2F5F0976d23881C6BF/nft`,
                params: {
                    chain: "avalanche",
                    format: "decimal",
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
                setGraveyardInventory(data.result.map((nft) => nft.token_id));
            } catch (error) {
                console.log(error);
            }
        };
        getGraveyardNfts();
    }, [account]);


    {/* For retrieval of traits */ }
    const [walletTraits, setWalletTraits] = useState([])
    const [apiLoaded, setApiLoaded] = useState(false)
    const [checkMyTraits, setCheckMyTraits] = useState(false)
    const unnamedNFTdata = unnamedData;

    const [chosenTrait, setChosenTrait] = useState({
        TombStone: '1',
        TombStoneID: '1',
        BackGround: '',
        Base: '',
        Behind: '',
        Flair: '',
        Ground: '',
        Top: '',
        Name: '',
        Epitaph: '',
    })

    function createCard(trait) { //Building the card here from Card.jsx passing props and simultaneously fetching traits on click.
        return (

            <div key={trait.edition} onClick={() => {

            }}> <Card
                    nftName={trait.nftName}
                    traitType={trait.traitType}
                    traitName={trait.traitName}
                    image={trait.image}
                    id={trait.id}
                /></div>
        )
    }

    // For Searching traits
    const searchText = (event) => {
        setFilter(event.target.value);
    }


    let dataSearch = traits.filter(item => {
        return Object.keys(item).some(key => item[key].toString().toLowerCase().includes(filter.toString().toLowerCase())
        )
    });
    let ownedFilter = traits.filter(item => {

        if (walletTraits.includes(item.id.toString())) {

            return item
        }

    })

    // Add feature: Filter owned trait cards
    const [ownedCards, setOwnedCards] = useState(false)
    //---------------------------------//

    // Main Component Return
    return (
        <div className='container flex-auto mx-auto w-full'>

            {/* Canvas Row*/}
            <div className="lg:sticky top-20 grid 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4 mt-1 ml-6 sm:p-5 bg-slate-900 lg:pb-3">
                {/* canvas div */}
                <div className="text-white font-mono"><img className="w-2/3" src={image1}></img>{/*Show active tombstone image*/}
                    Active Tombstone</div>
                {/* canvas div ends */}
                {/* Stats div*/}
                <div className='grow border-dashed border-4 border-slate-500 p-3 pl-5 m-1 text-left col-span-1 w-80 md:mt-10 lg:mt-2 mt-10 sm:mt-10 text-sm' style={{ height: "25rem", width: "22rem" }}>
                    {/* Individual Stats */}
                    <div className='font-mono text-white list-none flex pb-3'>
                        <div className="text-red font-bold pr-3 pl-2">Nft Selected (name of collection): </div>

                    </div>


                    <div className='font-mono text-white list-none flex pb-3'>
                        <div className='text-spot-yellow pl-2'>Token Id Selected: </div>

                    </div>
                    {/* End of Indiv Stats */}
                    {/* Buttons */}
                    <div className="pt-1 pb-1 flex">


                        {/* <Mint

                                walletTraits={walletTraits}

                                userAddress={userAddress}



                            /> */}
                    </div>
                    <div className='font-mono text-white list-none flex pb-3 text-sm pl-2 pt-2'>
                        Current Active Tombstone: {activeTombstone}
                    </div>
                    <div className="flex pr-2"> <button className="w-full m-2 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" /*onClick={loadNfts}*/>View My NFTs</button></div> {/* on Click -> load/show users nft cards*/}
                    <div className="flex pr-2"> <button className="w-full m-2 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" /*onClick={approveDedNft}*/>Approve to send selected NFT to the Graveyard</button></div>
                    <div className="flex pr-2"> <button className="w-full m-2 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" /*onClick={sendNft}*/>Send Selected NFT to the Graveyard</button></div> {/*must approve first*/}
                </div>


            </div>{/* Canvas Row Div Ends*/}
            <div className='overflow-y-auto'>
                <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-6 gap-5 font-mono text-spot-yellow">
                    {ownedCards ? ownedFilter.map(createCard) : dataSearch.map(createCard)}
                </div></div>
        </div >

    )

}
export default Ded;
