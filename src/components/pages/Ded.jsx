import React, { useState, useEffect, useRef, useCallback } from 'react';
import Card from '../Card';
import traits from '../../tombstoneTraits';
import unnamedData from '../../metadata.jsx'
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import Moralis from 'moralis';
import Authenticate from '../Authenticate';
import SetApproval from '../SetApproval';
import Engrave from '../Engrave';
import '../../Board.css'
import nfTombstoneABI from '../../contracts/nfTombstoneABI.json';
import axios from 'axios';

export const Ded = ({ account }) => {
    const isAuthenticated = Boolean(account);
    const userAddress = account
    const spotTraitsContract = "0x6BDAd2A83a8e70F459786a96a0a9159574685c0e";
    const spotNFTContract = '0x9455aa2aF62B529E49fBFE9D10d67990C0140AFC';
    const [filter, setFilter] = useState('');
    const contractProcessor = useWeb3ExecuteFunction();

    function fetchUsersNfts() {
        const options = {
            method: 'GET',
            url: `https://deep-index.moralis.io/api/v2/${userAddress}/nft`,
            params: { chain: 'avalanche', format: 'decimal' },
            headers: { accept: 'application/json', 'X-API-Key': 'test' }
        };

        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                console.log(response.data.result[10].metadata['image']);

            })
            .catch(function (error) {
                console.error(error);
            });
    }

    useEffect(() => {
        fetchUsersNfts()

    }
        , [])


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

    function getNFTsAddress() {
        const options = { chain: "0xa86a", address: userAddress, token_address: spotTraitsContract };
        Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
            const result = data.result
            setWalletTraits(result.map(nft => nft.token_id))
            setApiLoaded(true)
        });
    }


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


    if (!isAuthenticated) {
        return (
            <Authenticate />
        );
    } else
        // Main Component Return
        return (
            <div className='container flex-auto mx-auto w-full'>

                {/* Canvas Row*/}
                <div className="lg:sticky top-20 grid 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4 mt-1 ml-6 sm:p-5 bg-slate-900 lg:pb-3">
                    {/* canvas div */}
                    <img className="w-full" src="../../tombstoneimages/1.png"></img>

                    {/* canvas div ends */}
                    {/* Stats div*/}
                    <div className='grow border-dashed border-4 border-slate-500 p-3 pl-5 m-1 text-left col-span-1 w-80 md:mt-10 lg:mt-2 mt-10 sm:mt-10 text-sm' style={{ height: "25rem", width: "22rem" }}>
                        {/* Individual Stats */}
                        <div className='font-mono text-white list-none flex pb-3'>
                            <div className="text-red font-bold pr-3 pl-2">TombStone: </div>

                        </div>


                        <div className='font-mono text-white list-none flex pb-3'>
                            <div className='text-spot-yellow pl-2'>Name: </div>

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
                            <div className='text-[red] pr-2 text-xl'>* </div>
                            TombStone not in your wallet.
                        </div>
                        <div className="flex pr-2"> <button className="w-full m-2 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={() => {
                                setOwnedCards(!ownedCards)
                            }}>{!ownedCards ? 'My TombStones' : 'View All TombStones'}</button></div>
                        <div className="flex pr-2"> <button className="w-full m-2 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base">Activate Tombstone {chosenTrait.TombStoneID}</button></div>
                        <div className='font-mono text-white list-none flex pb-3 text-sm pt-2'>

                            Activate your tombstone to send ded nfts to it. You may only have 1 tombstone activate at a time.
                        </div>
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
