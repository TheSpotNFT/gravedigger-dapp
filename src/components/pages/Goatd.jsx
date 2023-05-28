import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactGA from 'react-ga';
import Card from '../GoatdCard';
import traits from '../../goatdTraits';
import Mint from '../GoatdMint';
import axios from 'axios';
import { GOATD_ADDRESS, GOATD_ABI } from '../Contracts/GoatdContract';
import { ethers, Contract } from "ethers";
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

ReactGA.initialize('G-YJ9C2P37P6');

export const Goatd = ({
    props,
    account,
    web3Modal,
    loadWeb3Modal,
    web3Provider,
    setWeb3Provider,
    logoutOfWeb3Modal,
    txProcessing,
    setTxProcessing,
}) => {


    useEffect(() => {
        ReactGA.pageview(window.location.pathname + window.location.search);
    }, []);

    const userAddress = account
    const spotTraitsContract = "0x9521807ADF320D1CDF87AFDf875Bf438d1D92d87";
    const spotNFTContract = '0x9455aa2aF62B529E49fBFE9D10d67990C0140AFC';

    const [filter, setFilter] = useState('');
    const onClickUrl = (url) => {
        return () => openInNewTab(url);
    };
    const openInNewTab = (url) => {
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
    };

    {/* For Image retrieval */ }
    const [canvasImage, setCanvasImage] = useState({
        Background: '',
        Body: '',
        Head: '',
        Headwear: '',
        Eyes: '',
        Mouth: ''
    });
    {/* For Traits retrieval */ }
    const [chosenTrait, setChosenTrait] = useState({
        Background: '',
        BackgroundID: '',
        Body: '',
        BodyID: '',
        Head: '',
        HeadID: '',
        Headwear: 'None',
        HeadwearID: '599',
        Eyes: '',
        EyesID: '',
        Mouth: '',
        MouthID: ''
    })

    //Set an array of save background traits which are unburnable and available to all.
    const start = 3;
    const end = 9;
    const solidBG = [...Array(end - start + 1).keys()].map(x => x + start);

    {/* For retrieval of traits */ }
    const [walletTraits, setWalletTraits] = useState([])
    const [apiLoaded, setApiLoaded] = useState(false)
    const [checkMyTraits, setCheckMyTraits] = useState(false)

    //Moralis
    /*function getTraits() {
        const options = { chain: "0xa86a", address: userAddress, token_address: spotTraitsContract };
        Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
            const result = data.result
            setWalletTraits(result.map(nft => nft.token_id))
            setApiLoaded(true)

        });

    }*/

    useEffect(() => {
        const getTraits = async () => {
            const options = {
                method: "GET",
                url: `https://deep-index.moralis.io/api/v2/${account}/nft`,
                params: {
                    chain: "avalanche",
                    format: "decimal",
                    token_addresses: "0x9521807ADF320D1CDF87AFDf875Bf438d1D92d87",
                },
                headers: {
                    accept: "application/json",
                    "X-API-Key": process.env.REACT_APP_MORALIS_API_KEY,
                },
            };
            try {
                let response = await axios.request(options);
                let data = response.data;
                setWalletTraits(data.result.map((nft) => nft.token_id));
            } catch (error) {
                console.log(error);
            }
        };
        getTraits();
    }, [account]);


    function updateCanvasTraits(trait) {
        setCanvasImage(prevImage => ({ ...prevImage, [trait.traitType]: trait.image }))
        setChosenTrait(prevTrait => ({ ...prevTrait, [trait.traitType]: trait.traitName, [trait.traitType + 'ID']: trait.id }))
    }

    function createCard(trait) { //Building the card here from Card.jsx passing props and simultaneously fetching traits on click.
        return (

            <div key={trait.id} onClick={() => {
                updateCanvasTraits(trait)
            }}> <Card
                    traitName={trait.traitName}
                    traitType={trait.traitType}
                    rarity={trait.rarity}
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

        if (walletTraits.includes(item.id.toString()) || solidBG.includes(item.id)) {

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
            ctx.drawImage(img, 0, 0, width, height)
        }

        const imgHidden = new Image();
        imgHidden.src = layer
        imgHidden.onload = () => {
            const ctxHidden = hiddenCanvas.current.getContext("2d")
            ctxHidden.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
            ctxHidden.drawImage(imgHidden, 0, 0, 900, 900)
        }

    }
    useEffect(() => {
        drawImage(canvasImage.Background);
        drawImage(canvasImage.Body);
        drawImage(canvasImage.Head);
        drawImage(canvasImage.Eyes);
        drawImage(canvasImage.Mouth);
        drawImage(canvasImage.Headwear);
    }
        , [canvasImage, canvas, windowWidth, windowHeight])
    const [savedImage, setSavedImage] = useState('empty image') //Saving image for sending to IPFS. This part isn't active yet!
    function saveImage() {
        const result = (new Promise((resolve, reject) => {
            const imageToSave = new Image();
            imageToSave.src = hiddenCanvas.current.toDataURL('image/png', 1.0);
            imageToSave.onload = function () {
                resolve(this.src);
            };
        }));

        return result;
    }

    //Junk attempt to do checkDNA with ethers. Crashes once you select 4 traits.

    const [traitFetch, setTraitFetch] = useState();

    async function checkDNA(currentDNA) {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                if (GOATD_ABI && GOATD_ADDRESS && signer) {
                    const contract = new Contract(GOATD_ADDRESS, GOATD_ABI, signer);

                    let fetch = await contract.checkDNA(currentDNA);

                    return fetch;
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
        }

        return "";
    }

    const [pfpFecth, setPfpFetch] = useState();

    //Calling Traits Contract and PFP Contract using Moralis below.
    const currentDNA =
        "" +
        chosenTrait.BodyID +
        chosenTrait.HeadID +
        chosenTrait.EyesID +
        chosenTrait.MouthID +
        chosenTrait.HeadwearID;

    useEffect(() => {
        const handleDNA = async () => {
            if (currentDNA) {
                let fetch = await checkDNA(currentDNA);
                //console.log("Fetch: " + fetch);
                //let fetchString = fetch.toString();
                if (fetch) {
                    setTraitFetch(fetch);
                    setPfpFetch(fetch);
                    setTraitsAvailability(fetch);
                }
            }
        };

        handleDNA();
    }, [chosenTrait]);

    //Pass current DNA of selected traits in checkDNA function of NFT contract. Set Availability to 0 if available.
    const [traitsAvailability, setTraitsAvailability] = useState('1')
    useEffect(function () {
        if (currentDNA.length > 14) {
            checkDNA()
                .then((data) => setTraitsAvailability(JSON.stringify(data)))
        }
    }, [chosenTrait])

    // Add feature: Filter owned trait cards
    const [ownedCards, setOwnedCards] = useState(false)
    //---------------------------------//

    //Slider
    const slideLeft = () => {
        var slider = document.getElementById('slider')
        slider.scrollLeft = slider.scrollLeft - 900
    }
    const slideRight = () => {
        var slider = document.getElementById('slider')
        slider.scrollLeft = slider.scrollLeft + 900
    }

    // Main Component Return
    return (
        <div className='container flex-auto mx-auto w-full pt-6'>

            {/* Canvas Row*/}
            <div className="xl:sticky top-30 grid 2xl:grid-cols-5 xl:grid-cols-5 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-1 gap-4 mt-1 md:ml-4 sm:ml-0 sm:p-0 sm:pt-0 md:pt-4 lg:pt-10 xl-pt-10 2xl:pt-10 bg-slate-900 lg:pb-3">
                {/* canvas div */}

                <div className="col-span-2 p-1 mb-10 sm:mb-2" ref={div} style={{ height: "22rem", width: "22rem" }}>
                    <canvas
                        ref={canvas}
                        width={width}
                        height={height}
                        className='mt-1 border-1 border-4 border-slate-500 text-center content-center p-5 lg:p-3 xl-p-5 2xl:p-5 md:p-2 sm:p-1'
                    />
                    <div className="text-center md: pl-10"><h1 className='font-mono text-lg text-yellow-400 pt-1 sm:hidden md:block'>Transmorphisizer</h1></div>
                    <canvas
                        ref={hiddenCanvas}
                        width='900px'
                        height='900px'
                        className='hidden' />
                </div>
                {/* canvas div ends */}
                {/* Stats div*/}
                <div className='grow border-dashed border-4 border-slate-500 p-3 m-1 text-left col-span-2 w-96 md:mt-2 lg:mt-1 mt-10 sm:mt-10 text-sm md:block sm:hidden lg:block xl:block 2xl:block'
                    style={{ height: "24rem", width: "22rem" }}>
                    {/* Individual Stats */}
                    <div className='font-mono text-white list-none flex pb-3'>
                        <div className={`text-${(walletTraits.includes(`${chosenTrait.BackgroundID}`)) || (solidBG.some(ai => chosenTrait.BackgroundID === ai)) ? "spot-yellow" : "[red]"} font-bold pr-3`}>Background: </div>
                        {chosenTrait.Background} (ID: {chosenTrait.BackgroundID}) <div className={`${(walletTraits.includes(`${chosenTrait.BackgroundID}`)) || (solidBG.some(ai => chosenTrait.BackgroundID === ai)) || (solidBG.some(ai => chosenTrait.BackgroundID === "")) ? "hidden" : "pl-2 cursor-pointer text-[red] font-bold"}`} onClick={onClickUrl(`https://joepegs.com/item/avalanche/0x9521807adf320d1cdf87afdf875bf438d1d92d87/${chosenTrait.BackgroundID}/`)} > Buy Now!</div>
                    </div>

                    <div className='font-mono text-white list-none flex pb-3'>
                        <div className={`text-${walletTraits.includes(`${chosenTrait.BodyID}`) ? "spot-yellow" : "[red]"} font-bold pr-3`}>Body: </div>
                        {chosenTrait.Body} (ID: {chosenTrait.BodyID})<div className={`${walletTraits.includes(`${chosenTrait.BodyID}`) || chosenTrait.BodyID === "" ? "hidden" : "pl-2 cursor-pointer text-[red] font-bold"}`} onClick={onClickUrl(`https://joepegs.com/item/avalanche/0x9521807adf320d1cdf87afdf875bf438d1d92d87/${chosenTrait.BodyID}/`)} > Buy Now!</div>
                    </div>

                    <div className='font-mono text-white list-none flex pb-3'>
                        <div className={`text-${walletTraits.includes(`${chosenTrait.HeadID}`) ? "spot-yellow" : "[red]"} font-bold pr-3`}>Head: </div>
                        {chosenTrait.Head} (ID: {chosenTrait.HeadID})<div className={`${walletTraits.includes(`${chosenTrait.HeadID}`) || chosenTrait.HeadID === "" ? "hidden" : "pl-2 cursor-pointer text-[red] font-bold"}`} onClick={onClickUrl(`https://joepegs.com/item/avalanche/0x9521807adf320d1cdf87afdf875bf438d1d92d87/${chosenTrait.HeadID}/`)} > Buy Now!</div>
                    </div>

                    <div className='font-mono text-white list-none flex pb-3'>
                        <div className={`text-${walletTraits.includes(`${chosenTrait.EyesID}`) ? "spot-yellow" : "[red]"} font-bold pr-3`}>Eyes: </div>
                        {chosenTrait.Eyes} (ID: {chosenTrait.EyesID})<div className={`${walletTraits.includes(`${chosenTrait.EyesID}`) || chosenTrait.EyesID === "" ? "hidden" : "pl-2 cursor-pointer text-[red] font-bold"}`} onClick={onClickUrl(`https://joepegs.com/item/avalanche/0x9521807adf320d1cdf87afdf875bf438d1d92d87/${chosenTrait.EyesID}/`)} > Buy Now!</div>
                    </div>

                    <div className='font-mono text-white list-none flex pb-3'>
                        <div className={`text-${walletTraits.includes(`${chosenTrait.MouthID}`) ? "spot-yellow" : "[red]"} font-bold pr-3`}>Mouth: </div>
                        {chosenTrait.Mouth} (ID: {chosenTrait.MouthID})<div className={`${walletTraits.includes(`${chosenTrait.MouthID}`) || chosenTrait.MouthID === "" ? "hidden" : "pl-2 cursor-pointer text-[red] font-bold"}`} onClick={onClickUrl(`https://joepegs.com/item/avalanche/0x9521807adf320d1cdf87afdf875bf438d1d92d87/${chosenTrait.MouthID}/`)} > Buy Now!</div>
                    </div>

                    <div className='font-mono text-white list-none flex pb-3'>
                        <div className={`text-${walletTraits.includes(`${chosenTrait.HeadwearID}`) || chosenTrait.HeadwearID === '599' ? "spot-yellow" : "[red]"} font-bold pr-3`}>Headwear: </div>
                        {chosenTrait.Headwear} (ID: {chosenTrait.HeadwearID})<div className={`${walletTraits.includes(`${chosenTrait.HeadwearID}`) || chosenTrait.HeadwearID === '599' ? "hidden" : "pl-2 cursor-pointer text-[red] font-bold"}`} onClick={onClickUrl(`https://joepegs.com/item/avalanche/0x9521807adf320d1cdf87afdf875bf438d1d92d87/${chosenTrait.HeadwearID}/`)} > Buy Now!</div>
                    </div>
                    {/* End of Indiv Stats */}
                    {/* Buttons */}
                    <div className="pt-1 pb-1 flex">

                        <Mint
                            chosenTrait={chosenTrait}
                            walletTraits={walletTraits}
                            saveImage={saveImage}
                            userAddress={userAddress}
                            canvas={chosenTrait}
                            savedImage={savedImage}
                            solidBG={solidBG}
                            traitsAvailability={traitsAvailability}
                            txProcessing={txProcessing}
                            setTxProcessing={setTxProcessing}
                            ownedCards={ownedCards}
                            web3Provider={web3Provider}
                            account={account}
                        />
                        <button className="m-2 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={() => {
                                setCheckMyTraits(!checkMyTraits)
                            }}>My Owned Traits</button>

                    </div>
                    {/* End of Buttons */}
                    {/* Two bottom text lines */}
                    <div className='font-mono text-white list-none flex pb-0 pt-3 text-sm'>
                        <div className='text-spot-yellow font-bold pr-3 text-xl'>* </div>
                        Traits in your wallet:  {apiLoaded, checkMyTraits && walletTraits.length + ' nos.'} {apiLoaded, checkMyTraits && 'IDs: ' + walletTraits.map(trait => ' ' + trait)}
                    </div>
                    <div className='font-mono text-white list-none flex pb-3 text-sm'>
                        <div className='text-[red] pr-3 text-xl'>* </div>
                        Traits not in your wallet.
                    </div>
                    <div className='font-mono text-white list-none flex pb-3 text-sm'><span className={traitsAvailability === '0' ? "text-green-300" : "text-[#fa2121]"}>
                        {traitsAvailability === '0' && currentDNA.length >= 14 ? 'Trait Combo is Unique!' : null}
                        {traitsAvailability === '1' && currentDNA.length >= 14 ? "Trait Combo's Been Minted!" : null}</span>
                    </div> {/* End of btm text lines */}
                </div>{/* Stats div Ends*/}
                {/* SearchBox */}
                <div className="grid grid-rows-1 col-span-1 grid-cols-1 gap-4 pt-10 pl-5 self-end sm:hidden md:block">
                    <div className='col-span-1'><input type="text"
                        className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2" placeholder="search trait/ID..."
                        value={filter}
                        onChange={searchText.bind(this)}
                    /></div>

                    <div className='self-end'>
                        <button className="w-full m-2 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={() => {
                                setOwnedCards(!ownedCards)
                            }}>{!ownedCards ? 'My Traits' : 'All Traits'}</button></div>
                </div>{/* SearchBox Ends */}

            </div>{/* Canvas Row Div Ends*/}
            <div className='flex relative items-center overflow-hidden z-[0]'>
                <MdChevronLeft onClick={slideLeft} size={40} className=' fill-gray-500 hover:scale-110 hover:fill-spot-yellow md:hidden sm:hidden lg:block xl:block 2xl:block' />
                <div id='slider' className="p-10 flex gap-5 xl:flex-row font-mono text-spot-yellow w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide snap-mandatory snap-x">
                    {ownedCards ? ownedFilter.map(createCard) : dataSearch.map(createCard)}
                </div>
                <MdChevronRight onClick={slideRight} size={40} className=' fill-gray-500 hover:scale-110 hover:fill-spot-yellow md:hidden sm:hidden lg:block xl:block 2xl:block' /></div>
            {/* <div className='overflow-y-auto'>
                <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-5 font-mono text-spot-yellow">
                    {ownedCards ? ownedFilter.map(createCard) : dataSearch.map(createCard)}
                </div></div> */}


            {/* SearchBox */}
            <div className="grid grid-rows-1 col-span-1 grid-cols-1 gap-4 pt-0 pl-0 self-end sm:block md:hidden">
                <div className='col-span-1'><input type="text"
                    className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2" placeholder="search trait/ID..."
                    value={filter}
                    onChange={searchText.bind(this)}
                /></div>

                <div className='self-end pt-4'>
                    <button className="w-full pt-1 rounded-lg py-2 border-2 border-gray-200 text-gray-200
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={() => {
                            setOwnedCards(!ownedCards)
                        }}>{!ownedCards ? 'My Traits' : 'All Traits'}</button></div>
            </div>{/* SearchBox Ends */}


            <div className='grow w-full border-dashed border-4 border-slate-500 p-3 m-1 text-left col-span-2 md:mt-2 lg:mt-1 mt-10 sm:mt-10 text-sm md:hidden sm:block'
                style={{ height: "24rem" }}>
                {/* Individual Stats */}
                <div className='font-mono text-white list-none flex pb-3'>
                    <div className={`text-${(walletTraits.includes(`${chosenTrait.BackgroundID}`)) || (solidBG.some(ai => chosenTrait.BackgroundID === ai)) ? "spot-yellow" : "[red]"} font-bold pr-3`}>Background: </div>
                    {chosenTrait.Background} (ID: {chosenTrait.BackgroundID}) <div className={`${(walletTraits.includes(`${chosenTrait.BackgroundID}`)) || (solidBG.some(ai => chosenTrait.BackgroundID === ai)) || (solidBG.some(ai => chosenTrait.BackgroundID === "")) ? "hidden" : "pl-2 cursor-pointer text-[red] font-bold"}`} onClick={onClickUrl(`https://joepegs.com/item/0x9521807adf320d1cdf87afdf875bf438d1d92d87/${chosenTrait.BackgroundID}/`)} > Buy Now!</div>
                </div>

                <div className='font-mono text-white list-none flex pb-3'>
                    <div className={`text-${walletTraits.includes(`${chosenTrait.BodyID}`) ? "spot-yellow" : "[red]"} font-bold pr-3`}>Body: </div>
                    {chosenTrait.Body} (ID: {chosenTrait.BodyID})<div className={`${walletTraits.includes(`${chosenTrait.BodyID}`) || chosenTrait.BodyID === "" ? "hidden" : "pl-2 cursor-pointer text-[red] font-bold"}`} onClick={onClickUrl(`https://joepegs.com/item/0x9521807adf320d1cdf87afdf875bf438d1d92d87/${chosenTrait.BodyID}/`)} > Buy Now!</div>
                </div>

                <div className='font-mono text-white list-none flex pb-3'>
                    <div className={`text-${walletTraits.includes(`${chosenTrait.HeadID}`) ? "spot-yellow" : "[red]"} font-bold pr-3`}>Head: </div>
                    {chosenTrait.Head} (ID: {chosenTrait.HeadID})<div className={`${walletTraits.includes(`${chosenTrait.HeadID}`) || chosenTrait.HeadID === "" ? "hidden" : "pl-2 cursor-pointer text-[red] font-bold"}`} onClick={onClickUrl(`https://joepegs.com/item/0x9521807adf320d1cdf87afdf875bf438d1d92d87/${chosenTrait.HeadID}/`)} > Buy Now!</div>
                </div>

                <div className='font-mono text-white list-none flex pb-3'>
                    <div className={`text-${walletTraits.includes(`${chosenTrait.EyesID}`) ? "spot-yellow" : "[red]"} font-bold pr-3`}>Eyes: </div>
                    {chosenTrait.Eyes} (ID: {chosenTrait.EyesID})<div className={`${walletTraits.includes(`${chosenTrait.EyesID}`) || chosenTrait.EyesID === "" ? "hidden" : "pl-2 cursor-pointer text-[red] font-bold"}`} onClick={onClickUrl(`https://joepegs.com/item/0x9521807adf320d1cdf87afdf875bf438d1d92d87/${chosenTrait.EyesID}/`)} > Buy Now!</div>
                </div>

                <div className='font-mono text-white list-none flex pb-3'>
                    <div className={`text-${walletTraits.includes(`${chosenTrait.MouthID}`) ? "spot-yellow" : "[red]"} font-bold pr-3`}>Mouth: </div>
                    {chosenTrait.Mouth} (ID: {chosenTrait.MouthID})<div className={`${walletTraits.includes(`${chosenTrait.MouthID}`) || chosenTrait.MouthID === "" ? "hidden" : "pl-2 cursor-pointer text-[red] font-bold"}`} onClick={onClickUrl(`https://joepegs.com/item/0x9521807adf320d1cdf87afdf875bf438d1d92d87/${chosenTrait.MouthID}/`)} > Buy Now!</div>
                </div>

                <div className='font-mono text-white list-none flex pb-3'>
                    <div className={`text-${walletTraits.includes(`${chosenTrait.HeadwearID}`) || chosenTrait.HeadwearID === '599' ? "spot-yellow" : "[red]"} font-bold pr-3`}>Headwear: </div>
                    {chosenTrait.Headwear} (ID: {chosenTrait.HeadwearID})<div className={`${walletTraits.includes(`${chosenTrait.HeadwearID}`) || chosenTrait.HeadwearID === '599' ? "hidden" : "pl-2 cursor-pointer text-[red] font-bold"}`} onClick={onClickUrl(`https://joepegs.com/item/0x9521807adf320d1cdf87afdf875bf438d1d92d87/${chosenTrait.HeadwearID}/`)} > Buy Now!</div>
                </div>
                {/* End of Indiv Stats */}
                {/* Buttons */}
                <div className="pt-1 pb-1 flex">

                    <Mint
                        chosenTrait={chosenTrait}
                        walletTraits={walletTraits}
                        saveImage={saveImage}
                        userAddress={userAddress}
                        canvas={chosenTrait}
                        savedImage={savedImage}
                        solidBG={solidBG}
                        traitsAvailability={traitsAvailability}
                        txProcessing={txProcessing}
                        setTxProcessing={setTxProcessing}
                        ownedCards={ownedCards}
                        web3Provider={web3Provider}
                        account={account}
                    />
                    <button className="m-2 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={() => {
                            setCheckMyTraits(!checkMyTraits)
                        }}>My Owned Traits</button>

                </div>
                {/* End of Buttons */}
                {/* Two bottom text lines */}
                <div className='font-mono text-white list-none flex pb-0 pt-3 text-sm'>
                    <div className='text-spot-yellow font-bold pr-3 text-xl'>* </div>
                    Traits in your wallet:  {apiLoaded, checkMyTraits && walletTraits.length + ' nos.'} {apiLoaded, checkMyTraits && 'IDs: ' + walletTraits.map(trait => ' ' + trait)}
                </div>
                <div className='font-mono text-white list-none flex pb-3 text-sm'>
                    <div className='text-[red] pr-3 text-xl'>* </div>
                    Traits not in your wallet.
                </div>
                <div className='font-mono text-white list-none flex pb-3 text-sm'><span className={traitsAvailability === '0' ? "text-green-300" : "text-[#fa2121]"}>
                    {traitsAvailability === '0' && currentDNA.length >= 14 ? 'Trait Combo is Unique!' : null}
                    {traitsAvailability === '1' && currentDNA.length >= 14 ? "Trait Combo's Been Minted!" : null}</span>
                </div> {/* End of btm text lines */}
            </div>

        </div>
    )
}
