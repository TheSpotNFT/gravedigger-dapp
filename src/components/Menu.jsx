import React, { useState, useEffect } from "react";
import ReactGA from 'react-ga';
import "../index.css";
import LogoutButton from "./Logout";


ReactGA.initialize('G-YJ9C2P37P6');


const Menu = ({
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

  const onClickUrl = (url) => {
    return () => openInNewTab(url);
  };
  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_self", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  const [explore, setExplore] = useState(false);
  const [background, setBackground] = useState(false);



  function exploreClick() {
    setExplore(!explore);
  }

  function alertClick() {
    alert("The Evolution is Coming Soon...");
  }

  return (
    <div className="absolute w-0 h-0 overflow-hidden text-white">
      <div className="pt-0 px-0 bg-slate-900 block lg:hidden">
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
                onClick={onClickUrl("/channel3")}
              >
                Channel3
              </button>
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
            </div></div></div>

      </div>

      {/* Desktop
       */}
      <div className="pt-6 px-12 bg-slate-900 hidden lg:block">
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
              <button
                className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-1 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
                onClick={onClickUrl("/channel3")}
              >
                Channel3
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
            </div></div></div>

      </div>
    </div>

  );
};

export default Menu;
