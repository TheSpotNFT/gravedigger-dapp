import { useEffect, useState, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, get } from 'firebase/database';
import Player from '@vimeo/player';
import LogoutButton from "../Logout";
import { SA_ADDRESS, SA_ABI } from '../Contracts/StarsArena';
import { ethers, Contract } from "ethers";
import ToggleSwitch from '../ToggleSwitch';
import  { HOTTAKES_ADDRESS, HOTTAKES_ABI } from '../Contracts/HotTakes';
import Bot from '../../assets/spotbot/6.png';
import nftombstone from '../../assets/nftombstone.png';
import spot from '../../assets/TheSpot.png';
import gud from '../../assets/gud.png';
import bad from '../../assets/bad.png';
import { useAuth } from '../../Auth';


const Underground = ({}) => {
  const {
    account,
    web3Modal,
    loadWeb3Modal,
    web3Provider,
    setWeb3Provider,
    logoutOfWeb3Modal,
    // ... any other states or functions you need ...
  } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const playerRefs = useRef([]);
  const [isToggled, setToggled] = useState(true);
  const [currentBuyPrice, setCurrentBuyPrice] = useState([]);
  const [currentBuyPriceEther, setCurrentBuyPriceEther] = useState(0);
  const handleToggle = () => {
    setToggled(!isToggled);
    console.log({isToggled});
    
  };
  const spotWallet = "0x32bD2811Fb91BC46756232A0B8c6b2902D7d8763";
  const [events, setEvents] = useState([]);
  const [contract, setContract] = useState(null);
  
  

  const [buyModes, setBuyModes] = useState(Array(users.length).fill(false));

  const handleUserClick = (user) => {
    setSelectedUser(user);
    console.log(selectedUser);
  };
  const onClickUrl = (url) => {
    return () => openInNewTab(url);
  };
  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_self", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };
  const [explore, setExplore] = useState(false);
  function exploreClick(){
    setExplore(!explore);
  }
  
  return (
<div className='flex w-full pt-4 px-8'>

<div className='h-screen pt-6 md:pt-0 w-full pr-16 fixed left-0 pl-48'>
    <div className='text-white text-6xl font-mono pt-32 pb-48'>The Underground</div>
    <div className=' grid grid-cols-2'>
    <div className='mx-auto'><img src={nftombstone} className='h-3/5 rounded-md'></img></div>
  <div className='pl-16 relative'> {/* Add relative here to position the spot image absolutely within this container */}

    <div className='h-3/5'>
        {/* Position the Bot image normally */}
        <img src={Bot} className='h-full rounded-md'></img>

        {/* Position the spot image absolutely in the top right corner */}
        <div className='absolute top-0 right-0'> {/* Add top-0 and right-0 to align it to the top right */}
            <img src={spot} className='h-1/5 rounded-md'></img> {/* Adjust the size as needed, here I used h-1/5 as an example */}
        </div>
    </div>

</div>
</div>
<div className='fixed bottom-0 pb-4'>
    <div className='text-white text-2xl font-mono pb-4'>Your Vibes</div>
    <div className='flex w-full'>
    <div className='text-white text-2xl flex'><img src={gud} className='h-24'></img><img src={gud} className='h-24'></img><img src={gud} className='h-24'></img><img src={gud} className='h-24'></img><img src={gud} className='h-24'></img><img src={gud} className='h-24'></img></div>
    
    </div>
    <div className='text-white text-2xl flex pb-8'><img src={bad} className='h-24'></img><img src={bad} className='h-24'></img></div>
</div>
    </div>
   
   
      </div>
      


   
  );
};

export default Underground;