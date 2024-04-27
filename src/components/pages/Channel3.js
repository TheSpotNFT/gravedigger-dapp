import { useEffect, useState, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, get } from 'firebase/database';
import Player from '@vimeo/player';
import LogoutButton from "../Logout";
import { SA_ADDRESS, SA_ABI } from '../Contracts/StarsArena';
import { ethers, Contract } from "ethers";
import ToggleSwitch from '../ToggleSwitch';
import  { HOTTAKES_ADDRESS, HOTTAKES_ABI } from '../Contracts/HotTakes';
import { useAuth } from '../../Auth';


//Build fail?
const Channel3 = () => {
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
  const [currentUser, setCurrentUser] = useState('The Spot');
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
  console.log(database);


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
              width: 1080,
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

  // THE ARENA
  const checkSharesBalance = async (user) => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
  
        if (SA_ABI && SA_ADDRESS && signer) {
          const contract = new Contract(SA_ADDRESS, SA_ABI, signer);
  
          // Call the sharesBalance function
          const result = await contract.sharesBalance(user.address, account);
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
           
            console.log('Input 1:',account);
            console.log('Input 2:',user.address);
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
 

/* Hot Takes
  const checkKeysBalance = async (user, index) => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
  
        if (SA_ABI && SA_ADDRESS && signer) {
          const contract = new Contract(HOTTAKES_ADDRESS, HOTTAKES_ABI, signer);
  
          // Call the sharesBalance function
          const result = await contract.keysBalance(user.address, account);
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
            console.log(selectedUser);
            console.log(hasSharesBalance);
            console.log(user.username);
            //console.log(account);
          } else {
            setSelectedUser('You do not have access to ' + user.username);
            setBuyModes((prevBuyModes) => {
              const newBuyModes = [...prevBuyModes];
              newBuyModes[index] = true;
              return newBuyModes;
            });
            //getBuyPriceAfterFee(user.address);
            
          }
        }
      }
    } catch (error) {
      console.error("Error checking keysBalance:", error);
    }
  };
*/
  const getBuyPriceAfterFee = async (user) => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
  
        if (SA_ABI && SA_ADDRESS && signer) {
          const contract = new Contract(SA_ADDRESS, SA_ABI, signer);
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
        if (SA_ABI && SA_ADDRESS && signer) {
          const contract = new Contract(
            SA_ADDRESS,
            SA_ABI,
            signer
          );

          let options = {
            // price is 0.666 avax
            value: currentBuyPrice,
          };

          console.log(currentBuyPrice, spotWallet, user.address);
          let tx = await contract.buyShares(user.address, "1", options);
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

  useEffect(() => {
    const initializeContract = async () => {
      // Connect to the Ethereum provider (you may need to replace this with your provider)
      const provider = new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc');

      // Create a new contract instance
      const yourContract = new ethers.Contract(SA_ADDRESS, SA_ABI, provider);

      // Set the contract instance in the state
      setContract(yourContract);
    };

    initializeContract();
  }, []);

  /*useEffect(() => {
    const listenForEvents = async () => {
      if (contract) {
        // Replace 'Trade' with the actual event name
        const tradeFilter = contract.filters.Trade();

        // Listen for the Trade event
        contract.on(tradeFilter, handleEvent);

        // Clean up the event listener when the component is unmounted
        return () => {
          contract.off(tradeFilter, handleEvent);
        };
      }
    };

    const handleEvent = (event) => {
      // Handle the event data as needed
      console.log('Trade Event:', event);

      // Extract relevant information from the event
      const { trader, subject, application, isBuy, keyAmount, ethAmount, protocolEthAmount, subjectEthAmount, applicationEthAmount, supply } = event.args;

      // Update the events in the state
      setEvents((prevEvents) => [...prevEvents, { trader, subject, application, isBuy, keyAmount, ethAmount, protocolEthAmount, subjectEthAmount, applicationEthAmount, supply }]);
    };

    listenForEvents();
  }, [contract]);
  */


  return (
<div className='flex w-full pt-4 px-8'>


<div className='md:flex pt-6 md:pt-0 w-full'>
  <div className='w-full md:w-full items-center md:pt-0'>
  <div className='flex flex-col items-center min-h-screen'>
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
     <div className='text-white'></div> 
     </div>
    </div>

    <div className='w-full md:w-1/5 pr-2 pl-2 pt-8'>

    <div className='pb-8'><button className={`w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 ${isToggled ? 'bg-spot-yellow text-black border-white' : ''} hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-lg 2xl:text-xl flex justify-center`} onClick={onClickUrl("https://arena.social")}>
      {//{isToggled ? 'HotTakes.io' : 'The Arena'}
}
Enter The Arena
     
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
            ${buyModes[index] ? 'border-4 border-green-500 text-green-500 hover:border-white hover:bg-green-500 hover:text-black' : 'border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 hover:bg-spot-yellow hover:text-black hover:border-white'} 
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
            getBuyPriceAfterFee(user.address);

            checkSharesBalance(user, index);
            if (buyModes[index]) {
              buyKey(user, index);
            }
            console.log(user.username);
            console.log(user.address);
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