import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers, Contract } from "ethers";
import { ANALOG_ABI, ANALOG_ADDRESS } from '../components/Contracts/AnalogAbi';
import { useAuth } from "../Auth";

function Card(
  props,
  txProcessing,
  setTxProcessing,
) {
  const {
    account,
    web3Modal,
    loadWeb3Modal,
    web3Provider,
    setWeb3Provider,
    logoutOfWeb3Modal,
    // ... any other states or functions you need ...
  } = useAuth();
  const [variation, setVariation] = useState(props.image1);
  const [variationSelection, setVariationSelection] = useState("1");
  const analogContract = "0xBe18CF471925d683c272AAFe9d1aaFDA99612B69";
  const userAddress = account;
  const [isLoading, setIsLoading] = useState([]);
  const [variation2, setVariation2] = useState([]);

  function showVariation() {
    if (props.variations === "2") {
      setVariation2(false);
    } else setVariation2(true);
  }
  console.log(variation2);

  function changeVariation1() {
    setVariation(props.image1);
    setVariationSelection("1");
  }
  function changeVariation2() {
    setVariation(props.image2);
    setVariationSelection("2");
  }
  function changeVariation3() {
    setVariation(props.image3);
    setVariationSelection("3");
  }
  function changeVariation4() {
    setVariation(props.image4);
    setVariationSelection("4");
  }

  async function commitVar() {
    //setTxProcessing(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (ANALOG_ABI && ANALOG_ADDRESS && signer) {
          const contract = new Contract(ANALOG_ADDRESS, ANALOG_ABI, signer);
          let options = {
            value: ethers.utils.parseEther("1"),
          };
          console.log(props.id, variationSelection);


          let tx = await contract.changeVariation(props.id, variationSelection, options);
          console.log(tx.hash);
          //setTxProcessing(false);
          alert(
            "Variation Committed! Check out your NFT on Campfire, Kalao or Joepegs!"
          );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      //setTxProcessing(false);
    }
  }

  return (
    <div
      className="w-full rounded overflow-hidden shadow-lg bg-slate-700 hover: hover:scale-105 hover:bg-slate-500 duration-300"
      onMouseLeave={changeVariation1}
    >
      <img className="w-full" src={variation} alt={props.nftName}></img>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">
          <h3>NFT Name: {props.nftName}</h3>
        </div>
        <div className="text-slate-50 text-base">
          <h5>ID: {props.id}</h5>
          <div className="font-mono text-white list-none flex pb-3"></div>
          <div className="flex flex-col grid gap-4 grid-cols-4 py-6 place-contents-center">
            <button
              className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l flex justify-center"

              onClick={changeVariation1}
            >
              1
            </button>
            <button
              className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l flex justify-center"

              onClick={changeVariation2}
            >
              2
            </button>
            <div className={props.variations === "2" ? "hidden" : "flex grid gap-4"}>
              <button
                className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l flex justify-center"

                onClick={changeVariation3}
              >
                3
              </button></div>
            <div className={props.variations === "2" ? "hidden" : "flex grid gap-4"}>
              <button
                className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l flex justify-center"

                onClick={changeVariation4}
              >
                4
              </button></div>
          </div>
          <div className="flex grid grid-cols-1 justify-center">

            <h5></h5> <button
              className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l flex justify-center"

              onClick={commitVar}
            >
              Click to Commit Variation {variationSelection}
            </button>
          </div>
        </div>
      </div>
      <div className="px-6 pt-4 pb-2"></div>
    </div>
  );
}
export default Card;
