import React, { useState, useEffect, useRef, useCallback } from 'react';
import Select from 'react-select';
import Card from '../Card';
import traits from '../../traits';
import nftombstoneData from '../../contracts/nftombstoneMetadata.json'
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import Moralis from 'moralis';
import Authenticate from '../Authenticate';
import spotNFTAbi from '../../contracts/spotNFTAbi.json';
import spotTraitsAbi from '../../contracts/spotTraitsAbi.json';
import SetApproval from '../SetApproval';
import Mint from '../Mint';
import '../../Board.css'
import nfTombstoneABI from '../../contracts/nfTombstoneABI.json';
import axios from 'axios';

export const Board = () => {
    const { account, isAuthenticated } = useMoralis();
    const userAddress = account
    const nfTombstoneContract = "0xe3525413c2a15daec57C92234361934f510356b8"; //change to mainnet address
    const spotNFTContract = '0x9455aa2aF62B529E49fBFE9D10d67990C0140AFC';
    const [filter, setFilter] = useState('');
    const [savedImage, setSavedImage] = useState('empty image') //Saving image for sending to IPFS. This part isn't active yet!
    const contractProcessor = useWeb3ExecuteFunction();
    const nfTombstoneMetaData = nftombstoneData;

    //for text on canvas
    const [textinput, setTextinput] = useState('Gravedigger');
    const [xInput, setXInput] = useState('160');
    const [yInput, setYInput] = useState('260');
    const [fontSize, setFontSize] = useState('30');
    const [xInputX2, setXInputX2] = useState('163');
    const [yInputX2, setYInputX2] = useState('260');
    const [fontSizeX2, setFontSizeX2] = useState('30');
    const [font, setFont] = useState('Gala');
    const [fontStyle, setFontStyle] = useState('normal');

    const [textinputText, setTextinputText] = useState('A Spot');
    const [xInputText, setXInputText] = useState('198');
    const [yInputText, setYInputText] = useState('287');
    const [fontSizeText, setFontSizeText] = useState('15');
    const [xInputTextX2, setXInputTextX2] = useState('201');
    const [yInputTextX2, setYInputTextX2] = useState('287');
    const [fontSizeTextX2, setFontSizeTextX2] = useState('15');
    const [fontText, setFontText] = useState('Durka');
    const [fontStyleText, setFontStyleText] = useState('normal');

    const [textinputText1, setTextinputText1] = useState('Production');
    const [xInputText1, setXInputText1] = useState('177');
    const [yInputText1, setYInputText1] = useState('310');
    const [fontSizeText1, setFontSizeText1] = useState('15');
    const [xInputText1X2, setXInputText1X2] = useState('180');
    const [yInputText1X2, setYInputText1X2] = useState('313');
    const [fontSizeText1X2, setFontSizeText1X2] = useState('15');
    const [fontText1, setFontText1] = useState('Durka');
    const [fontStyleText1, setFontStyleText1] = useState('normal');


    //Sliders

    const getBackgroundSize = () => {
        return { backgroundSize: `${(xInput * 100) / 350}% 100%` }
    }
    const getBackgroundSize1 = () => {
        return { backgroundSize: `${(yInput * 100) / 350}% 100%` }
    }
    const getBackgroundSize2 = () => {
        return { backgroundSize: `${(xInputText * 100) / 350}% 100%` }
    }
    const getBackgroundSize3 = () => {
        return { backgroundSize: `${(yInputText * 100) / 350}% 100%` }
    }
    const getBackgroundSize4 = () => {
        return { backgroundSize: `${(xInputText1 * 100) / 350}% 100%` }
    }
    const getBackgroundSize5 = () => {
        return { backgroundSize: `${(yInputText1 * 100) / 350}% 100%` }
    }

    //user input text vars

    const textinputUser = (event) => {
        setTextinput(event.target.value);
    }
    const userFontSize = (event) => {
        setFontSize(event.target.value);
    }
    const textinputUserText = (event) => {
        setTextinputText(event.target.value);
    }
    const userFontSizeText = (event) => {
        setFontSizeText(event.target.value);
    }
    const textinputUserText1 = (event) => {
        setTextinputText1(event.target.value);
    }
    const userFontSizeText1 = (event) => {
        setFontSizeText1(event.target.value);
    }

    //name font info
    const textFontOptions = [

        { value: "Comic Sans MS", label: "Comic Sans MS" },
        { value: "Courier New", label: "Courier New" },
        { value: "Times New Roman", label: "Times New Roman" },
        { value: "Fantasy", label: "Fantasy" },
        { value: "Sans-serif", label: "Sans-serif" },
        { value: "Serif", label: "Serif" },
        { value: "Cambria", label: "Cambria" },
        { value: "Blade", label: "Blade" },
        { value: "Bombing", label: "Bombing" },
        { value: "Devil", label: "Devil" },
        { value: "Drip", label: "Drip" },
        { value: "Durka", label: "Durka" },
        { value: "Emm", label: "Emm" },
        { value: "Eternal", label: "Eternal" },
        { value: "Fresh", label: "Fresh" },
        { value: "Gala", label: "Gala" },
        { value: "Metal", label: "Metal" },
        { value: "Predator", label: "Predator" },
        { value: "Simple", label: "Simple" },

    ];

    const textFontStyleOptions = [
        { value: "normal", label: "Normal" },
        { value: "bold", label: "Bold" },
    ];

    //epitaph line 1 
    const textFontOptionsText = [
        { value: "Courier New", label: "Courier New" },
        { value: "Times New Roman", label: "Times New Roman" },
        { value: "Fantasy", label: "Fantasy" },
        { value: "Blade", label: "Blade" },
        { value: "Bombing", label: "Bombing" },
        { value: "Devil", label: "Devil" },
        { value: "Drip", label: "Drip" },
        { value: "Durka", label: "Durka" },
        { value: "Emm", label: "Emm" },
        { value: "Eternal", label: "Eternal" },
        { value: "Fresh", label: "Fresh" },
        { value: "Gala", label: "Gala" },
        { value: "Metal", label: "Metal" },
        { value: "Predator", label: "Predator" },
        { value: "Simple", label: "Simple" },
    ];

    const textFontStyleOptionsText = [
        { value: "normal", label: "Normal" },
        { value: "bold", label: "Bold" },
    ];
    //epitaph line 2
    const textFontOptionsText1 = [

        { value: "Courier New", label: "Courier New" },
        { value: "Times New Roman", label: "Times New Roman" },
        { value: "Fantasy", label: "Fantasy" },
        { value: "Blade", label: "Blade" },
        { value: "Bombing", label: "Bombing" },
        { value: "Devil", label: "Devil" },
        { value: "Drip", label: "Drip" },
        { value: "Durka", label: "Durka" },
        { value: "Emm", label: "Emm" },
        { value: "Eternal", label: "Eternal" },
        { value: "Fresh", label: "Fresh" },
        { value: "Gala", label: "Gala" },
        { value: "Metal", label: "Metal" },
        { value: "Predator", label: "Predator" },
        { value: "Simple", label: "Simple" },

    ];
    const textFontStyleOptionsText1 = [
        { value: "normal", label: "Normal" },
        { value: "bold", label: "Bold" },
    ];

    const handleChange = selectedOption => {
        console.log('handleChange', selectedOption.value);
        setFont(selectedOption.value);
    };

    const handleChangeStyle = selectedOption => {
        console.log('handleChange', selectedOption.value);
        setFontStyle(selectedOption.value);
    };

    const handleChangeText = selectedOption => {
        console.log('handleChange', selectedOption.value);
        setFontText(selectedOption.value);
    };

    const handleChangeStyleText = selectedOption => {
        console.log('handleChange', selectedOption.value);
        setFontStyleText(selectedOption.value);
    };

    const handleChangeText1 = selectedOption => {
        console.log('handleChange', selectedOption.value);
        setFontText1(selectedOption.value);
    };

    const handleChangeStyleText1 = selectedOption => {
        console.log('handleChange', selectedOption.value);
        setFontStyleText1(selectedOption.value);
    };


    //For Metadata
    const [tomebstoneBackground, setTombstoneBackground] = useState();
    const [tombstoneBase, setTombstoneBase] = useState();
    const [tombstoneBehind, setTomstoneBehind] = useState();
    const [tombstoneFlair, setTombstoneFlair] = useState();
    const [tombstoneGround, setTombstoneGround] = useState();
    const [tombstoneTop, setTombstoneTop] = useState();
    const [tombstoneId, setTombstoneId] = useState();
    const [name, setName] = useState();
    const [epitaph, setEpitaph] = useState();
    const [epitaph1, setEpitaph1] = useState();

    {/* For Image retrieval */ }
    const [canvasImage, setCanvasImage] = useState({
        TombStone: '',
        Text: '',
    });
    {/* For Traits retrieval */ }
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

    /*To fetch users nfts

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
            })
            .catch(function (error) {
                console.error(error);
            });
    }
*/
    /*Set an array of save UnnamedNFT traits which are unburnable and available to all.
    const start = 3000;
    const end = 3009;
    const branding = [...Array(end - start + 1).keys()].map(x => x + start);
    */
    {/* For retrieval of traits */ }
    const [walletTraits, setWalletTraits] = useState([])
    const [apiLoaded, setApiLoaded] = useState(false)
    const [checkMyTraits, setCheckMyTraits] = useState(false)

    function getTraits() {
        const options = { chain: "0xa86a", address: userAddress, token_address: nfTombstoneContract };
        Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
            const result = data.result
            setWalletTraits(result.map(nft => nft.token_id))
            setApiLoaded(true)
        });
    }

    useEffect(() => {
        getTraits();
    }, [account])

    function valueX2() {
        setFontSizeTextX2(fontSizeText * 2);
        setFontSizeText1X2(fontSizeText1 * 2);
        setFontSizeX2(fontSize * 2);
        setXInputX2(xInput * 2);
        setYInputX2(yInput * 2);
        setXInputTextX2(xInputText * 2);
        setYInputTextX2(yInputText * 2);
        setXInputText1X2(xInputText1 * 2);
        setYInputText1X2(yInputText1 * 2);
    }



    function updateText() {
        drawImage(canvasImage.TombStone);
    }

    function updateCanvasTraits(trait) {
        setCanvasImage(prevImage => ({ ...prevImage, [trait.traitType]: trait.image }))
        setChosenTrait(prevTrait => ({ ...prevTrait, [trait.traitType]: trait.traitName, [trait.traitType + 'ID']: trait.id }))

    }

    function createCard(trait) { //Building the card here from Card.jsx passing props and simultaneously fetching traits on click.
        return (

            <div key={trait.edition} onClick={() => {
                updateCanvasTraits(trait)
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
    //visible canvas
    function drawImage(layer) {
        const img = new Image();
        //img.setAttribute('crossOrigin', '*');
        img.src = layer
        img.onload = () => {
            const ctx = canvas.current.getContext("2d")
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, 450, 450);
            ctx.font = `${fontStyle} ${fontSize}px ${font}`;
            ctx.fillText(textinput, xInput, yInput, 150);
            ctx.font = `${fontStyleText} ${fontSizeText}px ${fontText}`;
            ctx.fillText(textinputText, xInputText, yInputText, 150);
            ctx.font = `${fontStyleText1} ${fontSizeText1}px ${fontText1}`;
            ctx.fillText(textinputText1, xInputText1, yInputText1, 150);
        }
        //hidden canvas
        const imgHidden = new Image();
        imgHidden.src = layer
        imgHidden.onload = () => {
            const ctxHidden = hiddenCanvas.current.getContext("2d")
            ctxHidden.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
            ctxHidden.drawImage(imgHidden, 0, 0, 900, 900);
            ctxHidden.font = `${fontStyle} ${fontSizeX2}px ${font}`;
            ctxHidden.fillText(textinput, xInputX2, yInputX2, 300);
            ctxHidden.font = `${fontStyleText} ${fontSizeTextX2}px ${fontText}`;
            ctxHidden.fillText(textinputText, xInputTextX2, yInputTextX2, 300);
            ctxHidden.font = `${fontStyleText1} ${fontSizeText1X2}px ${fontText1}`;
            ctxHidden.fillText(textinputText1, xInputText1X2, yInputText1X2, 300);
        }
        setName(textinput);
        setEpitaph(textinputText);
        setEpitaph1(textinputText1);
    }


    useEffect(() => {
        drawImage(canvasImage.TombStone);
        drawImage(canvasImage.Text);
        valueX2();


    }
        , [canvasImage, canvas, windowWidth, windowHeight, xInput, yInput, xInputText, yInputText, textinput, textinputText, fontSize, fontSizeText, textFontOptionsText, textFontStyleOptionsText, font, fontText, fontText1])//redrawn on changes

    useEffect(() => {
        updateTraitMetaData();
    }, [chosenTrait])




    function updateTraitMetaData() {
        setTombstoneBackground(nftombstoneData[`${(chosenTrait.TombStoneID - 1)}`].attributes[0].value);
        setTomstoneBehind(nftombstoneData[`${(chosenTrait.TombStoneID - 1)}`].attributes[1].value);
        setTombstoneBase(nftombstoneData[`${(chosenTrait.TombStoneID - 1)}`].attributes[2].value);
        setTombstoneFlair(nftombstoneData[`${(chosenTrait.TombStoneID - 1)}`].attributes[3].value);
        setTombstoneTop(nftombstoneData[`${(chosenTrait.TombStoneID - 1)}`].attributes[4].value);
        setTombstoneGround(nftombstoneData[`${(chosenTrait.TombStoneID - 1)}`].attributes[5].value);
        setTombstoneId(chosenTrait.TombStoneID);
    }


    async function activateTombstone() {

        await Moralis.enableWeb3();
        const options = {
            contractAddress: "0xe3525413c2a15daec57C92234361934f510356b8", //NFTombstone mainnet
            functionName: "changeActiveTombstone",
            abi: nfTombstoneABI,
            params: {
                _newTombstone: chosenTrait.TombStoneID, //NFTombstone mainnet
            },
        };
        await contractProcessor.fetch({
            params: options,
        });
        const transaction = await Moralis.executeFunction(options);
        await transaction.wait()


    }

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

    // Add feature: Filter owned trait cards
    const [ownedCards, setOwnedCards] = useState(true)
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

                    <div className="p-1 mb-10 sm:mb-10" ref={div} style={{ height: "30rem", width: "30rem" }}>
                        <canvas
                            ref={canvas}
                            width='450px'
                            height='450px'
                            className='mt-1 border-1 border-4 border-slate-500 text-center content-center p-5'
                        />
                        <div className="text-center pb-2 md: pl-10"><h1 className='font-mono text-lg text-yellow-400 pt-1'>Gravedigger</h1></div>
                        <canvas
                            ref={hiddenCanvas}
                            width='900px'
                            height='900px'
                            className='hidden' />
                    </div>
                    {/* canvas div ends */}
                    {/* Stats div*/}
                    <div className='grow border-dashed border-4 border-slate-500 p-3 pl-5 m-1 text-left col-span-1 w-80 md:mt-10 lg:mt-2 mt-10 sm:mt-10 text-sm' style={{ height: "25rem", width: "22rem" }}>
                        {/* Individual Stats */}
                        <div className='font-mono text-white list-none flex pb-3'>
                            <div className={`text-${(walletTraits.includes(`${chosenTrait.TombStoneID}`)) ? "spot-yellow" : "[red]"} font-bold pr-3 pl-2`}>TombStone ID: </div>
                            {chosenTrait.TombStoneID}
                        </div>


                        <div className='font-mono text-white list-none flex pb-3'>
                            <div className='text-spot-yellow pl-2 pr-2'>Name: </div>
                            {textinput}
                        </div>
                        {/* End of Indiv Stats */}
                        {/* Buttons */}
                        <div className="pt-1 pb-1 flex">

                            <Mint
                                chosenTrait={chosenTrait}
                                walletTraits={walletTraits}
                                background={tomebstoneBackground}
                                behind={tombstoneBehind}
                                flair={tombstoneFlair}
                                ground={tombstoneGround}
                                tombstone={tombstoneBase}
                                top={tombstoneTop}
                                id={chosenTrait.TombStoneID}
                                saveImage={saveImage}
                                userAddress={userAddress}
                                canvas={chosenTrait}
                                savedImage={savedImage}
                                name={name}
                                epitaph={`${(epitaph) + " " + (epitaph1)} `}
                            />
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
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={activateTombstone}>Activate Tombstone {chosenTrait.TombStoneID}</button></div>
                        <div className='font-mono text-white list-none flex pb-3 text-sm pt-2'>

                            Activate your tombstone to send ded nfts to it. You may only have 1 tombstone activate at a time.
                        </div>
                    </div>

                    <div className="gap-4 pt-8 pl-2 grid grid-col-4">
                        <div className="flex">
                            <div className='col-span-2 text-white pr-4'>Name: </div><div><input type="text"
                                className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-24" placeholder="Engrave"
                                value={textinput}
                                onChange={textinputUser.bind(this)}
                            /></div>

                            <div className='col-span-2 text-white px-2'>X: </div><div className="slideContainer"><div className="pt-1"><input type="range" min={0} max={350} id="slider" className="slider" value={xInput} onChange={(e) => setXInput(e.target.valueAsNumber)} style={getBackgroundSize()} /></div></div>

                            <div className='col-span-1 text-white px-2'>Y: </div><div className="slideContainer"><div className="pt-1"><input type="range" min={0} max={350} id="slider" className="slider" value={yInput} onChange={(e) => setYInput(e.target.valueAsNumber)} style={getBackgroundSize1()} /></div></div>

                            <div className='col-span-1 text-white px-2'>Size: </div><div className='pr-2'><input type="text"
                                className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-12" placeholder="Font size"
                                value={fontSize}
                                onChange={userFontSize.bind(this)}
                            /></div>
                            <div className='w-36'><Select options={textFontOptions} onChange={handleChange} defaultValue={{ label: "Gala", value: "Gala" }} /></div>
                            <div className='w-36'><Select options={textFontStyleOptions} onChange={handleChangeStyle} defaultValue={{ label: "Normal", value: "normal" }} /></div>
                        </div>
                        <div className="flex">
                            <div className='col-span-2 text-white pr-1'>Epitaph: </div><div><input type="text"
                                className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-24" placeholder="Engrave"
                                value={textinputText}
                                onChange={textinputUserText.bind(this)}
                            /></div>

                            <div className='col-span-2 text-white px-2'>X: </div><div className="slideContainer"><div className="pt-1"><input type="range" min={0} max={350} id="slider" className="slider" value={xInputText} onChange={(e) => setXInputText(e.target.valueAsNumber)} style={getBackgroundSize2()} /></div></div>

                            <div className='col-span-1 text-white px-2'>Y: </div><div className="slideContainer"><div className="pt-1"><input type="range" min={0} max={350} id="slider" className="slider" value={yInputText} onChange={(e) => setYInputText(e.target.valueAsNumber)} style={getBackgroundSize3()} /></div></div>

                            <div className='col-span-1 text-white px-2'>Size: </div><div className='pr-2'><input type="text"
                                className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-12" placeholder="Font size"
                                value={fontSizeText}
                                onChange={userFontSizeText.bind(this)}
                            /></div>
                            <div className='w-36'><Select options={textFontOptionsText} onChange={handleChangeText} defaultValue={{ label: "Durka", value: "Durka" }} /></div>
                            <div className='w-36'><Select options={textFontStyleOptionsText} onChange={handleChangeStyleText} defaultValue={{ label: "Normal", value: "normal" }} /></div>
                        </div>
                        <div className="flex">
                            <div className='col-span-2 text-white pr-1'>Epitaph: </div><div><input type="text"
                                className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-24" placeholder="Engrave"
                                value={textinputText1}
                                onChange={textinputUserText1.bind(this)}
                            /></div>

                            <div className='col-span-2 text-white px-2'>X: </div><div className="slideContainer"><div className="pt-1"><input type="range" min={0} max={350} id="slider" className="slider" value={xInputText1} onChange={(e) => setXInputText1(e.target.valueAsNumber)} style={getBackgroundSize4()} /></div></div>

                            <div className='col-span-1 text-white px-2'>Y: </div><div className="slideContainer"><div className="pt-1"><input type="range" min={0} max={350} id="slider" className="slider" value={yInputText1} onChange={(e) => setYInputText1(e.target.valueAsNumber)} style={getBackgroundSize5()} /></div></div>

                            <div className='col-span-1 text-white px-2'>Size: </div><div className='pr-2'><input type="text"
                                className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-12" placeholder="Font size"
                                value={fontSizeText1}
                                onChange={userFontSizeText1.bind(this)}
                            /></div>
                            <div className='w-36'><Select options={textFontOptionsText1} onChange={handleChangeText1} defaultValue={{ label: "Durka", value: "Durka" }} /></div>
                            <div className='w-36'><Select options={textFontStyleOptionsText1} onChange={handleChangeStyleText1} defaultValue={{ label: "Normal", value: "normal" }} /></div>
                        </div>
                    </div>
                </div>{/* Canvas Row Div Ends*/}
                <div className='overflow-y-auto'>
                    <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-6 gap-5 font-mono text-spot-yellow">
                        {ownedCards ? ownedFilter.map(createCard) : dataSearch.map(createCard)}
                    </div></div>
                <div className='blade text-slate-900'>T</div><div className='bombing text-slate-900'>H</div><div className='devil text-slate-900'>E</div><div className='drip text-slate-900'>S</div><div className='durka text-slate-900'>P</div><div className='emm text-slate-900'>O</div><div className='eternal text-slate-900'>T</div><div className='fresh text-slate-900'>2</div><div className='gala text-slate-900'>0</div><div className='metal text-slate-900'>2</div><div className='predator text-slate-900'>2</div><div className='simple text-slate-900'>!</div>

            </div >

        )

}
