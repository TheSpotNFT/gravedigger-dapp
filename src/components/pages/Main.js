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
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

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
    <div className="container flex-auto mx-auto w-full">
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
                The Spot for zNFT's on Avalanche --- Learn More  --- The Educatooooor
              </button>
      </div>
</div>
<div className='flex relative items-center overflow-hidden z-[0]'>
        <MdChevronLeft onClick={slideLeft} size={40} className=' fill-gray-500 hover:scale-110 hover:fill-spot-yellow md:hidden sm:hidden lg:block xl:block 2xl:block' />
        <div id='slider' className="p-10 flex gap-5 xl:flex-row font-mono text-spot-yellow w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide">
          
      <div><Card 
      image={thespot}
      alt="The Spot"
      title="MINTING COMPLETE"
      link="https://campfire.exchange/collections/0x0c6945e825fc3c80f0a1ea1d3e24d6854f7460d8"
      button="Buy on Secondary"
      /></div>
       <div><Card 
      image={goatdmain}
      alt="GoatD: Customizable pfp"
      title="GoatD: Customizable pfp"
      link="/goatd"
      button="Enter the Transmorphisizer"
      /></div>
       <div><Card 
      image={scribbleCardGraphic}
      alt="Scribble Warlock Customs"
      title="Scribble Warlock Customs"
      link="/scribble"
      button="Enter Customs"
      /></div>
      <div><Card 
      image={cemetery}
      alt="The Cemetery"
      title="The Cemetery"
      link="/gravedigger"
      button="Enter The Cemetery"
      /></div>
       <div><Card 
      image={analog}
      alt="Analog: 1/1 dNFTs"
      title="Analog: 1/1 dNFTs"
      link="/analog"
      button="Enter Analog"
      /> </div>
       <div><Card 
      image={apechain}
      alt="Spot Staking"
      title="Spot Staking"
      link="/staking"
      button="Enter Staking"
      /></div>
       <div><Card 
      image={unnamednft}
      alt="Unnamed Branding"
      title="Unnamed Branding"
      link="/unnamed"
      button="Enter The Brandoooor"
      /></div>
      {/*<Card 
      image={fragments}
      alt="Fragments"
      title="Fragments"
      link="/expand"
      button="Enter Fragments"
/>  */}
       <div><Card2 
      image={evolve}
      alt="Evolve"
      title="Evolve"
      link="The Evolution is Coming Soon..."
      button="Enter Evolve"
      />  </div>  </div>  
     <div className="pl-10"><MdChevronRight onClick={slideRight} size={40} className=' fill-gray-500 hover:scale-110 hover:fill-spot-yellow md:hidden sm:hidden lg:block xl:block 2xl:block' />
</div>
    </div>

    </div>
  );
};

export default Main;
