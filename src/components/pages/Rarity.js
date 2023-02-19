import React, { useState, useEffect } from "react";
import LogoutButton from "../Logout";
import thespot from "../../assets/thespotmaster.png";
import goatdmain from "../../assets/goatdmain.png";
import goatddevil from "../../assets/goatddevil.png";
import analogimage from "../../assets/analog/41-1.png";
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
import Card from "../MainCard";
import Card2 from "../NotActiveCard";
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
import FlippableCard from "../flippable-card";
import "../../index.css";
import Footer from "../Footer";
import rarityData from '../../spotBotRarity.json';

const Rarity = ({
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
          onClick={onClickUrl("/")}
        >
          Home
        </button>
        </div>
        <div className="py-2">
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
  <div className="text-4xl text-white font-mono pt-8 pb-8">The Spot Bot Rarity Listing (Basic)</div>
  <div className="text-2xl text-white font-mono pt-8 pb-8">More advanced rarity tool coming soon...</div>
  <div className="text-white font-mono text-xl">
      {rarityData.map((item) => (
        <div key={`${item.attributeValue}-${item.value}`}>
          <div>{`${item.attributeValue}: ${item.value}: `} 
          {item.count}</div>
        </div>
      ))}
    </div>
  <div className="footer">
          <Footer />
        </div>
  </div>

 
  </div>


  );
};

export default Rarity;
