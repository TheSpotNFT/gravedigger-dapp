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
import spot from '../../assets/cryptospot.png';
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
<div className='flex w-full pt-4 px-8 scroll-auto'>

<div></div>

<div className='h-screen pt-6 md:pt-0 w-full pr-16 left-0 pl-48 pb-8'>
    <div className='text-white text-6xl font-mono pt-32 pb-48'>Your Spot Plot: The Underground</div>
    <div className=' grid grid-cols-2'>
    <div className='mx-auto'><img src={nftombstone} className='h-2/5 rounded-md'></img>
    <div className='pt-4 bottom-0 pb-4'>
    <div className='text-white text-2xl font-mono pb-4'>Your Vibes</div>
    <div className='flex w-full'>
    <div className='text-white text-2xl flex'><img src={gud} className='h-12'></img><img src={gud} className='h-12'></img><img src={gud} className='h-12'></img><img src={gud} className='h-12'></img><img src={gud} className='h-12'></img><img src={gud} className='h-12'></img></div>
    
    </div>
    <div className='text-white text-2xl flex pb-8'><img src={bad} className='h-12'></img><img src={bad} className='h-12'></img></div>
</div></div>
  <div className='pl-16 relative pb-8'> {/* Add relative here to position the spot image absolutely within this container */}

    <div className='h-full'>
        {/* Position the Bot image normally */}
        <div className='flex'><img src={Bot} className='h-96 rounded-md'></img><img src={spot} className='h-96 rounded-md pl-8 pb-4'></img></div>

        {/* Position the spot image absolutely in the top right corner */}
       
<div className='pt-8 w-full'>
<div className='flex flex-col justify-between pb-4 h-full text-white text-left text-mono bg-slate-700 pl-2 pr-2'>
  <div>
 <p>Undertaker: Wen Moon</p> 
  <p>Wen: Who's in here?</p>
  <p>Charles III: HEYO!</p>
  <p>Irwin22: Glad to be here</p>
  <p>WhosThat: New NFTombstone, Who DIS?</p>
  <p className='pb-4'>Wen: Made it</p></div>

  <div className='pt-4 border-t-spot-yellow border-t-2'>Chat: <input type='text' className='text-grey-800 bg-grey-400 pl-2' label='respond' placeholder='respond'></input></div>

</div>
</div>
<div></div>
    </div>

</div>
</div>

    </div>
   
   <div></div>
   
      </div>
      


   
  );
};

export default Underground;