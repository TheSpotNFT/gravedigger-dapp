import { stringify } from "postcss";
import React, { useEffect, useState } from "react";
import spotNFTAbi from "../contracts/spotNFTAbi.json";
import Moralis from "moralis";
import unnamedData from "../metadata";
import unnamedAbi from "../contracts/spotNFTAbi.json";
import {
  NFTOMBSTONED_ADDRESS,
  NFTOMBSTONED_ABI,
} from "./Contracts/NFTombstonedContract";
import {
  TOMBSTONE_ADDRESS,
  TOMBSTONE_ABI,
} from "./Contracts/TombstoneContract";
import { Contract, ethers } from "ethers";

export default function SendNFTombstoned(props) {
  const [textinput, setTextinput] = useState("");

  const textinputUser = (event) => {
    setTextinput(event.target.value);
  };

  async function setApprovalForAll() {
    props.setTxProcessing(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (TOMBSTONE_ABI && TOMBSTONE_ADDRESS && signer) {
          const contract = new Contract(
            TOMBSTONE_ADDRESS,
            TOMBSTONE_ABI,
            signer
          );

          let options = {
            value: ethers.utils.parseEther("0.25"),
          };

          let tx = await contract.setApprovalForAll(NFTOMBSTONED_ADDRESS, "1");
          console.log(tx.hash);
          alert(
            "NFTombstone approved to be used to get NFTombstoned!"
          );
          props.setTxProcessing(false);
        } else {
          console.log("error with contract abi, address, or signer");
        }

      }

    } catch (error) {
      console.log("Error on mint");
      console.log(error);
    } finally {
      props.setTxProcessing(false);
    }
  }

  async function getUri() {
    props.setTxProcessing(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (TOMBSTONE_ABI && TOMBSTONE_ADDRESS && signer) {
          const contract = new Contract(
            TOMBSTONE_ADDRESS,
            TOMBSTONE_ABI,
            signer
          );

          let options = {
            value: ethers.utils.parseEther("0.25"),
          };
          console.log(props.id)
          let uri = await contract.tokenURI(props.id);
          let uriFinal = uri.substring(8);
          console.log(uriFinal);
          console.log(uri.hash);
          props.setTxProcessing(false);
          await sendNFT(uriFinal);
        } else {
          console.log("error with contract abi, address, or signer");
        }

      }

    } catch (error) {
      console.log("Error on mint");
      console.log(error);
    } finally {
      props.setTxProcessing(false);
    }
  }

  async function sendNFT(uriFinal) {
    props.setTxProcessing(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (NFTOMBSTONED_ABI && NFTOMBSTONED_ADDRESS && signer) {
          const contract = new Contract(
            NFTOMBSTONED_ADDRESS,
            NFTOMBSTONED_ABI,
            signer
          );

          let options = {
            // price is 0.666 avax
            value: ethers.utils.parseEther("0.1"),
          };
          console.log(props.id, uriFinal, textinput);
          let tx = await contract.mint(props.id, uriFinal, textinput, options);
          console.log(tx.hash);
          props.setTxProcessing(false);
          alert(
            "Minted Successfully! You just NFTOMBSTONED someone!!!"
          );
        } else {
          console.log("error with contract abi, address, or signer");
        }
      }
    } catch (error) {
      console.log("Error on mint");
      console.log(error);
    } finally {
      props.setTxProcessing(false);
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
        <button
          className="m-1 w-full rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-sm"
          disabled={props.txProcesssing}
          onClick={() => setApprovalForAll()}
        >
          APPROVE NFTOMBSTONE
        </button>
        <div className="flex w-full">

          <div className="w-full flex pr-5 pl-1">

            <div className="flex pr-2 pt-2 pr-6">
              <input
                type="text"
                className="border-2 h-3/4 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 pr-4 w-40"
                placeholder="receiving address"
                value={textinput}
                onChange={textinputUser.bind(this)}
              />{" "}
            </div>

            <button
              className="m-1 w-full rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-sm"
              disabled={props.txProcesssing}
              onClick={() => getUri()}
            >
              SEND NFTOMBSTONED
            </button>
          </div>
        </div>
      </div>
    );


}
