import React, { useState, useEffect } from "react";
import LogoutButton from "../Logout";
import thespot from "../../assets/thespotmaster.png";
import goatdmain from "../../assets/goatdmain.png";
import goatddevil from "../../assets/goatddevil.png";
import analog from "../../assets/analogtitle.png";
import apechain from "../../assets/apechain.png";
import evolve from "../../assets/1.png";
import cemetery from "../../assets/Cemetery.PNG";
import unnamednft from "../../assets/logounnamed.png";
import spotbot from "../../assets/812.png";
import fragments from "../../assets/question.png";
import scribbleCardGraphic from "../../assets/scribble/CARD_PLACEHOLDER.jpg";
import goatd1 from "../../assets/BASEHEAD-Grey.png";
import goatd2 from "../../assets/MOUTH-GOLDTOOTH.png";
import goatd3 from "../../assets/EYES-WU.png";
import goatd4 from "../../assets/BODY-WU.png";
import goatd5 from "../../assets/HEADWEAR-WUHAT.png";
import Card from "../../components/MainCard";
import Card2 from "../../components/NotActiveCard";
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
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
import analog1 from "../../assets/analog/7-b.png";
import analog2 from "../../assets/analog/2.png";
import analog3 from "../../assets/analog/41.png";
import analog4 from "../../assets/anananoir.png";
import spotmobile from "../../assets/spotmobile.png";
import FlippableCard from "../../components/flippable-card";
import "../../index.css";
import Footer from "../Footer";

const Main = ({
  account,
  web3Modal,
  loadWeb3Modal,
  web3Provider,
  setWeb3Provider,
  logoutOfWeb3Modal,
  txProcessing,
  setTxProcessing,
}) => {
  const [spotsMinted, setSpotsMinted] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const onClickUrl = (url) => {
    return () => openInNewTab(url);
  };
  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

const observer = new IntersectionObserver(entries => {

})
const [explore, setExplore] = useState(false);
const [background, setBackground] = useState(false);

function exploreClick(){
  setExplore(!explore);
}

  function alertClick() {
    alert("The Evolution is Coming Soon...");
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

       
      <div className="pt-0 px-0 bg-slate-900">
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
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-4 xl:px-4 px-4 py-0 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-40
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={exploreClick}
        >
          {explore ? "Hide" : "Explore"}
        </button></div>
        <div className={`${explore ? 'absolute left-0 top-22 w-full opacity-100' : 'absolute -left-60 top-22 w-full opacity-0'} transition-all duration-500`}>
        <div className="py-2 pt-4">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 py-1 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("https://campfire.exchange/collections/0x0c6945e825fc3c80f0a1ea1d3e24d6854f7460d8")}
        >
          Genesis Collection
        </button>
        </div>
        <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-1 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("https://underground.tech")}
        >
          Spot Bot
        </button>
        </div>
        <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-1 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/goatd")}
        >
          Goatd
        </button>
        </div>
        <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-1 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/gravedigger")}
        >
          NFTombstones
        </button>
        </div><div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-1 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/unnamed")}
        >
          Unnamed Branding
        </button>
        </div><div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-1 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/analog")}
        >
          Analog
        </button>
        </div><div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-1 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/staking")}
        >
          Staking
        </button>
        </div><div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-1 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/scribble")}
        >
          Scribble Customs
        </button></div>
        <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-1 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("https://twitter.com/TheSpotUG")}
        >
          Twitter
        </button>
        </div><div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-1 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("https://discord.com/invite/4wvC6xTFyB")}
        >
          Discord
        </button>
          </div></div></div>
     
  </div>
        

 <div><img src={spotmobile} alt="Goatd" className=""></img></div>

   {/*Spot Bot */}
 
   <div className="font-mono text-3xl px-4 py-4 pt-16 text-white">Spot Bot</div>
 <div><img src={spotbot4} alt="Spot Bot" className=""></img></div>

 <div className="font-mono text-l px-4 py-2 text-white">The Spot Bots are taking over. 3k bots need to be produced in order to fire up the Sacrificial Power Obtaining Technology and then the remaining 2k bots will be produced by sacrificing other NFTs to the collective. Our gamefi offering, phase 2 will launch once 3k bots are minted, with phase 3 activating once all 5k are produced.</div>
 <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("https://underground.tech")}
        >
          Mint Spot Bot
        </button>
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
 <div><img src={analog1} alt="Goatd" className=""></img></div>

 <div className="font-mono text-l px-4 py-2 text-white">IRL artowork with a twist. dNFTs that you can alter to the variation of your choosing. Keep it orig or choose a variation? Up to you, you just need to own a genesis collection SPOT nft in order to alter the analog piece. Check it!</div>
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


      </div>



      {/* DESKTOP LAYOUT */}
    <div className="snap-container flex-auto mx-auto px-12 hidden lg:block scroll-smooth">
    
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
          onClick={onClickUrl("https://campfire.exchange/collections/0x0c6945e825fc3c80f0a1ea1d3e24d6854f7460d8")}
        >
          Genesis Collection
        </button>
        </div>
        <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("https://underground.tech")}
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
    <div className={`h-screen bg-spotbg bg-cover bg-no-repeat bg-center bg-fixed bg-slate-900 scroll-smooth snap-start ${background ? "bg-opacity-0 duration-1000" : "bg-opacity-100"}`}>

    </div>
    <div className="snap-item scroll-smooth h-screen">
      {/*Spot Explainer */}
    <div className="grid grid-cols-2 h-screen pt-24 lg:pr-10 2xl:pr-24">
    <div className="xl:pl-24 2xl:pl-36 md:pt-12 2xl:pt-24"><img src={goatdmain} alt="Goatd" className="p-5 m-0 lg:w-4/5 2xl:w-3/5 block"></img></div>
    <div className="text-white pt-10">
      <h1 className="text-5xl pt-4 pb-10 pr-12">The Spot on Avax</h1>
      <div className="lg:text-lg xl:text-xl 2xl:text-3xl lg:pt-4 2xl:pt-12 lg:pb-12 2xl:pb-24 pr-24">Come chill with us down at The Spot, where we are developing dNFTs on avalanche. Over the past 12 months we have developed multiple dNFT and customizable NFT projects. These include our first release, Goatd (Greatest of all Time Degens) and our latest release The Spot Bot. We are focusing on dNFTs and have helped artists release their projects on the avalanche blockchain implementing upgradeable and changeable NFTs. From our Analog collection which is focused on bringing irl artists to avalanche and incorporating a variation selection to NFTombstones where you can engrave your tombstone with a personal message. </div>
       <div className="px-48"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-3xl flex justify-center"
              onClick={onClickUrl("/goatd")}
            >
              Launch Goatd
            </button></div></div>
     
    </div>
  </div>
  <div className="h-screen bg-botbg bg-contain bg-no-repeat bg-center bg-fixed snap-start scroll-smooth">

</div>
  <div className="snap-item scroll-smooth">
      {/*Spot Bots */}
    <div className="h-full lg:pt-20 xl:pt-24 overflow-hidden">
    <div className="text-white pr-10">
      <h1 className="text-5xl pt-2 font-mono">The Spot Bot</h1>
      <div className="text-xl font-mono pt-8 px-24 lg:pb-8 xl:pb-8 lg:text-base xl:text-lg 2xl:text-xl">The bots are coming! As supply chains are recovering the manufacturing process has begun. The initial mint of 3k bots will happen over the span of an undetermined time, as parts are available. The first round has been released in Jan 2023, and subsequent releases are to follow. Updates will be given as they are made available. Once 3k Spot Bots are produced holders will have the opprotunity to harnes the Sacrificial Power Obtaining Technology  (SPOT) that the bots have created and produce the remaining 2k bots by sacrificing NFTs from other collections, rugged, ded or alive NFTs to have a chance at producing more bots. The more bots you hold th emore of a chance you will have at a successful sacrificial production. 1/1 Spot Bots will have a 100% production rate on NFT sacrifice. Once 5k bots are produced the true utility of the bots will be revealed. </div>
      <div className="px-96 pb-8"><button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-2xl flex justify-center"
              onClick={onClickUrl("https://underground.tech")}
            >
              Enter the Production Plant
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
      <href
        style={{ cursor: "pointer" }}
        onClick={onClickUrl("https://thespot.art")}
        className="text-spot-yellow"
      >
        {" "}
        thespot.art
      </href>{" "}
      and your Analog piece on{" "}
      <href
        style={{ cursor: "pointer" }}
        className="text-spot-yellow"
        onClick={onClickUrl(
          "https://campfire.exchange/collections/0xbe18cf471925d683c272aafe9d1aafda99612b69"
        )}
      >
        Campfire.exchange
      </href>{" "}
      or{" "}
      <href
        style={{ cursor: "pointer" }}
        className="text-spot-yellow"
        onClick={onClickUrl(
          "https://nftrade.com/assets/avalanche/0xbe18cf471925d683c272aafe9d1aafda99612b69"
        )}
      >
        NFTrade.com
      </href><div className="pt-12 lg:px-16 xl:px-36"><button
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
  <div className="footer">
          <Footer />
        </div>
  </div>

 
  </div>
  </div>

  );
};

export default Main;
