import React, { useEffect } from "react";
import "./App.css";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { Nav } from "./components/Nav";
import { Board } from "./components/pages/Board";
import Authenticate from "./components/Authenticate";
import { useChain } from "react-moralis";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Roadmap from "./components/pages/roadmap";
import Team from "./components/pages/team";
import Footer from "./components/Footer";
import Moralis from "moralis";
import SpotEcosystem from "./components/pages/SpotEcosystem";
import Ded from "./components/pages/Ded";
import { Unnamed } from "./components/pages/Unnamed";
import { useState, useCallback } from "react";
import { web3ModalSetup } from "./helpers/Web3Modal";
import { ethers } from "ethers";

function App() {
  // minifridge edits
  // using web3Modal to handle login and account logic
  const [account, setAccount] = useState("");
  const [txProcessing, setTxProcessing] = useState(false);
  const [web3Provider, setWeb3Provider] = useState(null);
  const web3Modal = web3ModalSetup();

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (
      web3Provider &&
      web3Provider.provider &&
      typeof web3Provider.provider.disconnect == "function"
    ) {
      await web3Provider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setWeb3Provider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", (chainId) => {
      console.log(`Chain changed to -- ${chainId}`);
      setWeb3Provider(new ethers.providers.Web3Provider(provider));
      setTimeout(() => {
        window.location.reload();
      }, 1);
    });

    provider.on("accountsChanged", () => {
      console.log(`Account changed`);
      setWeb3Provider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log("Disconnecting...");
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setWeb3Provider]);

  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  useEffect(() => {
    const getAddress = async () => {
      if (web3Provider && web3Provider.getSigner()) {
        const newAddress = await web3Provider.getSigner().getAddress();
        setAccount(newAddress);
      }
    };
    getAddress();
  }, [web3Provider]);

  // const { isWeb3Enabled, isWeb3EnableLoading, enableWeb3, isAuthenticated } =
  //   useMoralis();
  // const Web3Api = useMoralisWeb3Api();
  // const { switchNetwork, chainId, chain } = useChain();

  // async function checkMetamask() {
  //   const isMetaMaskInstalled = await Moralis.isMetaMaskInstalled();
  //   if (!isMetaMaskInstalled) {
  //     alert(
  //       "Metamask Wallet not found! Please install Metamask for your browser here: https://metamask.io/download/"
  //     );
  //   }
  // }

  // useEffect(() => {
  //   checkMetamask();
  //   const connectorId = window.localStorage.getItem("connectorId");
  //   if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) {
  //     enableWeb3({ provider: connectorId });
  //   }
  //   chainId !== "0xa86a" && switchNetwork("0xa86a");
  // }, [isAuthenticated, isWeb3Enabled, chain]);

  /* if (!isAuthenticated || account===null) {
      
      return (
        <Authenticate />
      );
    }*/

  return (
    <div className="App bg-slate-900">
      <Router>
        <div className="bg-slate-900 w-full h-100">
          <Nav
            account={account}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            web3Provider={web3Provider}
            setWeb3Provider={setWeb3Provider}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
          />
          <div className="flex justify-center items-center gap-2">
            <Routes>
              <Route
                path="/"
                exact
                element={
                  <Board
                    account={account}
                    web3Modal={web3Modal}
                    loadWeb3Modal={loadWeb3Modal}
                    web3Provider={web3Provider}
                    setWeb3Provider={setWeb3Provider}
                    logoutOfWeb3Modal={logoutOfWeb3Modal}
                    txProcessing={txProcessing}
                    setTxProcessing={setTxProcessing}
                  />
                }
              />
              <Route
                path="/unnamed"
                exact
                element={
                  <Unnamed
                    account={account}
                    web3Modal={web3Modal}
                    loadWeb3Modal={loadWeb3Modal}
                    web3Provider={web3Provider}
                    setWeb3Provider={setWeb3Provider}
                    logoutOfWeb3Modal={logoutOfWeb3Modal}
                    txProcessing={txProcessing}
                    setTxProcessing={setTxProcessing}
                  />
                }
              />
              <Route path="/roadmap" exact element={<Roadmap />} />
              <Route path="/team" exact element={<Team />} />
              <Route path="/ecosystem" exact element={<SpotEcosystem />} />
              <Route path="/ded" exact element={<Ded 
                    account={account}
                    web3Modal={web3Modal}
                    loadWeb3Modal={loadWeb3Modal}
                    web3Provider={web3Provider}
                    setWeb3Provider={setWeb3Provider}
                    logoutOfWeb3Modal={logoutOfWeb3Modal}
                    txProcessing={txProcessing}
                    setTxProcessing={setTxProcessing} />} />
            </Routes>
          </div>
        </div>

        <div className="footer">
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
