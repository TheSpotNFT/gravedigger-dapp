import React, { useContext, useEffect, useState } from "react";
import { STAKING_ABI, STAKING_ADDRESS } from "../components/Contracts/StakingAbi"
import axios from "axios";
import { ethers, Contract } from "ethers";


//Production
function Card(
  props,
  account,
  txProcessing,
  setTxProcessing,
  web3Provider,
) {
  const isAuthenticated = Boolean(account);
  const userAddress = account;
  const chain = "avalanche";
  //mainnet address const spotContract = "0x0C6945E825fc3c80F0a1eA1d3E24d6854F7460d8";
  //testnet address const stakingContract = "0xAf8c4E9c77df06245F3718977f67a60CA7EAfF3D";
  const spotContract = "0x0C6945E825fc3c80F0a1eA1d3E24d6854F7460d8"; //mainnet
  const stakingContract = "0xfe5C0c66986Be8Fb16A5186Fd047eb035468db74"; //mainnet
  const [spotNftCount, setSpotNftCount] = useState([]);
  const [nftContractCount, setNftContractCount] = useState([]);
  const [timeLeftSecs, setTimeLeftSecs] = useState([]);
  const [displayTime, setDisplayTime] = useState([]);
  const [userClaimed, setUserClaimed] = useState(["0"]);
  const [claimButton, setClaimButton] = useState([]);
  const [stakeButton, setStakeButton] = useState([]);
  //const [userStaked, setUserStaked] = useState([]);
  //const [userStaking, setUserStaking] = useState([]);
  //const userStaked = "0";
  //const userStaking = "0";
  const [updateTimeButton, setUpdateTimeButton] = useState([]);
  const [isLoading, setIsLoading] = useState([]);
  const [NFTsRemaining, setNFTsRemaining] = useState([]);
  const [hide, setHide] = useState([]);
  const [display, setDisplay] = useState([]);

  //timefetch
  //setTxProcessing not a function error?
  async function getTimeLeft() {
    //setTxProcessing(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (STAKING_ABI && STAKING_ADDRESS && signer) {
          const contract = new Contract(STAKING_ADDRESS, STAKING_ABI, signer);

          let timeRemaining = await contract.timeUntilClaimable(props.account, props.contract, props.contractIndex);

          setTimeLeftSecs(timeRemaining.toNumber());

          let d = Math.floor(timeRemaining / (3600 * 24));
          let h = Math.floor((timeRemaining % (3600 * 24)) / 3600);
          let m = Math.floor((timeRemaining % 3600) / 60);
          let s = Math.floor(timeRemaining % 60);

          if (h > 0 || m > 0 || s > 0) {
            return setDisplayTime(`${d}d:${h}h:${m}m:${s}s`);
          } else {
            return setDisplayTime("Start Staking!");
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {

    }
  }



  //MORALIS
  /*async function getTimeLeft() {
    const options = {
      chain: chain,
      address: stakingContract,
      function_name: "timeUntilClaimable",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_account",
              type: "address",
            },
            {
              internalType: "address",
              name: "_contract",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_contractIndex",
              type: "uint256",
            },
          ],
          name: "timeUntilClaimable",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      params: {
        _account: userAddress,
        _contract: props.contract,
        _contractIndex: props.contractIndex,
      },
    };

    const timeRemaining = await Moralis.Web3API.native.runContractFunction(
      options
    );

    setTimeLeftSecs(timeRemaining);

    let d = Math.floor(timeRemaining / (3600 * 24));
    let h = Math.floor((timeRemaining % (3600 * 24)) / 3600);
    let m = Math.floor((timeRemaining % 3600) / 60);
    let s = Math.floor(timeRemaining % 60);

    if (h > 0 || m > 0 || s > 0) {
      return setDisplayTime(`${d}d:${h}h:${m}m:${s}s`);
    } else {
      return setDisplayTime("Start Staking!");
    }
  }
*/

  async function getUserClaimed() {
    //setTxProcessing(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (STAKING_ABI && STAKING_ADDRESS && signer) {
          const contract = new Contract(STAKING_ADDRESS, STAKING_ABI, signer);
          let hasClaimed = await contract.userToIndexClaimed(props.account, props.masterIndex);
          setUserClaimed(hasClaimed.toNumber());
          if (userClaimed === 0 && timeLeftSecs === 0) {
            return setDisplay(
              <div>
                <div className="flex flex-col space-y-4 py-4">
                  <button
                    className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
 font-mono text-l"
                  >
                    Staking Complete
                  </button>

                  <button
                    className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l"
                    onClick={claim}
                  >
                    Claim
                  </button>

                </div>
              </div>
            )
          }
          else if (userClaimed === 0 && timeLeftSecs < props.stakingTimeSecs) {
            return setDisplay(
              <div>
                <div className="flex flex-col space-y-4 py-4">
                  <button
                    className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow hover:bg-spot-yellow hover:text-black duration-300 hover:border-white 
 font-mono text-l"
                    onClick={stake}
                  >
                    Stake
                  </button>

                  <button
                    className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l"
                    onClick={getTimeLeft}
                  >
                    Update Time Remaining
                  </button>

                  <button
                    className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l"
                    onClick={claim}
                  >
                    Claim
                  </button>

                </div>
              </div>
            )
          }
          else
            if (userClaimed === 0) {
              return setDisplay(
                <div>
                  <div className="flex flex-col space-y-4 py-4">
                    <button
                      className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l"
                      onClick={stake}
                    >
                      Stake
                    </button>

                    <button
                      className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l"
                      onClick={getTimeLeft}
                    >
                      Update Time Remaining
                    </button>

                    <button
                      className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l"
                      onClick={claim}
                    >
                      Claim
                    </button>

                  </div>
                </div>
              )
            }
            else if (userClaimed === 1) {
              return setDisplay(<div className="flex flex-col space-y-4 py-4">
                <button
                  className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
font-mono text-l"
                >
                  Claimed
                </button>
              </div>)
            }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  useEffect(() => {
    getUserClaimed();
  }, []);


  async function getNFTsRemaining() {
    //setTxProcessing(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const balanceOfAbi = [
          {
            inputs: [
              { internalType: "address", name: "account", type: "address" },
              { internalType: "uint256", name: "id", type: "uint256" },
            ],
            name: "balanceOf",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
          },
        ];
        if (balanceOfAbi && STAKING_ADDRESS && signer) {
          const contract = new Contract(props.rewardContract, balanceOfAbi, signer);

          let NFTsLeft = await contract.balanceOf(stakingContract, props.stakingTokenId);
          setNFTsRemaining(parseInt(NFTsLeft, 16));
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      //setTxProcessing(false);
    }
  }

  /* MORALIS
  async function getNFTsRemaining() {
    const options = {
      chain: chain,
      address: props.rewardContract,
      function_name: "balanceOf",
      abi: [
        {
          inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
          ],
          name: "balanceOf",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
      ],
      params: {
        account: stakingContract,
        id: props.stakingTokenId,
      },
    };
    const NFTsLeft = await Moralis.Web3API.native.runContractFunction(options);
    setNFTsRemaining(NFTsLeft);
  }*/

  async function stake() {
    props.setTxProcessing(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (STAKING_ABI && STAKING_ADDRESS && signer) {
          const contract = new Contract(STAKING_ADDRESS, STAKING_ABI, signer);

          let staking = await contract.stake(props.contract, props.contractIndex);

          props.setTxProcessing(false);

        }
      }
    } catch (error) {
      console.log(error);

    } finally {
      props.setTxProcessing(false);
    }
  }

  /* MORALIS
    async function stake() {
      let options = {
        contractAddress: stakingContract,
        functionName: "stake",
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "_contract",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "_contractIndex",
                type: "uint256",
              },
            ],
            name: "stake",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        params: {
          _contract: props.contract,
          _contractIndex: props.contractIndex,
        },
      };
  
      await contractProcessor.fetch({
        params: options,
        onError: (err) => {
          setIsLoading(false);
          alert(JSON.stringify(err.data.message));
        },
        onSuccess: (tx) => {
          tx.wait(5)
            .then(alert("Staking Successful"))
            .then(setIsLoading(false))
            .then(console.log(tx));
        },
      });
    }
  */
  async function claim() {
    //setTxProcessing(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (STAKING_ABI && STAKING_ADDRESS && signer) {
          const contract = new Contract(STAKING_ADDRESS, STAKING_ABI, signer);

          let claim = await contract.claimStake(props.contract, props.contractIndex);

          //setTxProcessing(false);

        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      //setTxProcessing(false);
    }
  }
  /*
    async function claim() {
      let options = {
        contractAddress: stakingContract,
        functionName: "claimStake",
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "_contract",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "_contractIndex",
                type: "uint256",
              },
            ],
            name: "claimStake",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        params: {
          _contract: props.contract,
          _contractIndex: props.contractIndex,
        },
      };
  
      await contractProcessor.fetch({
        params: options,
        onError: (err) => {
          setIsLoading(false);
          alert(JSON.stringify(err.data.message));
        },
        onSuccess: (tx) => {
          tx.wait(5)
            .then(alert("Claimed!"))
            .then(setIsLoading(false))
            .then(console.log(tx));
        },
      });
      console.log("Claiming");
    }
  */
  function showInfo() {
    if (hide === false) {
      setHide(true);
    } else setHide(false);
  }

  useEffect(() => {
    getTimeLeft();
    getNFTsRemaining();
    getUserClaimed();
  }, [hide])


  return (
    <div className="w-full rounded overflow-hidden shadow-lg bg-slate-700 hover: hover:scale-105 hover:bg-slate-500 duration-300">
      <img className="w-full" src={props.image} alt={props.nftName}></img>
      {
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2"></div>

          <div className="flex flex-col space-y-4 py-4">
            <button
              className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xl"
              onClick={showInfo}
            >
              Stake Your {props.nftName}
            </button>

          </div>
          <div className={hide ? "hidden" : "text-slate-50 text-base"}>
            <h5>Left to Claim: {NFTsRemaining}</h5>
            <h5>Total Staking Time: {props.stakingTime}</h5>
            <h5>Your Time Remaining: {displayTime}</h5>
            {display}
          </div>
        </div>
      }
    </div >
  );
}

export default Card;
