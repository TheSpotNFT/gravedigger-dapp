import React, { useState, useEffect } from "react";
import thespot from "../../assets/thespotmaster.png";
import goatdmain from "../../assets/goatdmain.png";
import analog from "../../assets/analogtitle.png";
import apechain from "../../assets/apechain.png";
import evolve from "../../assets/1.png";
import cemetery from "../../assets/Cemetery.PNG";
import unnamednft from "../../assets/logounnamed.png";
import fragments from "../../assets/question.png";
import scribbleCardGraphic from "../../assets/scribble/scribbleMainYellow.png";
import goatd1 from "../../assets/BASEHEAD-Grey.png";
import goatd2 from "../../assets/MOUTH-GOLDTOOTH.png";
import goatd3 from "../../assets/EYES-WU.png";
import goatd4 from "../../assets/BODY-WU.png";
import goatd5 from "../../assets/HEADWEAR-WUHAT.png";
import Card from "../../components/MainCard";
import Card2 from "../../components/NotActiveCard";


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

  function alertClick() {
    alert("The Evolution is Coming Soon...");
  }
 
  return (
    <div>
      {/*<div>
      <div className="relative">
      <div className="absolute right-1/3 left-1/3"><img className="items-center" src={goatd4} alt=""></img></div>
      <div className="absolute right-1/3 left-1/3"><img className="items-center" src={goatd1} alt=""></img></div>
      <div className="absolute right-1/3 left-1/3"><img className="items-center" src={goatd2} alt=""></img></div>
      <div className="absolute right-1/3 left-1/3"><img className="items-center" src={goatd3} alt=""></img></div>
      <div className="absolute right-1/3 left-1/3"><img className="items-center" src={goatd5} alt=""></img></div>
  </div></div>*/}
      <div className="pt-8 px-9 bg-slate-900">
      <div className="w-full py-4 px-2 flex justify-center text-spot-yellow rounded overflow-hidden shadow-lg bg-slate-900">
      <button
                className="align-middle text-xl rounded-lg px-4 py-4 w-full border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l"
                onClick={onClickUrl("/learning")}
              >
                The Spot for pNFT's on Avalanche --- Learn More  --- The Educatooooor
              </button>
      </div>
</div>
    <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-10 font-mono text-spot-yellow bg-slate-900">
      <Card 
      image={thespot}
      alt="The Spot"
      title="MINTING COMPLETE"
      link="https://campfire.exchange/collections/0x0c6945e825fc3c80f0a1ea1d3e24d6854f7460d8"
      button="Buy on Secondary"
      />
       <Card 
      image={goatdmain}
      alt="GoatD: Customizable pfp"
      title="GoatD: Customizable pfp"
      link="/goatd"
      button="Enter the Transmorphisizer"
      />
       <Card 
      image={scribbleCardGraphic}
      alt="Scribble Warlock Customs"
      title="Scribble Warlock Customs"
      link="/scribble"
      button="Enter Customs"
      />
      <Card 
      image={cemetery}
      alt="The Cemetery"
      title="The Cemetery"
      link="/gravedigger"
      button="Enter The Cemetery"
      />
       <Card 
      image={analog}
      alt="Analog: 1/1 Customizable NFTs"
      title="Analog: 1/1 Customizable NFTs"
      link="/analog"
      button="Enter Analog"
      /> 
       <Card 
      image={apechain}
      alt="Spot Staking"
      title="Spot Staking"
      link="/staking"
      button="Enter Staking"
      />
       <Card 
      image={unnamednft}
      alt="Unnamed Branding"
      title="Unnamed Branding"
      link="/unnamed"
      button="Enter The Brandoooor"
      />
      {/*<Card 
      image={fragments}
      alt="Fragments"
      title="Fragments"
      link="/expand"
      button="Enter Fragments"
/>  */}
       <Card2 
      image={evolve}
      alt="Evolve"
      title="Evolve"
      link="The Evolution is Coming Soon..."
      button="Enter Evolve"
      />      
     
    </div>

    </div>
  );
};

export default Main;
