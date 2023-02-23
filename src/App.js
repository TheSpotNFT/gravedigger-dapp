import React, { useEffect } from "react";
import "./App.css";
import { Nav } from "./components/Nav";
import { Board } from "./components/pages/Board";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Roadmap from "./components/pages/roadmap";
import Team from "./components/pages/team";
import Learning from "./components/pages/learning";
import Footer from "./components/Footer";
import Main from "./components/pages/Main";
import AnalogCollection from "./components/pages/AnalogCollection"
import SpotEcosystem from "./components/pages/SpotEcosystem";
import {Ded} from "./components/pages/Ded";
import {Goatd} from "./components/pages/Goatd";
import Staking from "./components/pages/Staking";
import { Unnamed } from "./components/pages/Unnamed";
import { useState, useCallback } from "react";
import { web3ModalSetup } from "./helpers/Web3Modal";
import { ethers } from "ethers";
import { Scribble } from "./components/pages/ScribbleCustoms";
import { ScribbleUpdate } from "./components/pages/ScribbleUpdateCustoms";
import { Rarity } from "./components/pages/Rarity";
import ReactGA from 'react-ga';


ReactGA.initialize('G-YJ9C2P37P6');

function App() {
  // minifridge edits
  // using web3Modal to handle login and account logic
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);
  
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



  return (
    <div className="App bg-slate-900">
      <Router>
        <div className="bg-slate-900 w-full h-100">
          {/*<Nav
            account={account}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            web3Provider={web3Provider}
            setWeb3Provider={setWeb3Provider}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
  />*/}
          <div className="flex justify-center items-center gap-2">
            <Routes>
              <Route
                path="/"
                exact
                element={
                  <Main
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
                path="/gravedigger"
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
                path="/scribble"
                exact
                element={
                  <Scribble
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
                path="/scribbleupdate"
                exact
                element={
                  <ScribbleUpdate
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
              <Route
                path="/goatd"
                exact
                element={
                  <Goatd
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
                path="/rarity"
                exact
                element={
                  <Rarity
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
               <Route path="/analog" exact element={<AnalogCollection 
            account={account}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            web3Provider={web3Provider}
            setWeb3Provider={setWeb3Provider}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            txProcessing={txProcessing}
            setTxProcessing={setTxProcessing}/>} />

             <Route path="/staking" exact element={<Staking 
            account={account}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            web3Provider={web3Provider}
            setWeb3Provider={setWeb3Provider}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            txProcessing={txProcessing}
            setTxProcessing={setTxProcessing}/>} />
              <Route path="/roadmap" exact element={<Roadmap />} />
              <Route path="/team" exact element={<Team />} />
              <Route path="/ecosystem" exact element={<SpotEcosystem />} />
              <Route path="/ded" exact element={<Ded account={account} />} />
              <Route path="/learning" exact element={<Learning />}/>
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
