import React, { useState, useEffect } from "react";
import thespot from "../../assets/thespotmaster.png";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import goatdmain from "../../assets/goatdmain.png";
import analog from "../../assets/analogtitle.png";
import apechain from "../../assets/apechain.png";
import evolve from "../../assets/1.png";
import cemetery from "../../assets/Cemetery.PNG";
import unnamednft from "../../assets/logounnamed.png";
import fragments from "../../assets/question.png";


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
  const { Moralis } = useMoralis();
  const { authenticate } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();
  const [spotsMinted, setSpotsMinted] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const onClickUrl = (url) => {
    return () => openInNewTab(url);
  };
  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };



  async function getNumberMinted() {
    const ABI = [
      {
        inputs: [],
        name: "nftCount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ];

    const nftCountOptions = {
      chain: "avalanche",
      address: "0x0c6945e825fc3c80f0a1ea1d3e24d6854f7460d8",
      function_name: "nftCount",
      abi: ABI,
      params: {},
    };
    const nftsMinted = await Moralis.Web3API.native.runContractFunction(
      nftCountOptions
    );
    setSpotsMinted(nftsMinted);
  }

  function alertClick() {
    alert("The Evolution is Coming Soon...");
  }
  function alertClick1() {
    alert("The Cemetery is Coming Soon...");
  }


  return (
    <div>
      <div className="pt-8 px-9 bg-slate-900">
      <div className="w-full py-4 px-2 flex justify-center text-spot-yellow rounded overflow-hidden shadow-lg bg-slate-900">
      <button
                className="align-middle text-xl rounded-lg px-4 py-4 w-full border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l"
                onClick={onClickUrl("/learning")}
              >
                Learn More --- The Educatooooor
              </button>
      </div>
</div>
    <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 xxl:grid-cols-6 gap-10 font-mono text-spot-yellow bg-slate-900">
      <div className="w-full rounded overflow-hidden shadow-lg bg-slate-700 hover: hover:scale-105 hover:bg-slate-500 duration-300">
        <img className="w-full" src={thespot} alt=""></img>
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2 flex justify-center">
            <h1>MINTING COMPLETE</h1>
          </div>

          <div className="text-slate-50 text-base">
            <div className="flex flex-col grid gap-4 grid-cols-1 px-4 py-4 place-contents-center">
              <button
                className="align-middle rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l flex justify-center"
                onClick={onClickUrl("https://campfire.exchange/collections/0x0c6945e825fc3c80f0a1ea1d3e24d6854f7460d8")}
              >
                Buy on Secondary
              </button>
          
            </div>
          </div>
        </div>
      </div>

      


      <div className="w-full rounded overflow-hidden shadow-lg bg-slate-700 hover: hover:scale-105 hover:bg-slate-500 duration-300">
        <img className="w-full" src={goatdmain} alt=""></img>
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2 flex justify-center">
            <h1>GoatD: Customizable pfp</h1>
          </div>
          <div className="text-slate-50 text-base">
            <div className="flex flex-col space-y-4 py-4">
              <button
                className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l"
                onClick={onClickUrl("https://thespot.wtf")}
              >
                Enter the Transmorphisizer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full rounded overflow-hidden shadow-lg bg-slate-700 hover: hover:scale-105 hover:bg-slate-500 duration-300">
        <img className="w-full" src={analog} alt=""></img>
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2 flex justify-center">
            <h1>Analog: 1/1 Customizable NFTs</h1>
          </div>
          <div className="text-slate-50 text-base">
            <div className="flex flex-col space-y-4 py-4">
              <button
                className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l"
                onClick={onClickUrl("/analog")}
              >
                Enter Analog
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full rounded overflow-hidden shadow-lg bg-slate-700 hover: hover:scale-105 hover:bg-slate-500 duration-300">
        <img className="w-full" src={apechain} alt=""></img>
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2 flex justify-center">
            <h1>Spot Staking</h1>
          </div>
          <div className="text-slate-50 text-base">
            <div className="flex flex-col space-y-4 py-4">
              <button
                className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l"
                onClick={onClickUrl("/staking")}
              >
                Enter Staking
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full rounded overflow-hidden shadow-lg bg-slate-700 hover: hover:scale-105 hover:bg-slate-500 duration-300">
        <img className="w-full" src={unnamednft} alt=""></img>
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2 flex justify-center">
            <h1>Unnamed Branding</h1>
          </div>
          <div className="text-slate-50 text-base">
            <div className="flex flex-col space-y-4 py-4">
              <button
                className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l"
      onClick={onClickUrl("/unnamed")}
              >
                Enter The Brandoooor
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full rounded overflow-hidden shadow-lg bg-slate-700 hover: hover:scale-105 hover:bg-slate-500 duration-300">
        <img className="w-full" src={cemetery} alt=""></img>
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2 flex justify-center">
            <h1>The Cemetery</h1>
          </div>
          <div className="text-slate-50 text-base">
            <div className="flex flex-col space-y-4 py-4">
              <button
                className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l"
      onClick={onClickUrl("/gravedigger")}
              >
                Enter The Cemetery
              </button>
            </div>
          </div>
        </div>
      </div>
     {/* <div className="w-full rounded overflow-hidden shadow-lg bg-slate-700 hover: hover:scale-105 hover:bg-slate-500 duration-300">
        <img className="w-full" src={fragments} alt=""></img>
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2 flex justify-center">
            <h1>Fragments</h1>
          </div>
          <div className="text-slate-50 text-base">
            <div className="flex flex-col space-y-4 py-4">
              <button
                className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l"
                onClick={onClickUrl("/expand")}
              >
                Enter Fragments
              </button>
            </div>
          </div>
        </div>
      </div> 
      */}
      <div className="w-full rounded overflow-hidden shadow-lg bg-slate-700 hover: hover:scale-105 hover:bg-slate-500 duration-300">
        <img className="w-full" src={evolve} alt=""></img>
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2 flex justify-center">
            <h1>Evolve</h1>
          </div>
          <div className="text-slate-50 text-base">
            <div className="flex flex-col space-y-4 py-4">
              <button
                className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l"
                onClick={alertClick}
              >
                Enter Evolve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    </div>
  );
};

export default Main;
