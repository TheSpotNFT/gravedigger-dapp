import React, { useState, useEffect } from "react";
import { ethers, Contract } from "ethers";
import { SPOTBOT_ADDRESS, SPOTBOT_ABI } from '../Contracts/SpotBotContract';
import { SPOT404_ADDRESS, SPOT404_ABI } from "../Contracts/Spot404";
import SPOTNFTABI from '../Contracts/SpotNFTAbi.json';
import { EFF404_ABI, EFF404_ADDRESS } from "../Contracts/Eff404Contract";
import { EFF_ABI, EFF_ADDRESS } from "../Contracts/EffContract";
import ReactGA from 'react-ga';
import LogoutButton from "../Logout";
import goatdmain from "../../assets/goatdmain.png";
import goatddevil from "../../assets/goatddevil.png";
import analogimage from "../../assets/analog/41-1.png";
import unnamednft from "../../assets/logounnamed.png";
import spotbot1 from "../../assets/spotbot/1.png";
import spotbot2 from "../../assets/spotbot/2.png";
import spotbot3 from "../../assets/spotbot/3.png";
import spotbot4 from "../../assets/spotbot/4.png";
import spotbot5 from "../../assets/spotbot/5.png";
import spotbot6 from "../../assets/spotbot/6.png";
import spotbot7 from "../../assets/spotbot/7.png";
import spotbot8 from "../../assets/spotbot/8.png";
import spotbot9 from "../../assets/spotbot/9.png";
import spotbot10 from "../../assets/spotbot/10.png";
import spotbot11 from "../../assets/spotbot/11.png";
import nftombstone1 from "../../assets/tombstone1.png";
import nftombstone2 from "../../assets/tombstone2.png";
import nftombstone3 from "../../assets/tombstone3.png";
import nftombstone4 from "../../assets/tombstone4.png";
import cc1 from "../../assets/scribble/CC1.png";
import cc2 from "../../assets/scribble/CC2.png";
import cc3 from "../../assets/scribble/CC3.png";
import cc4 from "../../assets/scribble/CC4.png";
import analogmain from "../../assets/analog.png";
import eff from "../../assets/eff.png";
import analog1 from "../../assets/analog/7-b.png";
import analog2 from "../../assets/analog/2.png";
import analog3 from "../../assets/analog/41.png";
import analog4 from "../../assets/anananoir.png";
import spotmobile from "../../assets/spotbot/261.png";
import FlippableCard from "../../components/flippable-card";
import ChadYellow from "../../assets/chad_yellow.png";
import "../../index.css";
import Footer from "../Footer";
import VibesMint from "../../components/vibesMints";
import VibesMintMobile from "../vibesMintsMobile";
import gud from "../../assets/gud.png"
import bad from "../../assets/bad.png"
import MobileMenu from "../MobileMenu";
import { useAuth } from "../../Auth";
import { B3NOCHILL_ABI, B3NOCHILL_ADDRESS } from "../Contracts/B3nochill";
import { BADBONEBIZ_ABI, BADBONEBIZ_ADDRESS } from "../Contracts/BadBoneBiz";
import { NOCHILL_ABI, NOCHILL_ADDRESS } from "../Contracts/Nochill";
import { PEPE_ABI, PEPE_ADDRESS } from "../Contracts/Pepe";
import { COQ_ABI, COQ_ADDRESS } from "../Contracts/Coq";
import { PEPECOQ_ABI, PEPECOQ_ADDRESS } from "../Contracts/PepeCoq";
import bones from "../../assets/B31544.png";
import pepe from "../../assets/6194.png";

ReactGA.initialize('G-YJ9C2P37P6');


const Main = ({
 
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

  const [spotsMinted, setSpotsMinted] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const onClickUrl = (url) => {
    return () => openInNewTab(url);
  };
  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_self", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

const observer = new IntersectionObserver(entries => {

})
const [explore, setExplore] = useState(false);
const [background, setBackground] = useState(false);
const [textinputText, setTextinputText] = useState([]);
const [textinputText1, setTextinputText1] = useState([]);
const [depositAmount, setDepositAmount] = useState([]);
const [withdrawAmount, setWithdrawAmount] = useState([]);
const [depositPepeAmount, setDepositPepeAmount] = useState([]);
const [withdrawPepeAmount, setWithdrawPepeAmount] = useState([]);

const textinputUserText = (event) => {
  setTextinputText(event.target.value);
};

const textinputUserText1 = (event) => {
  setTextinputText1(event.target.value);
};

const textinputUserText2 = (event) => {
  setDepositAmount(event.target.value);
};

const textinputUserText3 = (event) => {
  setWithdrawAmount(event.target.value);
};

const textinputUserText4 = (event) => {
  setDepositPepeAmount(event.target.value);
};

const textinputUserText5 = (event) => {
  setWithdrawPepeAmount(event.target.value);
};

function exploreClick(){
  setExplore(!explore);
}

  function alertClick() {
    alert("The Evolution is Coming Soon...");
  }

const [textinput, setTextinput] = useState("1");

const textinputUser = (event) => {
  setTextinput(event.target.value);
};
const [txProcessing, setTxProcessing] = useState();


async function setApprovalForAll() {
  setTxProcessing(true);
  try {
      const { ethereum } = window;
      if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          if (SPOTNFTABI && "0x0C6945E825fc3c80F0a1eA1d3E24d6854F7460d8" && signer) {
              const contract = new Contract("0x0C6945E825fc3c80F0a1eA1d3E24d6854F7460d8", SPOTNFTABI, signer);


              let tx = await contract.setApprovalForAll("0x088aa15add5A141Fc144d4B30D6a600B4DA55DF2", "1");
              console.log(tx.hash);
              setTxProcessing(false);
              alert(
                  "Your Spot Approved for Wrapping"
              );
          }
      }
  } catch (error) {
      console.log(error);
  } finally {
      setTxProcessing(false);
  }
}

async function setApprovalForAllBadBoneBiz() {
  setTxProcessing(true);
  try {
      const { ethereum } = window;
      if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          if (BADBONEBIZ_ABI && BADBONEBIZ_ADDRESS && signer) {
              const contract = new Contract(BADBONEBIZ_ADDRESS, BADBONEBIZ_ABI, signer);


              let tx = await contract.setApprovalForAll("0xd1DdA723Db979456f486Bcd60cC23e8468805730", "1");
              console.log(tx.hash);
              setTxProcessing(false);
              alert(
                  "Your Bonez Approved for Wrapping"
              );
          }
      }
  } catch (error) {
      console.log(error);
  } finally {
      setTxProcessing(false);
  }
}

async function setApprovalForAllPepe() {
  setTxProcessing(true);
  try {
      const { ethereum } = window;
      if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          if (PEPE_ABI && PEPE_ADDRESS && signer) {
              const contract = new Contract(PEPE_ADDRESS, PEPE_ABI, signer);


              let tx = await contract.setApprovalForAll("0x0293E3798984FDc66ed68fAA337C1d4FEb65Ba2B", "1");
              console.log(tx.hash);
              setTxProcessing(false);
              alert(
                  "Your Pepe Portraits Approved for Wrapping"
              );
          }
      }
  } catch (error) {
      console.log(error);
  } finally {
      setTxProcessing(false);
  }
}



async function setApprovalForAllNoChill() {
  setTxProcessing(true);
  try {
      const { ethereum } = window;
      if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          if (NOCHILL_ABI && NOCHILL_ADDRESS && signer) {
              const contract = new Contract(NOCHILL_ADDRESS, NOCHILL_ABI, signer);


              let tx = await contract.approve("0xd1DdA723Db979456f486Bcd60cC23e8468805730", "1000000000000000000000000");
              console.log(tx.hash);
              setTxProcessing(false);
              alert(
                  "Spending Approved!"
              );
          }
      }
  } catch (error) {
      console.log(error);
  } finally {
      setTxProcessing(false);
  }
}

async function setApprovalForAllCoq() {
  setTxProcessing(true);
  try {
      const { ethereum } = window;
      if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          if (COQ_ABI && COQ_ADDRESS && signer) {
              const contract = new Contract(COQ_ADDRESS, COQ_ABI, signer);


              let tx = await contract.approve("0x0293E3798984FDc66ed68fAA337C1d4FEb65Ba2B", "500000000000000000000000000");
              console.log(tx.hash);
              setTxProcessing(false);
              alert(
                  "Spending $COQ Approved!"
              );
          }
      }
  } catch (error) {
      console.log(error);
  } finally {
      setTxProcessing(false);
  }
}

async function wrap721() {
  setTxProcessing(true);
  try {
      const { ethereum } = window;
      if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          if (SPOT404_ABI && SPOT404_ADDRESS && signer) {
              const contract = new ethers.Contract(SPOT404_ADDRESS, SPOT404_ABI, signer);

              // Convert the input string to an array of numbers
              const inputArray = textinputText.split(',').map(n => parseInt(n.trim(), 10));

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

async function effSetApprovalForAll() {
  setTxProcessing(true);
  try {
      const { ethereum } = window;
      if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          if (EFF_ABI && "0xabCddFC922a39dB1747c1e46c273a50f0f42Bfb3" && signer) {
              const contract = new Contract("0xabCddFC922a39dB1747c1e46c273a50f0f42Bfb3", EFF_ABI, signer);


              let tx = await contract.setApprovalForAll("0x0F342513b5881919e07F7682Df74C720345d8634", "1");
              console.log(tx.hash);
              setTxProcessing(false);
              alert(
                  "Your Eff_Inscription Approved for Wrapping"
              );
          }
      }
  } catch (error) {
      console.log(error);
  } finally {
      setTxProcessing(false);
  }
}

async function effWrap721() {
  setTxProcessing(true);
  try {
      const { ethereum } = window;
      if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          if (EFF404_ABI && EFF404_ADDRESS && signer) {
              const contract = new ethers.Contract(EFF404_ADDRESS, EFF404_ABI, signer);

              // Convert the input string to an array of numbers
              const inputArray = textinputText1.split(',').map(n => parseInt(n.trim(), 10));

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



const depositTokens = async () => {
  setTxProcessing(true);
  console.log(depositAmount);
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      if (signer) {
        const contract = new ethers.Contract(B3NOCHILL_ADDRESS, B3NOCHILL_ABI, signer);
              // Convert the input string to an array of numbers
              const inputArray = depositAmount.split(',').map(n => parseInt(n.trim(), 10));

              // Call the smart contract function with the array
              let tx = await contract.wrapSet(inputArray);

        console.log(tx.hash);
        alert("Tokens deposited successfully!");
      }
    }
  } catch (error) {
    console.log(error);
    alert("An error occurred. See the console for details.");
  } finally {
    setTxProcessing(false);
  }
};


const withdrawTokens = async () => {
  setTxProcessing(true);
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      if (signer) {
        const contract = new ethers.Contract(B3NOCHILL_ADDRESS, B3NOCHILL_ABI, signer);

            // Convert the input string to an array of numbers
            const inputArray = withdrawAmount.split(',').map(n => parseInt(n.trim(), 10));

            // Call the smart contract function with the array
            let tx = await contract.unwrapSet(inputArray);

        console.log(tx.hash);
        alert("Tokens withdrawn successfully!");
      }
    }
  } catch (error) {
    console.log(error);
    alert("An error occurred. See the console for details.");
  } finally {
    setTxProcessing(false);
  }
};

const depositPepeTokens = async () => {
  setTxProcessing(true);
  console.log(depositPepeAmount);
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      if (signer) {
        const contract = new ethers.Contract(PEPECOQ_ADDRESS, PEPECOQ_ABI, signer);
              // Convert the input string to an array of numbers
              const inputArray = depositPepeAmount.split(',').map(n => parseInt(n.trim(), 10));

              // Call the smart contract function with the array
              let tx = await contract.wrapSet(inputArray);

        console.log(tx.hash);
        alert("Tokens deposited successfully!");
      }
    }
  } catch (error) {
    console.log(error);
    alert("An error occurred. See the console for details.");
  } finally {
    setTxProcessing(false);
  }
};


const withdrawPepeTokens = async () => {
  setTxProcessing(true);
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      if (signer) {
        const contract = new ethers.Contract(PEPECOQ_ADDRESS, PEPECOQ_ABI, signer);

            // Convert the input string to an array of numbers
            const inputArray = withdrawPepeAmount.split(',').map(n => parseInt(n.trim(), 10));

            // Call the smart contract function with the array
            let tx = await contract.unwrapSet(inputArray);

        console.log(tx.hash);
        alert("Tokens withdrawn successfully!");
      }
    }
  } catch (error) {
    console.log(error);
    alert("An error occurred. See the console for details.");
  } finally {
    setTxProcessing(false);
  }
};

async function mintNFT(setTxProcessing) {
  //setTxProcessing(true);
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      if (SPOTBOT_ABI && SPOTBOT_ADDRESS && signer) {
        const contract = new Contract(
          SPOTBOT_ADDRESS,
          SPOTBOT_ABI,
          signer
        );

        let options = {
          // price is 1.5 avax
          value: ethers.utils.parseEther(`${textinput * 0.15}`),
        
        };

        let tx = await contract.mint(textinput, options);
        console.log(tx.hash);
        //setTxProcessing(false);
        /*alert(
          "Minted Successfully! View your NFT on Campfire, Kalao or Joepegs!"
        );*/
      } else {
        console.log("error with contract abi, address, or signer");
      }
    }
  } catch (error) {
    console.log("Error on mint");
    console.log(error);
    alert(error.data.message);
  } finally {
    //setTxProcessing(false);
  }
}

//Scrolling Listener



const changeBackground = () => {
  if(window.scrollY >= 300) {
    setBackground(true);
  } else {
    setBackground(false);
  }
  
 // console.log(window.scrollY);
   //console.log(background);
}

window.addEventListener('scroll', changeBackground);

//Slider
const slideLeft = () => {
  var slider = document.getElementById('slider')
  slider.scrollLeft = slider.scrollLeft - 800
}
const slideRight = () => {
  var slider = document.getElementById('slider')
  slider.scrollLeft = slider.scrollLeft + 800
}

  return (
    <div> 
      {/* MOBILE LAYOUT */}
      <div className="snap-container flex-auto mx-auto px-12 block lg:hidden scroll-smooth scrollbar-hide ">
        
 <div><img src={spotmobile} alt="Goatd" className=""></img></div>

   {/*Spot Bot */}
   <div className="pt-4"><a href="/ecosystem"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-3xl flex justify-center"
              
            >
              Eco-system Overview
            </button></a></div>
            <div id="spotwrapmobile" className="font-mono text-3xl px-4 py-4 pt-16 text-white">Wrap Your Spot</div>
 <div className="mx-auto w-full"><img src={ChadYellow} alt="The Spot" className="w-full"></img></div>

 <div className="font-mono text-l px-4 py-2 text-white">Play safe, wrap up your spot in our 404 contract! First approve, then wrap. We won't wrap it up without your consent.</div>
 <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={setApprovalForAll}
        >
          Approve To Wrap Spots
        </button>
        </div>
        <div className="pt-4">
                                    <input
                                        type="text"
                                        className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-96 h-12"
                                        placeholder="IDs to Wrap (separate IDs with a comma)"
                                        value={textinputText}
                                        onChange={textinputUserText.bind(this)}
                                    />
                                </div>
        <div className="py-2">
          
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={wrap721}
        >
          Wrap Them Up!
        </button>
        </div>
   <div id="spotbotmobile" className="font-mono text-3xl px-4 py-4 pt-16 text-white">Spot Bot</div>
 <div><img src={spotbot4} alt="Spot Bot" className=""></img></div>

 <div className="font-mono text-l px-4 py-2 text-white">The Spot Bots are taking over. 3k bots need to be produced in order to fire up the Sacrificial Power Obtaining Technology and then the remaining 2k bots will be produced by sacrificing other NFTs to the collective. Our gamefi offering, phase 2 will launch once 3k bots are minted, with phase 3 activating once all 5k are produced.</div>
 <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/rarity")}
        >
          Rarity Listings
        </button>
        </div>
       

   {/*Vibes */}
 
   <div id="vibesmobile" className="font-mono text-3xl px-4 py-4 pt-16 text-white">Vibes</div>
 {/*<div><img src={spotbot4} alt="Spot Bot" className=""></img></div>*/}

 <div className="font-mono text-l px-4 py-2 text-white">Send gudVibes. Send badVibes. But mostly send gudVibes. Sending gudVibes to someone allows them to claim dNFTs and the more gudVibes they hold the more their dNFT evolves. They also receive 50% of the mint fee. badVibes work against gudVibes and 50% of the badVibes minting fees go to a random gudVibes receiver. Mint is 0.2 avax per gudVibe. </div>
 <div><img src={gud} alt="gudVibes NFT" className=""></img></div>
 <div className="py-2">
        <VibesMintMobile/>
        </div>
        {/*GOATD */}
 <div className="font-mono text-3xl px-4 py-4 pt-16 text-white">Goatd</div>
 <div><img src={goatdmain} alt="Goatd" className=""></img></div>

 <div className="font-mono text-l px-4 py-2 text-white">Greatest of all Time Degens. Collect your ERC-1155 traits and combine them to create your pfp. Stake your SPOT for free traits or buy from secondary. Either way you choose your pfp traits. If you mint a combination, that combo can not be minted again.</div>
 <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/goatd")}
        >
          Launch Goatd
        </button> </div>
        <div className="py-2"> <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/staking")}
        >
          Launch Staking
        </button></div>
        <div className="py-2"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-2xl flex justify-center"
              onClick={onClickUrl("https://joepegs.com/collections/avalanche/spot-trait-drops")}
            >
              Browse Traits
            </button></div>
            <div className="py-2"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-2xl flex justify-center"
              onClick={onClickUrl("https://campfire.exchange/collections/0x9455aa2af62b529e49fbfe9d10d67990c0140afc")}
            >
              View Collection 
            </button></div>

        {/*NFTombstones */}
 
 <div className="font-mono text-3xl px-4 py-4 pt-16 text-white">NFTombstone</div>
 <div><img src={nftombstone4} alt="NFTombstone" className=""></img></div>

 <div className="font-mono text-l px-4 py-2 text-white">Mint your tombstone, engrave your tombstone, send ded nfts to your tombstone (soon). Even send engraved tombstones to your friends or foes as souldbound tokens to live in their wallet forever.</div>
 <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/gravedigger")}
        >
          Launch Gravedigger
        </button>
        </div>

{/* Unnamed Branding */}

 <div className="font-mono text-3xl px-4 py-4 pt-16 text-white">Unnamed Branding</div>
 <div><img src={unnamednft} alt="Unnamed" className=""></img></div>

 <div className="font-mono text-l px-4 py-2 text-white">Slap your favourite project's branding on your unnamedNFT. Let's gooooo!!!!</div>
 <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/unnamed")}
        >
          Launch Brandoooor
        </button>
        </div>

{/*Analog */}

 <div className="font-mono text-3xl px-4 py-4 pt-16 text-white">Analog</div>
 <div><img src={analogimage} alt="Analog" className=""></img></div>

 <div className="font-mono text-l px-4 py-2 text-white">IRL artwork with a twist. dNFTs that you can alter to the variation of your choosing. Keep it orig or choose a variation? Up to you, you just need to own a genesis collection SPOT nft in order to alter the analog piece. Check it!</div>
 <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/analog")}
        >
          Launch Analog
        </button>
        </div>

{/*Scribble */}
 
 <div className="font-mono text-3xl px-4 py-4 pt-16 text-white">Scrible Customs</div>
 <div><img src={cc3} alt="Scribble" className=""></img></div>

 <div className="font-mono text-l px-4 py-2 text-white">Own a SCRIBBLE WARLOCK piece? Claim your custom card today. Enter in your prompts and SCRIBBLE will gift you a dope custom card.</div>

 <div className="py-2 pb-8">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/scribble")}
        >
          Launch Scribble Customs
        </button>
        </div>
        <img src={eff} alt="Goatd" className="p-5 m-0 lg:w-4/5 2xl:w-4/5 block"></img>
        <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={effSetApprovalForAll}
        >
          Approve To Wrap Eff_Inscriptions
        </button>
        </div>
        <div className="pt-4">
                                    <input
                                        type="text"
                                        className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-96 h-12"
                                        placeholder="IDs to Wrap (separate IDs with a comma)"
                                        value={textinputText1}
                                        onChange={textinputUserText1.bind(this)}
                                    />
                                </div>
        <div className="py-2">
          
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={effWrap721}
        >
          Wrap Them Up!
        </button>
        </div>
      </div>



      {/* DESKTOP LAYOUT */}
    <div className="snap-container flex-auto mx-auto px-12 hidden lg:block scroll-smooth">
    
      
    <div className={`h-screen bg-spotbg bg-cover bg-no-repeat bg-center bg-fixed bg-slate-900 scroll-smooth snap-start ${background ? "bg-opacity-0 duration-1000" : "bg-opacity-100"}`}>
    <div className="fixed bottom-0 w-full px-4 py-2 pb-16 pr-36 bg-opacity-60 flex justify-end">
  <button
    className="w-1/4 rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 py-2 bg-gray-300 bg-opacity-30 border-4 border-spot-yellow text-spot-yellow
hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl"
    onClick={onClickUrl("/rarity")}
  >
    Spot Bot Rarity
  </button>
</div>



    </div>
    <div className="snap-item scroll-smooth h-screen">
      {/*Spot Explainer */}
    <div className="grid grid-cols-2 h-screen pt-24 lg:pr-10 2xl:pr-24">
    <div className="pl-24 xl:pl-24 2xl:pl-36 md:pt-12 2xl:pt-24"><img src={goatdmain} alt="Goatd" className="p-5 m-0 lg:w-4/5 2xl:w-4/5 block"></img>
    <div className="text-sm font-mono text-white text-bold lg:text-sm xl:text-sm 2xl:text-lg lg:pt-4 2xl:pt-12 lg:pb-12 2xl:pb-8 pr-24 pl-16">Play safe, wrap up your spot in our 404 contract! First approve, then wrap. We won't wrap it up without your consent.</div> 
            <div className="px-48 pt-8"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-3xl flex justify-center"
              onClick={setApprovalForAll}
            >
              Approve Your Spots to be Wrapped
            </button></div>
            <div className="pl-1 pr-6 pt-4">
                                    <input
                                        type="text"
                                        className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-96 h-12"
                                        placeholder="IDs to Wrap (separate IDs with a comma)"
                                        value={textinputText}
                                        onChange={textinputUserText.bind(this)}
                                    />
                                </div>
            <div className="px-48 pt-4"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-3xl flex justify-center"
              onClick={wrap721}
            >
              Wrap Them Up!
            </button></div></div>
    <div className="text-white pt-10 font-mono">
      <h1 className="text-5xl pt-4 pb-10 pr-12">The Spot on Avax</h1>
      <div className="lg:text-lg xl:text-xl 2xl:text-xl lg:pt-4 2xl:pt-12 lg:pb-12 2xl:pb-24 pr-24">Join us at The Spot on Avax, where devs can be devs and degens can be degens and everyone else can be whoever they want to be. We host a ton of projects such as dNFTs like Analog and UnnamedNFT and other one of a kind personalized NFTs such as NFTombstones and Goat'd pfps. There is literally something for everyone at The Spot on Avax. Pick up an OG spot today so you can take advantage of everything at The Spot on Avax, your Spot unlocks all the staking and dNFT functionality of our collections. </div>
    
      <div className="px-48 pt-4 pb-4"><a href="/ecosystem"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-3xl flex justify-center"
              
            >
              Eco-system Overview
            </button></a></div>
       <div className="px-48"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-3xl flex justify-center"
              onClick={onClickUrl("/goatd")}
            >
              Launch Goatd
            </button></div>
           
            <div className="px-48 pt-4"><a href="#vibes"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-3xl flex justify-center"
              
            >
              Vibes
            </button></a></div>
            </div>
     
    </div>
  </div>
  <div className="h-screen bg-botbg bg-contain bg-no-repeat bg-center bg-fixed snap-start scroll-smooth">

</div>
  <div className="snap-item scroll-smooth">
      {/*Spot Bots */}
    <div id="spotbot" className="h-full lg:pt-20 xl:pt-24 overflow-hidden">
    <div className="text-white pr-10">
      <h1 className="text-5xl pt-2 font-mono">The Spot Bot</h1>
      <div className="text-xl font-mono pt-8 px-24 lg:pb-8 xl:pb-8 lg:text-base xl:text-lg 2xl:text-xl">The bots are coming! As supply chains are recovering the manufacturing process has begun. The initial mint of 3k bots will happen over the span of an undetermined time, as parts are available. The first round has been released in Jan 2023, and subsequent releases are to follow. Updates will be given as they are made available. Once 3k Spot Bots are produced holders will have the opprotunity to harnes the Sacrificial Power Obtaining Technology  (SPOT) that the bots have created and produce the remaining 2k bots by sacrificing NFTs from other collections, rugged, ded or alive NFTs to have a chance at producing more bots. The more bots you hold th emore of a chance you will have at a successful sacrificial production. 1/1 Spot Bots will have a 100% production rate on NFT sacrifice. Once 5k bots are produced the true utility of the bots will be revealed. </div>
     
            <div className="px-96 pb-8"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-2xl flex justify-center"
              onClick={onClickUrl("/rarity")}
            >
              Rarity Listing
            </button></div>
            </div>
      <div className="flex pr-16">
      
      <div><img src={spotbot5} alt="Spot Bot" className="p-5 m-0"></img></div>
      <div><img src={spotbot2} alt="Spot Bot" className="p-5 m-0"></img></div>
   
      <div><img src={spotbot9} alt="Spot Bot" className="p-5 m-0"></img></div>
      <div><img src={spotbot10} alt="Spot Bot" className="p-5 m-0"></img></div>
    
     </div>

    

    </div>
  </div>
  <div className="h-screen bg-botbg3 bg-contain bg-no-repeat bg-center bg-fixed snap-start scroll-smooth">

</div>
  <div className="snap-item scroll-smooth">
      {/* Vibes */}
    <div id="vibes" className="h-full lg:pt-8 xl:pt-12 overflow-hidden">
    <div className="text-white pr-10">
      <h1 className="text-5xl pt-8 font-mono">Vibes</h1>
      <div className="grid grid-cols-1">
     
      <div className="text-xl font-mono pt-8 px-48 lg:pb-8 xl:pb-8 lg:text-base xl:text-base 2xl:text-base col-span-2">gudVibes? badVibes? You choose. Send gudVibes or badVibes to anyone. 0.2 avax mint fee. Enter an address to send gud or bad vibes to and send away. If you send someone gudVibes, 50% of the minting fee also goes to them. If you send someone badVibes then 50% of the minting fee gets sent to a random gudVibes receiver. What good are gudVibes? Well they are gud for starters but they will also be used to claim NFTs that will showcase how many gudVibes you've been sent. Sure you can sell your gudVibes, but you wouldn't, right?! Right?!! Okay okay, so wtf is up with badVibes? If you get sent badVibes the weight of your gudVibes will be deminished. WTF?! Yeah, I know, right? Ok ok so say you get sent a total of 100 gudVibes but some nob sent you 40 badVibes, your 100 gudVibes now only equal 60 gudVibes. What do gudVibes do for me? Good question. The more gudVibes you own the more vibes NFTs you can claim and the more gudVibes you hold the more legendary the vibe NFT you claimed will be. They will be dNFTs that change depending how many gudVibes you hold. So do gud, get gudVibes and LFG!!!</div>
      
      </div>
            </div>
        <div className="grid grid-cols-8">
          <div></div>
          <div></div>
          
      <div className="text-white font-mono"><img src={gud} alt="gudVibes NFT" className="col-span-2"/><p>gudVibes</p></div>
      <div></div>
          <div></div>
      <div className="text-white font-mono"><img src={bad} alt="badVibes NFT" className="col-span-5"/><p>badVibes</p></div>
      <div></div>
      <div></div>
      </div>
      <div className="flex justify-center pt-8"><VibesMint/></div>

    

    </div>
  </div>
  <div className="h-screen bg-botbg2 bg-contain bg-no-repeat bg-center bg-fixed snap-start">

</div>
<div className="h-screen">
      {/*Scribble Customs */}
    <div className="h-full mx-auto snap-start snap-always pt-36 grid lg:grid-cols-2 grid-cols-1 pl-48">
    <div className="text-white pr-10 font-mono">
      <h1 className="text-3xl 2xl:text-5xl pt-20">Scribble Customs</h1>
      <div className="text-xl 2xl:text-2xl pt-8 px-4 xl:px-24"> Enter the world of Scribble Warlock and his custom cards. Owners of Scribbles pieces can claim a custom card.</div>
      <div className="flex pt-10 opacity-20 hover:opacity-100 duration-300">
      <div className="hover:scale-105 duration-300"><img src={cc1} alt="Scribble Custom" className="lg:p-2 xl:p-4 m-0 lg:w-[400px] w-[300px]"></img></div>
      <div className="hover:scale-105 duration-300"><img src={cc2} alt="Scribble Custom" className="lg:p-2 xl:p-4 m-0 lg:w-[400px] w-[300px]"></img></div>
      <div className="hover:scale-105 duration-300"><img src={cc3} alt="Scribble Custom" className="lg:p-2 xl:p-4 m-0 lg:w-[400px] w-[300px]"></img></div>
      <div className="hover:scale-105 duration-300"><img src={cc4} alt="Scribble Custom" className="lg:p-2 xl:p-4 m-0 lg:w-[400px] w-[300px]"></img></div>
      </div>
      <div className="pt-20 px-36"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-2xl flex justify-center"
              onClick={onClickUrl("/scribble")}
            >
              Get Scribbled
            </button></div>
            </div>
     <div className="lg:pt-2 2xl:pt-2"> <FlippableCard /></div>
   
 
    
   

    </div>
  </div>
  <div className="h-screen bg-goatdmacho bg-contain bg-no-repeat bg-center bg-fixed snap-start">

</div>
  <div className="h-screen">
      {/*Goatd */}
    <div className="h-full snap-start snap-always pt-24">
    <div className="text-white pr-10">
      
      <div className="grid grid-cols-2">
        
      <div className="xl:pl-24 2xl:pl-36 md:pt-12 2xl:pt-24"><img src={goatddevil} alt="Goatd" className="p-5 m-0 lg:w-4/5 2xl:w-3/5 block"></img></div>
      <div className="text-xl 2xl:text-2xl lg:pt-4 xl:pt-12 2xl:pt-16 pl-12 font-mono"><h1 className="text-5xl pb-12 font-mono">Goatd</h1>Collect your traits, enter the transmorphisizer and combine your traits to mint your Goat'd PFP. These Greatest of all Time Degens are ready to assemble with traits available on the secondary market as well as receivable by staking your OG Spot NFT.
      <div className="lg:px-24 xl:px-48 pt-24"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-2xl flex justify-center"
              onClick={onClickUrl("/goatd")}
            >
              Launch Goatd
            </button></div>
            <div className="lg:px-24 xl:px-48 pt-4"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-2xl flex justify-center"
              onClick={onClickUrl("/staking")}
            >
              Launch Staking
            </button></div>
            <div className="lg:px-24 xl:px-48 pt-4"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-2xl flex justify-center"
              onClick={onClickUrl("https://joepegs.com/collections/avalanche/spot-trait-drops")}
            >
              Browse Traits
            </button></div>
            <div className="lg:px-24 xl:px-48 pt-4"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-2xl flex justify-center"
              onClick={onClickUrl("https://campfire.exchange/collections/0x9455aa2af62b529e49fbfe9d10d67990c0140afc")}
            >
              View Collection 
            </button></div></div>
      
            </div> </div>
      


    </div>
  </div>
  <div className="h-screen bg-nftombstonebg bg-contain bg-no-repeat bg-center bg-fixed snap-start">

</div>
  <div className="h-screen">
      {/* NFTombstones */}
    <div className="h-full snap-start snap-always lg:pt-10 xl:pt-16 overflow-hidden">
    <div className="text-white pr-10 font-mono">
      <h1 className="text-5xl md:pt-4 2xl:pt-6">NFTombstones</h1>
      <div className="lg:text-base xl:text-xl 2xl:text-2xl md:pt-8 2xl:pt-12 lg:px-48 xl:px-96">Mint your NFTombstone, engrave it forever. Personalized, customized, NFTs. Send engraved NFTombstones to another wallet as a SOULBOUND token, living there FOREVER. NFTombstone your friend or foe...</div>
      <div className="px-96 lg:pt-8 xl:pt-12 2xl:pt-12"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-2xl flex justify-center"
              onClick={onClickUrl("/gravedigger")}
            >
              Enter the Cemetery
            </button></div>
            </div>
      <div className="grid grid-cols-3 place-items-center lg:pt-8 xl:pt-12 2xl:pt-16 px-48 pb-8">
      <div><img src={nftombstone4} alt="Spot Bot" className="p-5 m-0 opacity-50 hover:opacity-100 hover:scale-105 duration-200"></img></div>
      <div><img src={nftombstone3} alt="Spot Bot" className="p-5 m-0 opacity-50 hover:opacity-100 hover:scale-105 duration-200"></img></div>
      <div><img src={nftombstone2} alt="Spot Bot" className="p-5 m-0 opacity-50 hover:opacity-100 hover:scale-105 duration-200"></img></div>

    
     </div>

    </div>
  </div>


<div className="h-screen bg-unnamedbg bg-contain bg-no-repeat bg-center bg-fixed snap-start">

</div>
  <div className="h-screen">
      {/*Unnamed */}
    <div className="h-full snap-start snap-always pt-24">
    <div className="text-white pr-10">
      
      <div className="grid grid-cols-2">
        
      <div className="xl:pl-24 2xl:pl-36 md:pt-12 2xl:pt-24"><img src={unnamednft} alt="Unnamed" className="p-5 m-0 lg:w-4/5 2xl:w-3/5 block"></img></div>
      <div className="text-xl 2xl:text-2xl lg:pt-4 xl:pt-12 2xl:pt-16 pl-12 font-mono"><h1 className="text-5xl pb-12 font-mono">UnnamedNFT</h1>Brand your unnamedNFT with the most popular brands on avalanche. From Cuddlefish to Beeg Rock and Happy Sun and Doodleverse, there is sure to be a brand that fits on your unnamedNFT. Watch for limited released graphics for the unnamedNFTs like our past Scribble Warlock graphics and zombie Monkeez graphic. 
      <div className="lg:px-24 xl:px-48 pt-24"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-2xl flex justify-center"
              onClick={onClickUrl("/unnamed")}
            >
              Launch Brandoor
            </button></div>
            </div>
      
            </div> </div>
      


    </div>
  </div>

  <div className="h-screen bg-analog bg-contain bg-no-repeat bg-center bg-fixed snap-start">

</div>
<div className="h-screen">
      {/* Analog */}
    <div className="h-full mx-auto snap-start snap-always pt-36 grid lg:grid-cols-2 grid-cols-1 pl-48">
    <div className="pt-8 mx-auto px-12"><img src={analogmain} alt="Analog" className="mx-auto lg:p-2 xl:p-4 m-0 w-full"></img>
    <div className="px-10 md:pt-12 2xl:pt-8 py-4 gap-10 font-mono text-white md:text-l 2xl:text-2xl">
      Analog is a series of dNFTs that you may change to a specific variation if you own a
      Spot NFT and the 1/1 piece. IRL pieces are created in the analog world and brought into the digital to live on the blockchain. Check it out and browse all the variations of the
      pieces and commit a variation once you own the piece. Get a Spot NFT at
      <a
  href="https://campfire.exchange/collections/0x0c6945e825fc3c80f0a1ea1d3e24d6854f7460d8"
  target="_blank"
  rel="noopener noreferrer"
  style={{ cursor: "pointer" }}
  className="text-spot-yellow"
>
  Campfire.exchange
</a>
{" "}and your Analog piece on{" "}
<a
  href="https://campfire.exchange/collections/0xbe18cf471925d683c272aafe9d1aafda99612b69"
  target="_blank"
  rel="noopener noreferrer"
  style={{ cursor: "pointer" }}
  className="text-spot-yellow"
>
  Campfire.exchange
</a>
{" "}or{" "}
<a
  href="https://nftrade.com/assets/avalanche/0xbe18cf471925d683c272aafe9d1aafda99612b69"
  target="_blank"
  rel="noopener noreferrer"
  style={{ cursor: "pointer" }}
  className="text-spot-yellow"
>
  NFTrade.com
</a>
<div className="pt-12 lg:px-16 xl:px-36"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-2xl flex justify-center"
              onClick={onClickUrl("/analog")}
            >
              Go Analog
            </button></div></div></div>
    <div className="text-white pr-10 font-mono md:pt-16 2xl:pt-4">
      <div className="flex pt-10">
      <div className="hover:scale-105 opacity-20 hover:opacity-100 duration-300"><img src={analog1} alt="Analog" className="lg:p-2 xl:p-4 m-0"></img></div>
      <div className="hover:scale-105 opacity-20 hover:opacity-100 duration-300"><img src={analog4} alt="Analog" className="lg:p-2 xl:p-4 m-0"></img></div>
      </div>
      </div>  
    </div>

    <div className="h-screen flex flex-col justify-center items-center lg:flex-row snap-start snap-always">
  {/* Image container on the left */}
  <div className="flex-1 flex justify-center items-center">
    <img src={eff} alt="EffEm" className="p-5 m-0 w-1/2"></img>
  </div>

  {/* Button and text fields container on the right */}

  <div className="flex-1 flex flex-col justify-center items-center space-y-4">
  <div className="text-white pr-2 font-mono">
      <h1 className="text-5xl md:pt-4 2xl:pt-6 pb-8"> The Ticker is $FUCKEM</h1></div>
    {/* Button 1 */}
    <button
      className="w-1/2 rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-lg flex justify-center"
      onClick={effSetApprovalForAll}
    >
      Approve To Wrap Eff_Inscriptions
    </button>

    {/* Text Field */}
    <input
      type="text"
      className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-1/2 h-12"
      placeholder="IDs to Wrap (separate IDs with a comma)"
      value={textinputText1}
      onChange={textinputUserText1.bind(this)}
    />

    {/* Button 2 */}
    <button
      className="w-1/2 rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-lg flex justify-center"
      onClick={effWrap721}
    >
      Wrap Them Up!
    </button>
  </div>
</div>

<div className="h-screen flex flex-col justify-center items-center lg:flex-row snap-start snap-always">
  {/* Image container on the left */}
  <div className="flex-1 flex justify-center items-center">
    <img src={bones} alt="Bonez" className="p-5 m-0 w-1/2"></img>
  </div>

  {/* Button and text fields container on the right */}

  <div className="flex-1 flex flex-col justify-center items-center space-y-4">
  <div className="text-white pr-2 font-mono">
      <h1 className="text-5xl md:pt-4 2xl:pt-6 pb-8"> The Ticker is $BBBNOCHILL</h1></div>
    {/* Button 1 */}
    <button
      className="w-1/2 rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-lg flex justify-center"
      onClick={setApprovalForAllBadBoneBiz}
    >
      Approve To Wrap Bad Bone Biz
    </button>
    <button
      className="w-1/2 rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-lg flex justify-center"
      onClick={setApprovalForAllNoChill}
    >
      Approve To Spend $NOCHILL
    </button>

    {/* Text Field */}
    <input
      type="text"
      className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-1/2 h-12"
      placeholder="IDs to Wrap (separate IDs with a comma)"
      value={depositAmount}
      onChange={textinputUserText2.bind(this)}
    />

    {/* Button 2 */}
    <button
      className="w-1/2 rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-lg flex justify-center"
      onClick={depositTokens}
    >
      Wrap Them Bonez Up!
    </button>

     {/* Text Field */}
     <input
      type="text"
      className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-1/2 h-12"
      placeholder="IDs to UnWrap (separate IDs with a comma)"
      value={withdrawAmount}
      onChange={textinputUserText3.bind(this)}
    />

    {/* Button 3 */}
    <button
      className="w-1/2 rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-lg flex justify-center"
      onClick={withdrawTokens}
    >
      UnWrap Them Bonez..
    </button>
  </div>


</div>

<div className="h-screen flex flex-col justify-center items-center lg:flex-row snap-start snap-always">
  {/* Image container on the left */}
  <div className="flex-1 flex justify-center items-center">
    <img src={pepe} alt="Pepe Portraits" className="p-5 m-0 w-1/2"></img>
  </div>

  {/* Button and text fields container on the right */}

  <div className="flex-1 flex flex-col justify-center items-center space-y-4">
  <div className="text-white pr-2 font-mono">
      <h1 className="text-5xl md:pt-4 2xl:pt-6 pb-8"> The Ticker is $PEPECOQ</h1></div>
    {/* Button 1 */}
    <button
      className="w-1/2 rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-lg flex justify-center"
      onClick={setApprovalForAllPepe}
    >
      Approve To Wrap Pepe Portraits
    </button>
    <button
      className="w-1/2 rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-lg flex justify-center"
      onClick={setApprovalForAllCoq}
    >
      Approve To Spend $COQ
    </button>

    {/* Text Field */}
    <input
      type="text"
      className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-1/2 h-12"
      placeholder="IDs to Wrap (separate IDs with a comma)"
      value={depositPepeAmount}
      onChange={textinputUserText4.bind(this)}
    />

    {/* Button 2 */}
    <button
      className="w-1/2 rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-lg flex justify-center"
      onClick={depositPepeTokens}
    >
      Wrap Them Pepes with $Coq!
    </button>

     {/* Text Field */}
     <input
      type="text"
      className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-1/2 h-12"
      placeholder="IDs to UnWrap (separate IDs with a comma)"
      value={withdrawPepeAmount}
      onChange={textinputUserText5.bind(this)}
    />

    {/* Button 3 */}
    <button
      className="w-1/2 rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-lg flex justify-center"
      onClick={withdrawPepeTokens}
    >
      UnWrap and get your $Coq Back..
    </button>
  </div>


</div>


  <div className="footer">
          <Footer />
        </div>
  </div>

 
  </div>
  </div>

  );
};

export default Main;
