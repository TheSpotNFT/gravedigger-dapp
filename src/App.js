import React, { useEffect } from "react";
import "./App.css";
import { Nav } from "./components/Nav";
import { Board } from "./components/pages/Board";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Ecosystem from "./components/pages/roadmap";
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
import { YourRarity } from "./components/pages/YourRarity";
import Plots from "./components/pages/Plots";
import ReactGA from 'react-ga';
import Channel3 from "./components/pages/Channel3";
import Creator from "./components/pages/C3Creator";
import Underground from "./components/pages/Underground";
import { SAnft } from "./components/pages/SAnft";
import CreatorPortal from "./components/pages/CreatorStream";
import ViewerPage from "./components/pages/ViewerStream";
import { Gallery } from "./components/pages/Gallery";
import Menu from "./components/Menu";
import { AuthProvider } from "./Auth";


ReactGA.initialize('G-YJ9C2P37P6');

function App() {
  // minifridge edits
  // using web3Modal to handle login and account logic
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);
  
  
  const [txProcessing, setTxProcessing] = useState(false);

  return (
   <AuthProvider>
    <div className="App bg-slate-900">
      <Router>
      <Menu className="fixed top-0 left-0 z-50"
            
  />
        <div className="bg-slate-900 w-full h-100">
          {/**/}
          <div className="flex justify-center items-center gap-2">
            <Routes>
              <Route
                path="/"
                exact
                element={
                  <Main
                    
                  />
                }
              />
              <Route
                path="/channel3"
                exact
                element={
                  <Channel3
                    
                  />
                }
              />
               <Route
                path="/underground"
                exact
                element={
                  <Underground
                    
                  />
                }
              />
               <Route
                path="/yourRarity"
                exact
                element={
                  <YourRarity
                    
                  />
                }
              />
               <Route
                path="/gallery"
                exact
                element={
                  <Gallery
                    
                  />
                }
              />
                 <Route
                path="/creator"
                exact
                element={
                  <Creator
                    
                  />
                }
              />
              <Route
                path="/create"
                exact
                element={
                  <CreatorPortal
                    
                  />
                }
              />
              <Route
                path="/viewer"
                exact
                element={
                  <ViewerPage
                   
                  />
                }
              />
              <Route
                path="/gravedigger"
                exact
                element={
                  <Board
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
                  txProcessing={txProcessing}
                  setTxProcessing={setTxProcessing}
                  />
                }
              />
               <Route
                path="/SAnft"
                exact
                element={
                  <SAnft
                  
                  />
                }
              />

              <Route
                path="/unnamed"
                exact
                element={
                  <Unnamed
                  txProcessing={txProcessing}
                  setTxProcessing={setTxProcessing}
                  />
                }
              />
               <Route
                path="/plots"
                exact
                element={
                  <Plots
                    
                  />
                }
              />
              <Route
                path="/goatd"
                exact
                element={
                  <Goatd
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
                   
                  />
                }
              />
               <Route path="/analog" exact element={<AnalogCollection 
            />} />

             <Route path="/staking" exact element={<Staking 
                 txProcessing={txProcessing}
                 setTxProcessing={setTxProcessing}
            />} />
              <Route path="/ecosystem" exact element={<Ecosystem />} />
              <Route path="/team" exact element={<Team />} />
       
              <Route path="/ded" exact element={<Ded />} />
              <Route path="/learning" exact element={<Learning />}/>
            </Routes>
          </div>
        </div>
      </Router>
    </div>
    </AuthProvider>
  );
}

export default App;
