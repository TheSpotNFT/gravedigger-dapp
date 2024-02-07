import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { web3ModalSetup } from "./helpers/Web3Modal";
import { ethers } from 'ethers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [web3Provider, setWeb3Provider] = useState(null);
  const [txProcessing, setTxProcessing] = useState(false);
  const web3Modal = web3ModalSetup();

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
    <AuthContext.Provider value={{
      account, setAccount,
      web3Provider, setWeb3Provider,
      txProcessing, setTxProcessing,
      web3Modal,
      loadWeb3Modal,
      logoutOfWeb3Modal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
