import { React, useEffect, useState } from 'react'
import spot from "../../assets/TheSpot.png"
import tombstone from "../../assets/tombstone1.png"
import goatd from "../../assets/goatdmacho.png"
import spotbot from "../../assets/spotbot/7.png"
import ReactGA from 'react-ga';
import LogoutButton from "../Logout";


const onClickUrl = (url) => {
  return () => openInNewTab(url);
};
const openInNewTab = (url) => {
  const newWindow = window.open(url, "_self", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};


ReactGA.initialize('G-YJ9C2P37P6');

export default function Ecosystem({
  account,
  web3Modal,
  loadWeb3Modal,
  web3Provider,
  setWeb3Provider,
  logoutOfWeb3Modal,
}) {


  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  const [explore, setExplore] = useState(false);
  const [background, setBackground] = useState(false);

  function exploreClick() {
    setExplore(!explore);
  }

  return (
    <div className='text-white h-full'>
      {/* Tailblocks Theme */}
      <div className="pt-4 px-4 bg-slate-900">
        <div className="pt-0 px-0 bg-slate-900">
          <div className="fixed">
          </div>

        </div>
      </div>
      {/* Mobile Layout */}
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
                  onClick={onClickUrl('/ecosystem')}
                >
                  Eco-System
                </button>
              </div>
              <div className="py-2">
                <button
                  className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 py-1 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
                  onClick={onClickUrl("https://campfire.exchange/collections/0x0c6945e825fc3c80f0a1ea1d3e24d6854f7460d8")}
                >
                  Genesis Collection
                </button>
              </div>
              <div className="py-2">
                <a href="/#spotbotmobile">
                  <button
                    className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-1 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
                    onClick={exploreClick}
                  >
                    Spot Bot
                  </button></a>
              </div>
              <div className="py-2">
                <a href="/#vibesmobile">
                  <button
                    className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-1 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
                    onClick={exploreClick}
                  >
                    Vibes
                  </button></a>
              </div>
              <div className="py-2">
                <button
                  className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-1 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
                  onClick={
                    onClickUrl("/goatd")

                  }
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
              </div></div></div></div>

        <div className="lg:text-left sm:text-center">
          <h1 className='text-5xl  font-mono uppercase text-yellow-400 mt-10 pt-4 pb-10 lg:text-left sm:text-center'>The Spot Underground <p>Eco-System</p></h1>
        </div>
        <div className="lg:text-left sm:text-center pb-8">
          <h1 className='text-2xl  font-mono uppercase text-yellow-400 lg:text-left sm:text-center'>Overview: More details dropping soooon...</h1>
        </div>
        <div id="3" className='flex items-center px-8 pb-14 pt-12'> <img src={spot} alt="The Spot dNFT" className='w-full rounded-lg' /></div>
        <div className="w-32 h-32 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
          <h1 className='font-mono text-4xl' onClick={onClickUrl("https://joepegs.com/item/avalanche/0x26daeb5eda7bbb8b12d05764502d832feeda45ea/1")}>Spot</h1>
        </div>
        <div className="flex flex-col items-center text-center justify-center">
          <h2 className="font-medium title-font mt-4 text-white text-lg">Genesis Collection</h2>
          <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
          <p className="text-yellow-400 text-lg font-bold">Enabling</p>
        </div>
        <div className="sm:w-full sm:pl-8 sm:py-8 sm:pr-8 mt-34 pt-4 sm:mt-0 text-center sm:text-left col-span-4">
          <p className="leading-relaxed text-xl text-justify mb-4">Access to The Spot. With this token you unlock our Eco-system. Your community. Your people.</p>
        </div>


        <div id="3" className='flex items-center px-8 pb-14'> <img src={tombstone} alt="Tombstone NFT" className='w-full rounded-lg' /></div>
        <div className="w-32 h-32 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
          <h1 className='font-mono text-4xl'>NFTombstone</h1>
        </div>
        <div className="flex flex-col items-center text-center justify-center">
          <h2 className="font-medium title-font mt-4 text-white text-lg">Your Plot</h2>
          <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
          <p className="text-yellow-400 text-lg font-bold">Home Base</p>
        </div>
        <div className="sm:w-full sm:pl-8 sm:py-8 sm:pr-8 mt-34 pt-4 sm:mt-0 text-center sm:text-left col-span-4">
          <p className="leading-relaxed text-xl text-justify mb-4">Your plot, The Spot. Your NFTombstone is customizable and represents your location at The Spot. (Plots coming Q4) </p>
        </div>

        <div id="3" className='flex items-center px-8 pb-14'> <img src={goatd} alt="Goatd NFT" className='w-full rounded-lg' /></div>
        <div className="w-32 h-32 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
          <h1 className='font-mono text-4xl'>Goatd</h1>
        </div>
        <div className="flex flex-col items-center text-center justify-center">
          <h2 className="font-medium title-font mt-4 text-white text-lg">Your Underground PFP</h2>
          <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
          <p className="text-yellow-400 text-lg font-bold">Represent</p>
        </div>
        <div className="sm:w-full sm:pl-8 sm:py-8 sm:pr-8 mt-34 pt-4 sm:mt-0 text-center sm:text-left col-span-4">
          <p className="leading-relaxed text-xl text-justify mb-4">Your identity at The Spot. <a className="font-bold" href="/goatd">Get yours with the transmorphisizer here.</a> Collect the traits that represent you and build your underground pfp.</p>
        </div>

        <div id="3" className='flex items-center px-8 pb-14'> <img src={spotbot} alt="Spot Bot Avax NFT" className='w-full rounded-lg' /></div>
        <div className="w-32 h-32 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
          <h1 className='font-mono text-4xl'>Spot Bot</h1>
        </div>
        <div className="flex flex-col items-center text-center justify-center">
          <h2 className="font-medium title-font mt-4 text-white text-lg">Ready Player 1?</h2>
          <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
          <p className="text-yellow-400 text-lg font-bold">Gamification</p>
        </div>
        <div className="sm:w-full sm:pl-8 sm:py-8 sm:pr-8 mt-34 pt-4 sm:mt-0 text-center sm:text-left col-span-4">
          <p className="leading-relaxed text-xl text-justify mb-4">The utility at The Spot. Use your Spot Bot for tasks at The Spot.</p>
        </div>


        <div className="w-32 h-32 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
          <h1 className='font-mono text-4xl'>Ur Wallet's Wallet</h1>
        </div>
        <div className="flex flex-col items-center text-center justify-center">
          <h2 className="font-medium title-font mt-4 text-white text-lg">Storage</h2>
          <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
          <p className="text-yellow-400 text-lg font-bold">What's in your wallet?</p>
        </div>
        <div className="sm:w-full sm:pl-8 sm:py-8 sm:pr-8 mt-34 pt-4 sm:mt-0 text-center sm:text-left col-span-4">
          <p className="leading-relaxed text-xl text-justify mb-4">To be released in Q1 24, ur wallet's wallet will be your wallet at The Spot. Without ur wallet's wallet you won't be able to store any underground assets as they roll out. More details to be released as we get closer to mint.</p>
        </div>


        <div className="w-32 h-32 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
          <h1 className='font-mono text-4xl'>Vibes</h1>
        </div>
        <div className="flex flex-col items-center text-center justify-center">
          <h2 className="font-medium title-font mt-4 text-white text-lg">Asset</h2>
          <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
          <p className="text-yellow-400 text-lg font-bold">gudVibes?</p>
        </div>
        <div className="sm:w-full sm:pl-8 sm:py-8 sm:pr-8 mt-34 pt-4 sm:mt-0 text-center sm:text-left col-span-4">
          <p className="leading-relaxed text-xl text-justify mb-4">Currency. gudVibe tokens are The Spot's currency. You can send gudVibes to other wallets and you can transfer gudVibes from your wallet to another. gudVibes are on any ERC-1155 compatible NFT marketplace and can be traded there. Watch out for badVibes.</p>
        </div>


      </div>

      {/* Desktop Layout */}
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
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
                  onClick={onClickUrl('/ecosystem')}
                >
                  Eco-System
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
                <a href="/#vibes">
                  <button
                    className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
                    onClick={exploreClick}
                  >
                    Vibes
                  </button></a>
              </div>
              <div className="py-2">
                <a href="/#spotbot">
                  <button
                    className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
                    onClick={exploreClick}
                  >
                    Spot Bot
                  </button></a>
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
              </div></div></div></div>
        <section className="text-gray-400 body-font font-mono">
          <div className="container px-5 py-10 mx-auto flex flex-col">
            <div className="lg:w-4/6 mx-auto">
              <div className="lg:text-left sm:text-center">
                <h1 className='text-5xl  font-mono uppercase text-yellow-400 mt-10 pt-10 pb-10 lg:text-left sm:text-center'>The Spot Underground Eco-System</h1>
              </div>
              <div className="lg:text-left sm:text-center">
                <h1 className='text-2xl  font-mono uppercase text-yellow-400 lg:text-left sm:text-center'>Overview: More details dropping soooon...</h1>
              </div>
              {/* Q1 */}



              <div className="flex flex-col sm:flex-row mt-10">
                <div id="1" className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                  <div className="w-32 h-32 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
                    <h1 className='font-mono text-4xl cursor-pointer' onClick={onClickUrl("https://campfire.exchange/collections/0x0c6945e825fc3c80f0a1ea1d3e24d6854f7460d8")}>Spot</h1>
                  </div>
                  <div className="flex flex-col items-center text-center justify-center">
                    <h2 className="font-medium title-font mt-4 text-white text-lg">Genesis Collection</h2>
                    <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
                    <p className="text-yellow-400 text-lg font-bold">Enabling</p>
                  </div>
                </div>
                <div id="2" className='grid md:grid-cols-5'>
                  <div className="sm:w-full sm:pl-8 sm:py-8 sm:pr-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-34 pt-4 sm:mt-0 text-center sm:text-left col-span-4">
                    <p className="leading-relaxed text-xl text-justify mb-4">Access to The Spot. With this token you unlock our Eco-system. Your community. Your people.</p>
                  </div>
                  <div id="3" className='flex items-center'> <img src={spot} alt="The Spot dNFT" className='w-full rounded-lg' /></div>
                </div>
              </div>

            </div>
          </div>
        </section>
        {/* Q3 */}
        <section className="text-gray-400 body-font  font-mono">
          <div className="container px-5 py-10 mx-auto flex flex-col">
            <div className="lg:w-4/6 mx-auto">
              <div className="flex flex-col sm:flex-row mt-1">
                <div className="sm:w-1/3 text-center sm:pr-20 sm:py-8">
                  <div className="w-32 h-32 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
                    <h1 className='font-mono text-4xl cursor-pointer' onClick={onClickUrl("https://campfire.exchange/collections/0xe3525413c2a15daec57c92234361934f510356b8/minting")}>NFTombstone</h1>
                  </div>
                  <div className="flex flex-col items-center text-center justify-center">
                    <h2 className="font-medium title-font mt-4 text-white text-lg">Your Plot</h2>
                    <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
                    <p className="text-yellow-400 text-lg font-bold">Home Base</p>
                  </div>
                </div>
                <div className='grid grid-cols-5'>
                  <div className="sm:w-full sm:pr-8 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-34 pt-4 sm:mt-0 text-center sm:text-left col-span-4">
                    <p className="leading-relaxed text-xl mb-4 text-justify">Your plot, The Spot. Your NFTombstone is customizable and represents your location at The Spot. (Plots coming Q4)</p>
                  </div>
                  <div className='flex items-center'> <img src={tombstone} alt="Tombstone dNFT" className='w-full rounded-lg' /></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Q2 */}
        <section className="text-gray-400 body-font  font-mono">
          <div className="container px-5 py-10 mx-auto flex flex-col">
            <div className="lg:w-4/6 mx-auto">
              <div className="flex flex-col sm:flex-row mt-1">
                <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                  <div className="w-32 h-32 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
                    <h1 className='font-mono text-4xl cursor-pointer' onClick={onClickUrl("https://joepegs.com/collections/avalanche/0x9455aa2af62b529e49fbfe9d10d67990c0140afc")}>Goatd</h1>
                  </div>
                  <div className="flex flex-col items-center text-center justify-center">
                    <h2 className="font-medium title-font mt-4 text-white text-lg">Your Underground PFP</h2>
                    <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
                    <p className="text-yellow-400 text-lg font-bold">Represent</p>
                  </div>
                </div>
                <div className='grid grid-cols-5'>
                  <div className="sm:w-full sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-34 pt-4 sm:mt-0 text-center sm:text-left sm:pr-8 col-span-4">
                    <p className="leading-relaxed text-xl mb-4 text-justify">Your identity at The Spot. <a className="font-bold" href="/goatd">Get yours with the transmorphisizer here.</a> Collect the traits that represent you and build your underground pfp.</p>
                  </div>
                  <div className='flex items-center'> <img src={goatd} alt="Goatd NFT" className='w-full rounded-lg' /></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Q3 */}
        <section className="text-gray-400 body-font  font-mono">
          <div className="container px-5 py-10 mx-auto flex flex-col">
            <div className="lg:w-4/6 mx-auto">
              <div className="flex flex-col sm:flex-row mt-1">
                <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                  <div className="w-32 h-32 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
                    <h1 className='font-mono text-4xl cursor-pointer' onClick={onClickUrl("https://underground.tech/")}>Spot Bot</h1>
                  </div>
                  <div className="flex flex-col items-center text-center justify-center">
                    <h2 className="font-medium title-font mt-4 text-white text-lg">Ready Player 1?</h2>
                    <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
                    <p className="text-yellow-400 text-lg font-bold">Gamification</p>
                  </div>
                </div>
                <div className='grid grid-cols-5'>
                  <div className="sm:w-full sm:pr-8 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-34 pt-4 sm:mt-0 text-center sm:text-left col-span-4">
                    <p className="leading-relaxed text-xl mb-4 text-justify">The utility at The Spot. Use your Spot Bot for tasks at The Spot. (SOON)</p>
                  </div>
                  <div className='flex items-center'> <img src={spotbot} alt="Spot Bot NFT" className='w-full rounded-lg' /></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Q3 */}
        <section className="text-gray-400 body-font  font-mono">
          <div className="container px-5 py-10 mx-auto flex flex-col">
            <div className="lg:w-4/6 mx-auto">
              <div className="flex flex-col sm:flex-row mt-1">
                <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                  <div className="w-32 h-32 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
                    <h1 className='font-mono text-4xl'>Ur Wallet's Wallet</h1>
                  </div>
                  <div className="flex flex-col items-center text-center justify-center">
                    <h2 className="font-medium title-font mt-4 text-white text-lg">Storage</h2>
                    <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
                    <p className="text-yellow-400 text-lg font-bold">What's in your wallet?</p>
                  </div>
                </div>
                <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-34 pt-4 sm:mt-0 text-center sm:text-left">
                  <p className="leading-relaxed text-xl mb-4 text-justify">To be released in Q1 24, ur wallet's wallet will be your wallet at The Spot. Without ur wallet's wallet you won't be able to store any underground assets as they roll out. More details to be released as we get closer to mint.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Q3 */}
        <section className="text-gray-400 body-font  font-mono">
          <div className="container px-5 py-10 mx-auto flex flex-col">
            <div className="lg:w-4/6 mx-auto">
              <div className="flex flex-col sm:flex-row mt-1">
                <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                  <div className="w-32 h-32 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
                    <h1 className='font-mono text-4xl cursor-pointer' onClick={onClickUrl("https://joepegs.com/item/avalanche/0x26daeb5eda7bbb8b12d05764502d832feeda45ea/1")}>Vibes</h1>
                  </div>
                  <div className="flex flex-col items-center text-center justify-center">
                    <h2 className="font-medium title-font mt-4 text-white text-lg">Asset</h2>
                    <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
                    <p className="text-yellow-400 text-lg font-bold">gudVibes?</p>
                  </div>
                </div>
                <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-34 pt-4 sm:mt-0 text-center sm:text-left">
                  <p className="leading-relaxed text-xl mb-4 text-justify">Currency. gudVibe tokens are The Spot's currency. You can send gudVibes to other wallets and you can transfer gudVibes from your wallet to another. gudVibes are on any ERC-1155 compatible NFT marketplace and can be traded there. Watch out for badVibes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className='flex w-full pb-8 pt-8'><div className="px-4"><img src={spot} alt="Spot NFT" className='w-96 rounded-lg' /></div><div className="px-4"><img src={tombstone} alt="Tombstone dNFT" className='w-96 rounded-lg' /></div><div className="px-4"><img src={goatd} alt="Goatd cNFT" className='w-96 rounded-lg' /></div><div className="px-4"><img src={spotbot} alt="Spot Bot NFT" className='w-96 rounded-lg' /></div></div>
      </div></div>
  )
}
