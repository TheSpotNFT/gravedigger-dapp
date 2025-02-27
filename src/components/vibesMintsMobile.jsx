import React, { useEffect, useState } from "react";
import {
  VIBES_ADDRESS,
  VIBES_ABI,
} from "./Contracts/VibesContract";
import {
  FIRE_ADDRESS,
  FIRE_ABI,
} from "./Contracts/FireContract";
import { Contract, ethers } from "ethers";
import AVVY from '@avvy/client'

export default function VibesMintMobile(props) {

  const [textinput, setTextinput] = useState("");
  const [numberinput, setNumberinput] = useState("");


  const textinputUser = (event) => {
    setTextinput(event.target.value);
  };

  const numberinputUser = (event) => {
    setNumberinput(event.target.value);
  };

  function alertClick() {
    alert("vibes coming soon...");
  }
  const [addressLookup, setAddressLookup] = useState("");


  async function getUsername() {
    let result;
    let address;
    if (textinput.endsWith(".fire")) {
      try {

        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();

          if (FIRE_ABI && FIRE_ADDRESS && signer) {
            const contract = new Contract(FIRE_ADDRESS, FIRE_ABI, signer);
            let options = {

            };
            result = await contract.addressFor(textinput);
            setAddressLookup(result);

          }


        }
      }
      catch (error) {
        console.log(error);
      } finally {


      }
    }
    if (textinput.endsWith(".avax")) {
      const PROVIDER_URL = 'https://api.avax.network/ext/bc/C/rpc'
      const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL)
      const avvy = new AVVY(provider)
      address = await avvy.name(textinput).resolve(AVVY.RECORDS.EVM)
      setAddressLookup(address);
      console.log(address)
    }
    if (textinput.startsWith("0x")) {
      setAddressLookup(textinput);
    }

  }
  useEffect(() => {
    getUsername();
  }, [textinput])

  async function gud() {
    //props.setTxProcessing(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (VIBES_ABI && VIBES_ADDRESS && signer) {
          const contract = new Contract(
            VIBES_ADDRESS,
            VIBES_ABI,
            signer
          );

          let options = {
            // price is 0.2 avax
            value: ethers.utils.parseEther(`${numberinput * 0.2}`),
          };

          let tx = await contract.mint(addressLookup, 1, numberinput, options);
          console.log(tx.hash);
          // props.setTxProcessing(false);
          alert(
            "gudVibes Sent Successfully! Gud for you ser!"
          );
        } else {
          console.log("error with contract abi, address, or signer");
        }
      }
    } catch (error) {
      console.log("Error on mint");
      console.log(error);
    } finally {
      //props.setTxProcessing(false);
    }
  }

  async function bad() {
    //props.setTxProcessing(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (VIBES_ABI && VIBES_ADDRESS && signer) {
          const contract = new Contract(
            VIBES_ADDRESS,
            VIBES_ABI,
            signer
          );

          let options = {
            // price is 0.2 avax
            value: ethers.utils.parseEther(`${numberinput * 0.2}`),
          };

          let tx = await contract.mint(addressLookup, 2, numberinput, options);
          console.log(tx.hash);
          //props.setTxProcessing(false);
          alert(
            "badVibes Sent Successfully! You Evil!"
          );
        } else {
          console.log("error with contract abi, address, or signer");
        }
      }
    } catch (error) {
      console.log("Error on mint");
      console.log(error);
    } finally {
      //props.setTxProcessing(false);
    }
  }


  if (props.txProcessing) {
    return (
      <div>
        <button
          className="inline-flex m-1 rounded-lg px-4 py-2 border-2 border-spot-yellow text-spot-yellow
     duration-300 font-mono font-bold text-base"
          disabled
        >
          <svg className="inline animate-ping h-5 w-5 mr-3" viewBox="0 0 35 35">
            <circle
              className="path"
              cx="12"
              cy="15"
              r="10"
              fill="yellow"
              stroke="yellow"
              strokeWidth="2"
            ></circle>
          </svg>
          Processing...
        </button>
      </div>
    );
  } else
    return (
      <div className="w-full">

        <div className="w-full">

          <div className="w-full pr-5 pl-1">

            <div className="pt-2">
              <input
                type="text"
                className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 pr-4 w-52"
                placeholder=".fire/.avax or addr"
                value={textinput}
                onChange={textinputUser.bind(this)}
              />{" "}
            </div>
            <div className="pt-4 pb-4">
              <input
                type="number"
                className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 pr-4 w-24"
                placeholder="amount"
                value={numberinput}
                onChange={numberinputUser.bind(this)}
                min={0}
                max={100}
              />{" "}
            </div>

            <div className="pb-2">
              <button
                className="m-1 w-full rounded-lg px-1 py-1 border-4 border-spot-yellow text-spot-yellow
     hover:bg-green-500 hover:text-gray-900 duration-300 font-mono font-bold text-sm"
                disabled={props.txProcesssing}
                onClick={gud}
              >
                Send gudVibes
              </button></div>
            <div>
              <button
                className="m-1 w-full rounded-lg px-1 py-1 border-4 border-spot-yellow text-spot-yellow
hover:bg-red-500 hover:text-gray-900 duration-300 font-mono font-bold text-sm"
                disabled={props.txProcesssing}
                onClick={bad}
              >
                Send badVibes
              </button></div>
          </div>
          <div className="text-white font-mono pt-2 text-xs">Address: {addressLookup.startsWith("0x") ? addressLookup : ""}</div>
        </div>



      </div>

    );


}
