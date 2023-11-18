import { useEffect, useState, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, get } from 'firebase/database';
import Player from '@vimeo/player';
import LogoutButton from "../Logout";
import { SA_ADDRESS, SA_ABI } from '../Contracts/StarsArena';
import { ethers, Contract } from "ethers";
import ToggleSwitch from '../ToggleSwitch';
import  { HOTTAKES_ADDRESS, HOTTAKES_ABI } from '../Contracts/HotTakes';


//Build fail?
const Channel3 = ({account,
    web3Modal,
    loadWeb3Modal,
    web3Provider,
    setWeb3Provider,
    logoutOfWeb3Modal,
    txProcessing,
    setTxProcessing,}) => {
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

  // Initialize Firebase with your config
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  };
  
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  


  useEffect(() => {
    // Create a reference to the "users" node in the database
    const usersRef = ref(database, 'users');

    // Listen for changes in the "users" node
    //console.log(selectedUser);
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      if (usersData) {
        // Convert the user data into an array
        const usersArray = Object.values(usersData);
        setUsers(usersArray);
        //console.log(usersArray);

      }
    });

    // Unsubscribe from Firebase when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
 
    const fetchData = async () => {

      playerRefs.current.forEach((player) => player.destroy());
      playerRefs.current = [];
      const app = initializeApp(firebaseConfig);
      const database = getDatabase(app);
      setCurrentUser(selectedUser);
      const userRef = ref(database, `users/${selectedUser}/videos`); // Update the path
      
      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const videosData = snapshot.val();
          const videoDataArray = Object.values(videosData);
          const videoUrls = videoDataArray.map((videoData) => videoData.url);
    
          setUserVideos(videoUrls);
         

          videoUrls.forEach((videoUrl, index) => {
            //console.log(`Video ${index + 1}: ${videoUrl}`);
          });

          // Initialize the Vimeo players for each video
          playerRefs.current = videoUrls.map((videoUrl, index) => {
            const options = {
              url: videoUrl, // Assuming the URL is the Vimeo video URL
              //width: 860,
            };
            return new Player(`vimeo-player-${index}`, options);
          });
        } else {
          console.log('No data found for the provided userId:', currentUser);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (selectedUser) {
      fetchData();
    }
  }, [selectedUser]);

  /* THE ARENA
  const checkSharesBalance = async (user) => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
  
        if (SA_ABI && SA_ADDRESS && signer) {
          const contract = new Contract(SA_ADDRESS, SA_ABI, signer);
  
          // Call the sharesBalance function
          const result = await contract.sharesBalance(account, user.address);
          //console.log(result);
  
          // 'result' is either true or false, you can use it as needed
          //console.log(`sharesBalance result for address ${user.address}: ${result}`);
          //console.log(`Your Wallet Address: ${account}`);
          //console.log(`User's Address: ${user.address}`);
          //console.log(`User's name: ${user.username}`);
          const hasSharesBalance = result.gte(1);
          if (hasSharesBalance == true) {
            // Enable the button or take any other actions as needed
            setSelectedUser(user.username);
            //console.log(selectedUser);
            //console.log(hasSharesBalance);
            console.log(user.username);
            //console.log(account);
          } else {
            setSelectedUser('You do not have access to ' + user.username);
          }
        }
      }
    } catch (error) {
      console.error("Error checking sharesBalance:", error);
    }
  }; 
  */

// Hot Takes
  const checkKeysBalance = async (user, index) => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
  
        if (SA_ABI && SA_ADDRESS && signer) {
          const contract = new Contract(HOTTAKES_ADDRESS, HOTTAKES_ABI, signer);
  
          // Call the sharesBalance function
          const result = await contract.keysBalance(account, user.address);
          //console.log(result);
  
          // 'result' is either true or false, you can use it as needed
          //console.log(`sharesBalance result for address ${user.address}: ${result}`);
          //console.log(`Your Wallet Address: ${account}`);
          //console.log(`User's Address: ${user.address}`);
          //console.log(`User's name: ${user.username}`);
          const hasSharesBalance = result.gte(1);
          if (hasSharesBalance == true) {
            // Enable the button or take any other actions as needed
            setSelectedUser(user.username);
            //console.log(selectedUser);
            //console.log(hasSharesBalance);
            console.log(user.username);
            //console.log(account);
          } else {
            setSelectedUser('You do not have access to ' + user.username);
            setBuyModes((prevBuyModes) => {
              const newBuyModes = [...prevBuyModes];
              newBuyModes[index] = true;
              return newBuyModes;
            });
            getBuyPriceAfterFee(user.address);
            
          }
        }
      }
    } catch (error) {
      console.error("Error checking keysBalance:", error);
    }
  };

  const getBuyPriceAfterFee = async (user) => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
  
        if (SA_ABI && SA_ADDRESS && signer) {
          const contract = new Contract(HOTTAKES_ADDRESS, HOTTAKES_ABI, signer);
          console.log(user);
          // Call the sharesBalance function
          const result = await contract.getBuyPriceAfterFee(user, "1");
          const resultString = result.toString();
          console.log(resultString);
          setCurrentBuyPrice(resultString);
          const currentBuyPriceEther = Number(ethers.utils.formatUnits(result, 'ether')).toFixed(2);
        
          // Update state with the Ether value
          setCurrentBuyPriceEther(currentBuyPriceEther);
          console.log(currentBuyPriceEther);
          
        }
      }
    } catch (error) {
      console.error("Error checking keysPrice:", error);
    }
  };
  
  async function buyKey(user) {

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (HOTTAKES_ABI && HOTTAKES_ADDRESS && signer) {
          const contract = new Contract(
            HOTTAKES_ADDRESS,
            HOTTAKES_ABI,
            signer
          );

          let options = {
            // price is 0.666 avax
            value: currentBuyPrice,
          };

          console.log(currentBuyPrice, spotWallet, user.address);
          let tx = await contract.buyKeys(spotWallet, user.address, "1", options);
          //console.log(tx.hash);
        
          alert(
            "Successfully Bought Key"
          );
        } else {
          console.log("error with contract abi, address, or signer");
        }
      }
    } catch (error) {
      console.log("Error on mint");
      console.log(error);
    } finally {
     
    }
  }

  return (
<div className='flex w-full pt-4 px-8'>

<div className="pt-6 px-12 w-1/5 bg-slate-900">
        <div className="fixed"><div className="pb-2"><LogoutButton
            account={account}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            web3Provider={web3Provider}
            setWeb3Provider={setWeb3Provider}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
          /></div>
          <div>
          <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-4 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-40
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={exploreClick}
        >
          {explore ? "Hide" : "Explore"}
        </button></div>
        <div className={`${explore ? 'absolute left-0 top-22 w-full opacity-100' : 'absolute -left-60 top-22 w-full opacity-0'} transition-all duration-500`}>
        <div className="py-2 pt-4">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl('/ecosystem')}
        >
          Eco-System
        </button>
        </div>
        <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("https://campfire.exchange/collections/0x0c6945e825fc3c80f0a1ea1d3e24d6854f7460d8")}
        >
          Genesis Collection
        </button>
        </div>
        <div className="py-2">
          <a href="/#vibes">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
        onClick={exploreClick}
        >
          Vibes
        </button></a>
        </div>
        <div className="py-2">
          <a href="/#spotbot">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
            onClick={exploreClick}
        >
          Spot Bot
        </button></a>
        </div>
        <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/goatd")}
        >
          Goatd
        </button>
        </div>
        <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/gravedigger")}
        >
          NFTombstones
        </button>
        </div><div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/unnamed")}
        >
          Unnamed Branding
        </button>
        </div><div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/analog")}
        >
          Analog
        </button>
        </div><div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/staking")}
        >
          Staking
        </button>
        </div><div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("/scribble")}
        >
          Scribble Customs
        </button></div>
        <div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("https://twitter.com/TheSpotUG")}
        >
          Twitter
        </button>
        </div><div className="py-2">
        <button
          className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
          onClick={onClickUrl("https://discord.com/invite/4wvC6xTFyB")}
        >
          Discord
        </button>
          </div></div></div>
     
  </div>
<div className='md:flex pt-6 md:pt-0 w-full'>
  <div className='w-full md:w-full items-center pt-40 md:pt-0'>
    
  {currentUser ? (
  <div className='font-bold text-3xl text-white pb-4 pt-6'>{currentUser}'s Channel3</div>
) : <div className='font-bold text-3xl text-white pb-4 pt-6'>Channel3</div>}

    {userVideos.length > 0 ? (
  <div className='grid-cols-1 mx-auto'>
    {userVideos.map((videoUrl, index) => (
      <div key={index} className='mx-auto w-full'>
       
        <p className='pb-4'></p>
        <div id={`vimeo-player-${index}`}></div>
        
      </div>
    ))}
        </div>
      ) : (
        <p className='text-white'>Select a creator to view their content</p>
      )}
    </div>

    <div className='w-full md:w-1/5 pr-2 pl-2 pt-8'>

    <div className='pb-8'><button className={`w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 ${isToggled ? 'bg-spot-yellow text-black border-white' : ''} hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-lg 2xl:text-xl flex justify-center`} onClick={onClickUrl("https://hottakes.io")}>
      {isToggled ? 'HotTakes.io' : 'The Arena'}
     
    </button></div>

    <button
                  className="w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60
                  hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center"
                  onClick={onClickUrl("/creator")}
                >
                  Creator Portal
                </button>
        <h2 className='text-white font-bold text-2xl pb-4 pt-6'><button
                  className="w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-white text-white bg-slate-900 bg-opacity-60
                  font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center cursor-default"
              
                >Creators</button></h2>
    <div className='pb-2'>
  <ul>
    {users.map((user, index) => (
      <li className='py-2' key={index}>
        <button
          className={`w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 
            ${buyModes[index] ? 'bg-green-500 text-white' : 'border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 hover:bg-spot-yellow hover:text-black hover:border-white'} 
            duration-300 font-mono sm:text-xs md:text-l 2xl:text-xl flex justify-center`}
          onClick={() => {
            // Set all buyModes to 0
            setBuyModes(Array(users.length).fill(0));

            // Set the clicked index to 1
            setBuyModes((prevBuyModes) => {
              const newBuyModes = [...prevBuyModes];
              newBuyModes[index] = 1;
              return newBuyModes;
            });

            checkKeysBalance(user, index);
            if (buyModes[index]) {
              buyKey(user, index);
            }
            console.log(user.username);
          }}
        >
          {buyModes[index] ? `Buy ${user.username} (${currentBuyPriceEther})` : user.username}
        </button>
      </li>
    ))}
  </ul>
</div>

      </div>
      </div>
      


    </div>
  );
};

export default Channel3;