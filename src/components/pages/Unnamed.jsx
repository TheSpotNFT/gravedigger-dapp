import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactGA from 'react-ga';
import { ethers, Contract } from "ethers";
import Card from '../UnnamedCard';
import unnamedCards from '../../unnamedCardData';//changed from traits
import unnamedData from '../Contracts/UnnamedMetaData'
import Authenticate from '../Authenticate';
import spotNFTAbi from '../../contracts/spotNFTAbi.json';
import spotTraitsAbi from '../../contracts/spotTraitsAbi.json';
import SetApproval from '../SetApproval';
import UnnamedMint from '../UnnamedMint';
import axios from "axios";
import { UNNAMED_ABI, UNNAMED_ADDRESS } from '../Contracts/UnnamednftContract';
import { UNNAMEDBRANDING_ABI, UNNAMEDBRANDING_ADDRESS } from '../Contracts/UnnamedBrandedContract';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { useAuth } from '../../Auth';
import { UNNAMED404_ABI, UNNAMED404_ADDRESS } from '../Contracts/Unnamed404Contract';

ReactGA.initialize('G-YJ9C2P37P6');

export const Unnamed = ({

    txProcessing,
    setTxProcessing,
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
    const [selectedNFTs, setSelectedNFTs] = useState([]);
    const isAuthenticated = Boolean(account);
    const unnamedNFTContract = "0x6bdad2a83a8e70f459786a96a0a9159574685c0e";
    const spotNFTContract = '0x0C6945E825fc3c80F0a1eA1d3E24d6854F7460d8';
    const [filter, setFilter] = useState('');
    const [showButton, setShowButton] = useState(false);
    const toggleSelectNFT = (id) => {
        setSelectedNFTs(prevSelected => {
            const isSelected = prevSelected.includes(id);
            if (isSelected) {
                return prevSelected.filter(item => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.pageYOffset > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        });
    }, []);

    //Slider
    const slideLeft = () => {
        var slider = document.getElementById('slider')
        slider.scrollLeft = slider.scrollLeft - 900
    }
    const slideRight = () => {
        var slider = document.getElementById('slider')
        slider.scrollLeft = slider.scrollLeft + 900
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // for smoothly scrolling
        });
    };
    //For Metadata
    const [unnamedBackGround, setUnnamedBackGround] = useState();
    const [unnamedEyes, setUnnamedEyes] = useState();
    const [unnamedMouth, setUnnamedMouth] = useState();
    const [unnamedHat, setUnnamedHat] = useState();
    const [unnamedSkin, setUnnamedSkin] = useState();
    const [unnamedNose, setUnnamedNose] = useState();
    const [unnamedSpecial, setUnnamedSpecial] = useState();
    const [unnamedLines, setUnnamedLines] = useState();
    const [unnamedBrand, setUnnamedBrand] = useState();
    const [unnamedID, setUnnamedID] = useState();


    {/* For Image retrieval */ }
    const [canvasImage, setCanvasImage] = useState({
        UnnamedNFT: '',
        Branding: '',
    });
    {/* For Traits retrieval */ }
    const [chosenTrait, setChosenTrait] = useState({
        UnnamedNFT: '',
        UnnamedNFTID: '1',
        Eyes: '',
        Mouth: '',
        Hat: '',
        Skin: '',
        Nose: '',
        Special: '',
        Lines: '',

    })

    const [chosenBrand, setChosenBrand] = useState({
        Branding: '',
        BrandingID: ''
    })


    //Set an array of save UnnamedNFT traits which are unburnable and available to all.
    const start = 3001;
    const end = 3099;
    const branding = [...Array(end - start + 1).keys()].map(x => x + start);

    {/* For retrieval of traits */ }
    const [walletTraits, setWalletTraits] = useState([])
    const [apiLoaded, setApiLoaded] = useState(false)
    const [checkMyTraits, setCheckMyTraits] = useState(false)
    const unnamedNFTdata = unnamedData;
    //mainnet chain 0xa86a
    //testnet chain 0xa869


    useEffect(() => {
        updateTraitMetaData();
    }, [chosenTrait])


    async function updateCanvasTraits(unnamedCards) {
        setCanvasImage(prevImage => ({ ...prevImage, [unnamedCards.traitType]: unnamedCards.image }))
        setChosenTrait(prevTrait => ({ ...prevTrait, [unnamedCards.traitType]: unnamedCards.traitName, [unnamedCards.traitType + 'ID']: unnamedCards.id }))
        setChosenBrand(prevBrand => ({ ...prevBrand, [unnamedCards.traitType]: unnamedCards.brand }))


    }

    function updateTraitMetaData() {
        setUnnamedBackGround(unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[0].value);
        setUnnamedEyes(unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[1].value);
        setUnnamedMouth(unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[2].value);
        setUnnamedHat(unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[3].value);
        setUnnamedSkin(unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[4].value);
        setUnnamedNose(unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[5].value);
        setUnnamedSpecial(unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[6].value);
        setUnnamedLines(unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[7].value);
        setUnnamedBrand(chosenBrand.Branding);
        setUnnamedID(chosenTrait.UnnamedNFTID)
    }

    async function approve() {
        setTxProcessing(true);
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                if (UNNAMED_ABI && UNNAMED_ADDRESS && signer) {
                    const contract = new Contract(UNNAMED_ADDRESS, UNNAMED_ABI, signer);


                    let tx = await contract.setApprovalForAll("0x39b0aC0d6C3BafAb706f314fc545Da77762fC5E3", "1");
                    console.log(tx.hash);
                    setTxProcessing(false);
                    alert(
                        "Your Unnamed is Approved for Wrapping"
                    );
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTxProcessing(false);
        }
    }

    async function wrapTo404() {
        setTxProcessing(true);
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                if (UNNAMED404_ABI && UNNAMED404_ADDRESS && signer) {
                    const contract = new ethers.Contract(UNNAMED404_ADDRESS, UNNAMED404_ABI, signer);

                    // Convert the input string to an array of numbers
                    console.log(selectedNFTs);
                    const inputArray = selectedNFTs;

                    // Call the smart contract function with the array
                    let tx = await contract.wrapSet(inputArray);
                    console.log(tx.hash);
                    setTxProcessing(false);
                    alert("Wrapped it up!");
                }
            }
        } catch (error) {
            console.log(error);
            alert("An error occurred. See the console for details.");
        } finally {
            setTxProcessing(false);
        }
    }

    /*useEffect(() => {
        const approved = async () => {
            const options = {
                method: "POST",
                url: `https://deep-index.moralis.io/api/v2/${account}/function`,
                params: {
                    chain: "avalanche",
                    function_name: "isApprovedForAll",
                    owner: account,
                    operator: "0xB043aaEb4337EA4BbB20C2ec5D846b00a0825ba5",
                    abi: UNNAMEDBRANDING_ABI
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
                setIsApproved(data.result.length);
                console.log("Approved? " + isApproved);
            } catch (error) {
                console.log(error);
            }
        };
        approved();
    }, [account]);
*/


    useEffect(() => {
        const getTraits = async () => {
            const options = {
                method: "GET",
                url: `https://deep-index.moralis.io/api/v2/${account}/nft`,
                params: {
                    chain: "avalanche",
                    format: "decimal",
                    token_addresses: UNNAMED_ADDRESS,
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
                setWalletTraits(data.result.map((nft) => nft.token_id));
            } catch (error) {
                console.log(error);
            }
        };
        getTraits();
    }, [account]);

    function createCard(unnamedCards) {
        const isSelected = selectedNFTs.includes(unnamedCards.id);
        return (
            <div key={unnamedCards.edition} onClick={() => updateCanvasTraits(unnamedCards)} style={{ border: isSelected ? '2px solid yellow' : '' }}>
                <Card
                    nftName={unnamedCards.nftName}
                    traitType={unnamedCards.traitType}
                    traitName={unnamedCards.traitName}
                    image={unnamedCards.image}
                    id={unnamedCards.id}
                    brand={unnamedCards.brand}
                />
                {unnamedCards.id <= 3000 && (
                    <button onClick={(e) => {
                        e.stopPropagation(); // Prevent card click event
                        toggleSelectNFT(unnamedCards.id);
                    }}>Bulk Select</button>
                )}
            </div>
        );
    }


    // For Searching traits
    const searchText = (event) => {
        setFilter(event.target.value);
    }
    let dataSearch = unnamedCards.filter(item => {
        return Object.keys(item).some(key => item[key].toString().toLowerCase().includes(filter.toString().toLowerCase())
        )
    });
    let ownedFilter = unnamedCards.filter(item => {

        if (walletTraits.includes(item.id.toString()) || branding.includes(item.id)) {

            return item
        }

    })

    // Putting stuff on Canvas
    const canvas = useRef(null)
    const hiddenCanvas = useRef(null)
    const [height, setHeight] = useState(null);
    const [width, setWidth] = useState(null);
    const { windowWidth } = useState(window.innerWidth)
    const { windowHeight } = useState(window.innerHeight)

    const div = useCallback(node => {

        if (node !== null) {

            setHeight(node.getBoundingClientRect().height); //set height and width of canvas relative to parent div.
            setWidth(node.getBoundingClientRect().width);
        }
    }, [windowWidth, windowHeight]);

    function drawImage(layer) {
        const img = new Image();
        //img.setAttribute('crossOrigin', '*');
        img.src = layer
        img.onload = () => {
            const ctx = canvas.current.getContext("2d")
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, width, height);
        }

        const imgHidden = new Image();
        imgHidden.src = layer
        imgHidden.onload = () => {
            const ctxHidden = hiddenCanvas.current.getContext("2d")
            ctxHidden.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
            ctxHidden.drawImage(imgHidden, 0, 0, 512, 512);
        }

    }




    useEffect(() => {
        drawImage(canvasImage.UnnamedNFT);
        drawImage(canvasImage.Branding);


    }
        , [canvasImage, canvas, windowWidth, windowHeight])
    const [savedImage, setSavedImage] = useState('empty image')

    function saveImage() {
        const result = new Promise((resolve, reject) => {
            const imageToSave = new Image();
            imageToSave.src = hiddenCanvas.current.toDataURL('image/png', 1.0);
            imageToSave.onload = function () {
                resolve(this.src);
            };
        });

        return result;
    }




    // Add feature: Filter owned trait cards
    const [ownedCards, setOwnedCards] = useState(true)
    //---------------------------------//

    //filtering

    // Main Component Return
    return (
        <div className='container flex-auto mx-auto w-full'>

            {/* Canvas Row*/}
            <div className="top-20 grid 2xl:grid-cols-5 xl:grid-cols-5 lg:grid-cols-5 md:grid-cols-1 sm:grid-cols-1 gap-4 mt-5 ml-6 sm:p-5 bg-slate-900 lg:pb-3">
                {/* canvas div */}

                <div className="p-1 mb-10 sm:mb-10 lg:col-start-2" ref={div} style={{ height: "23rem", width: "23rem" }}>
                    <canvas
                        ref={canvas}
                        width={width}
                        height={height}
                        className='mt-1 border-1 border-4 border-slate-500 text-center content-center p-5'
                    />
                    <div className="text-center md:pl-10"><h1 className='font-mono text-lg text-yellow-400 pt-1'>Branding</h1></div>
                    <canvas
                        ref={hiddenCanvas}
                        width='512px'
                        height='512px'
                        className='hidden' />
                </div>
                {/* canvas div ends */}
                {/* Stats div*/}
                <div className='sm:hidden md:hidden lg:block lg:col-start-4 grow border-dashed border-4 border-slate-500 p-3 pl-5 m-1 text-left w-80 md:mt-10 lg:mt-2 mt-10 sm:mt-10 text-sm' style={{ height: "28rem", width: "23rem" }}>
                    {/* Individual Stats */}
                    <div className='font-mono text-white list-none flex'>
                        <div className={`text-${(walletTraits.includes(`${chosenTrait.UnnamedNFTID}`)) ? "spot-yellow" : "[red]"} font-bold pr-3 pl-2`}>UnnamedNFT: </div>
                        {chosenTrait.UnnamedNFTID}
                    </div>

                    <div className="text-spot-yellow flex pl-2">BackGround: <div className='text-white flex px-2'>{unnamedBackGround}</div></div>
                    <div className="text-spot-yellow flex pl-2">Eyes: <div className='text-white flex px-2'>{unnamedEyes}</div></div>
                    <div className="text-spot-yellow flex pl-2">Mouth: <div className='text-white flex px-2'>{unnamedMouth}</div></div>
                    <div className="text-spot-yellow flex pl-2">Hat: <div className='text-white flex px-2'>{unnamedHat}</div></div>
                    <div className="text-spot-yellow flex pl-2">Skin: <div className='text-white flex px-2'>{unnamedSkin}</div></div>
                    <div className="text-spot-yellow flex pl-2">Nose: <div className='text-white flex px-2'>{unnamedNose}</div></div>
                    <div className="text-spot-yellow flex pl-2">Special: <div className='text-white flex px-2'>{unnamedSpecial}</div></div>
                    <div className="text-spot-yellow flex pl-2">Lines: <div className='text-white flex px-2'>{unnamedLines}</div></div>
                    <div className="text-spot-yellow flex pl-2">Brand: <div className='text-white flex px-2'>{chosenBrand.Branding}</div></div>
                    {/* End of Indiv Stats */}
                    {/* Buttons */}
                    <div className="pt-1 pb-1 pr-2 pl-1 flex">

                        <UnnamedMint
                            chosenTrait={chosenTrait}
                            walletTraits={walletTraits}
                            unnamedBackGround={unnamedBackGround}
                            unnamedBrand={unnamedBrand}
                            unnamedEyes={unnamedEyes}
                            unnamedMouth={unnamedMouth}
                            unnamedHat={unnamedHat}
                            unnamedSkin={unnamedSkin}
                            unnamedNose={unnamedNose}
                            unnamedSpecial={unnamedSpecial}
                            unnamedLines={unnamedLines}
                            unnamedNFTID={chosenTrait.UnnamedNFTID}
                            saveImage={saveImage}
                            //userAddress={userAddress}
                            canvas={chosenTrait}
                            savedImage={savedImage}
                            txProcessing={txProcessing}
                            setTxProcessing={setTxProcessing}
                            ownedCards={ownedCards}
                            web3Provider={web3Provider}
                            account={account}
                        // branding={branding}
                        // traitsAvailability={traitsAvailability}
                        />


                    </div>
                    {/* End of Buttons */}
                    {/* Two bottom text lines */}

                    {/*check this*/}

                    {/*  <div className='font-mono text-white list-none flex pb-0 pt-3 text-sm'>
                            <div className='text-spot-yellow font-bold pr-3 text-xl'>* </div>
                            Traits in your wallet:  {apiLoaded, checkMyTraits && walletTraits.length + ' nos.'} {apiLoaded, checkMyTraits && 'IDs: ' + walletTraits.map(trait => ' ' + trait)}
                        </div>*/}
                    <div className='font-mono text-white list-none flex text-sm pl-2'>
                        You must approve your unnamedNFT to be burnt before minting
                        <div className='text-[red] pr-3 text-xl'>* </div>
                        UnnamedNFT not in your wallet.
                    </div>
                    <div className="flex pr-2 pl-2 pt-2 pb-4"> <button className="w-full rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={() => {
                            setOwnedCards(!ownedCards)
                        }}>{!ownedCards ? 'My UnnamedNFTs' : 'View All UnnamedNFTs'}</button></div>
                    <button
                        className="ml-4 rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200 hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base"
                        onClick={approve}
                    >
                        Approve to Wrap
                    </button>
                    <button
                        className="ml-4 rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200 hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base"
                        onClick={wrapTo404}
                    >
                        Wrap to 404
                    </button>

                    {/*<div className='font-mono text-white list-none flex pb-3 text-sm'><span className={traitsAvailability === '0' ? "text-green-300" : "text-[#fa2121]"}>
                            {traitsAvailability === '0' && currentDNA.length >= 14 ? 'Trait Combo is Unique!' : null}
                            {traitsAvailability === '1' && currentDNA.length >= 14 ? "Trait Combo's Been Minted!" : null}</span>
                        </div>*/} {/* End of btm text lines */}
                </div>{/* Stats div Ends*/}
                {/* SearchBox
                <div className="gap-4 pt-4 pl-2">



                    <div className='col-span-1'><input type="text"
                        className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2" placeholder="search trait/ID..."
                        value={filter}
                        onChange={searchText.bind(this)}
                    /></div>



                </div>SearchBox Ends */}




            </div>{/* Canvas Row Div Ends*/}
            <div className='flex items-center overflow-hidden'>
                <MdChevronLeft onClick={slideLeft} size={40} className=' fill-gray-500 hover:scale-110 hover:fill-spot-yellow md:hidden sm:hidden lg:block xl:block 2xl:block' />
                <div id='slider' className="pt-10 pb-1 flex gap-5 xl:flex-row font-mono text-spot-yellow w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide snap-mandatory snap-x">
                    {ownedCards ? ownedFilter.map(createCard) : dataSearch.map(createCard)}
                </div>
                <MdChevronRight onClick={slideRight} size={40} className=' fill-gray-500 hover:scale-110 hover:fill-spot-yellow md:hidden sm:hidden lg:block xl:block 2xl:block' /></div>

            <div className='lg:hidden md:block sm:block lg:col-start-4 grow border-dashed border-4 border-slate-500 p-3 pl-5 m-1 text-left w-80 md:mt-10 lg:mt-2 mt-10 sm:mt-10 text-sm' style={{ height: "28rem", width: "23rem" }}>
                {/* Individual Stats */}
                <div className='font-mono text-white list-none flex'>
                    <div className={`text-${(walletTraits.includes(`${chosenTrait.UnnamedNFTID}`)) ? "spot-yellow" : "[red]"} font-bold pr-3 pl-2`}>UnnamedNFT: </div>
                    {chosenTrait.UnnamedNFTID}
                </div>

                <div className="text-spot-yellow flex pl-2">BackGround: <div className='text-white flex px-2'>{unnamedBackGround}</div></div>
                <div className="text-spot-yellow flex pl-2">Eyes: <div className='text-white flex px-2'>{unnamedEyes}</div></div>
                <div className="text-spot-yellow flex pl-2">Mouth: <div className='text-white flex px-2'>{unnamedMouth}</div></div>
                <div className="text-spot-yellow flex pl-2">Hat: <div className='text-white flex px-2'>{unnamedHat}</div></div>
                <div className="text-spot-yellow flex pl-2">Skin: <div className='text-white flex px-2'>{unnamedSkin}</div></div>
                <div className="text-spot-yellow flex pl-2">Nose: <div className='text-white flex px-2'>{unnamedNose}</div></div>
                <div className="text-spot-yellow flex pl-2">Special: <div className='text-white flex px-2'>{unnamedSpecial}</div></div>
                <div className="text-spot-yellow flex pl-2">Lines: <div className='text-white flex px-2'>{unnamedLines}</div></div>
                <div className="text-spot-yellow flex pl-2">Brand: <div className='text-white flex px-2'>{chosenBrand.Branding}</div></div>
                {/* End of Indiv Stats */}
                {/* Buttons */}
                <div className="pt-1 pb-1 pr-2 pl-1 flex">

                    <UnnamedMint
                        chosenTrait={chosenTrait}
                        walletTraits={walletTraits}
                        unnamedBackGround={unnamedBackGround}
                        unnamedBrand={unnamedBrand}
                        unnamedEyes={unnamedEyes}
                        unnamedMouth={unnamedMouth}
                        unnamedHat={unnamedHat}
                        unnamedSkin={unnamedSkin}
                        unnamedNose={unnamedNose}
                        unnamedSpecial={unnamedSpecial}
                        unnamedLines={unnamedLines}
                        unnamedNFTID={chosenTrait.UnnamedNFTID}
                        saveImage={saveImage}
                        //userAddress={userAddress}
                        canvas={chosenTrait}
                        savedImage={savedImage}
                        txProcessing={txProcessing}
                        setTxProcessing={setTxProcessing}
                        ownedCards={ownedCards}
                        web3Provider={web3Provider}
                        account={account}
                    // branding={branding}
                    // traitsAvailability={traitsAvailability}
                    />


                </div>
                {/* End of Buttons */}
                {/* Two bottom text lines */}

                {/*check this*/}

                {/*  <div className='font-mono text-white list-none flex pb-0 pt-3 text-sm'>
                            <div className='text-spot-yellow font-bold pr-3 text-xl'>* </div>
                            Traits in your wallet:  {apiLoaded, checkMyTraits && walletTraits.length + ' nos.'} {apiLoaded, checkMyTraits && 'IDs: ' + walletTraits.map(trait => ' ' + trait)}
                        </div>*/}
                <div className='font-mono text-white list-none flex text-sm pl-2'>
                    You must approve your unnamedNFT to be burnt before minting
                    <div className='text-[red] pr-3 text-xl'>* </div>
                    UnnamedNFT not in your wallet.
                </div>
                <div className="flex pr-2 pl-2 pt-2 pb-4"> <button className="w-full rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={() => {
                        setOwnedCards(!ownedCards)
                    }}>{!ownedCards ? 'My UnnamedNFTs' : 'View All UnnamedNFTs'}</button></div>
                <button
                    className="ml-4 rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200 hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base"
                    onClick={approve}
                >
                    Approve to Wrap
                </button>
                <button
                    className="ml-4 rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200 hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base"
                    onClick={wrapTo404}
                >
                    Wrap to 404
                </button>

                {/*<div className='font-mono text-white list-none flex pb-3 text-sm'><span className={traitsAvailability === '0' ? "text-green-300" : "text-[#fa2121]"}>
                            {traitsAvailability === '0' && currentDNA.length >= 14 ? 'Trait Combo is Unique!' : null}
                            {traitsAvailability === '1' && currentDNA.length >= 14 ? "Trait Combo's Been Minted!" : null}</span>
                        </div>*/} {/* End of btm text lines */}
            </div>
            {/*} <div className="text-white">BackGround: {unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[0].value}</div>
                <div className="text-white">Eyes: {unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[1].value}</div>
                <div className="text-white">Mouth: {unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[2].value}</div>
                <div className="text-white">Hat: {unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[3].value}</div>
                <div className="text-white">Skin: {unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[4].value}</div>
                <div className="text-white">Nose: {unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[5].value}</div>
                <div className="text-white">Special: {unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[6].value}</div>
                <div className="text-white">Lines: {unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[7].value}</div>

                            */}
        </div>

    )

}
/*


let ownedFilter = traits.filter(item => {

        if (walletTraits.includes(item.id.toString()) || branding.includes(item.id)) {

            return item
        }

    })
    */