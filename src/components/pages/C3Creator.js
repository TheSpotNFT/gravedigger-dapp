import { useEffect, useState, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, get, orderByChild, equalTo, push, set } from 'firebase/database';
import Player from '@vimeo/player';
import LogoutButton from "../Logout";
import { SA_ADDRESS, SA_ABI } from '../Contracts/StarsArena';
import { ethers, Contract } from "ethers";
import { HOTTAKES_ABI, HOTTAKES_ADDRESS } from '../Contracts/HotTakes';
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
  const [currentUser, setCurrentUser] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const playerRefs = useRef([]);
  //console.log("account", account);

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

  const [formData, setFormData] = useState({
    address: '',
    username: '',
    url: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [hasSharesBalance, setHasSharesBalance] = useState();
  
  const [username, setUsername] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();

    // Initialize Firebase app and get a reference to the database
    const app = initializeApp(firebaseConfig); // Replace with your Firebase configuration
    const database = getDatabase(app);

    // Create a reference to the user's data using the username as the key
    const userRef = ref(database, `users/${username}`);

    // Create a new user data object
    const userData = {
      address: account,
      username: username,
    };

    try {
      // Push the user data to the database
      await set(userRef, userData);

      // Success message or any other action you want to take
      console.log('User data uploaded to the database successfully');

      // Clear the form fields
      setUsername('');
    } catch (error) {
      // Handle the error if there's an issue with pushing data to the database
      console.error('Error uploading user data to the database:', error);
    }
  };


  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear the error for this field when the user types something
  setFormErrors({
    ...formErrors,
    [name]: ""
  });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };



  const handleFormSubmit = async (e, selectedUser, account) => {
    e.preventDefault();
  
    // Initialize Firebase app and get a reference to the database
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
  
    // Create a reference to the "videos" node under the selected user
    const videosRef = ref(database, `users/${selectedUser}/videos`);
  
    // Create a new video object
    const newVideo = {
      address: account,
      username: selectedUser,
      url: formData.url, // Use the URL from the form
      
    };
    console.log(account, selectedUser, formData.url);
    try {
      // Push the new video object to the database
      const newVideoRef = push(videosRef); // Create a new reference using push
      await set(newVideoRef, newVideo); // Use set to save the new video data
  
      // Success message or any other action you want to take
      console.log('Video added to the database successfully');
  
      // Reset the form fields
      setFormData({
        url: '', // Reset the URL field
      });
    } catch (error) {
      // Handle the error if there's an issue with pushing data to the database
      console.error('Error adding video to the database:', error);
    }
  };
  

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
      const app = initializeApp(firebaseConfig);
      const database = getDatabase(app);
      setCurrentUser(selectedUser);
      //console.log(selectedUser);
     
      
    
    };

    fetchData();
  }, [selectedUser]);

  
  

  const checkSharesBalance = async (account) => {
    console.log("Account:", account);

    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
  
        if (SA_ABI && SA_ADDRESS && signer) {
          const contract = new Contract(HOTTAKES_ADDRESS, HOTTAKES_ABI, signer);
  
          // Call the sharesBalance function
          const result = await contract.keysBalance(account, "0x04b54f4e5e7abf5113857ce3bd8ebf2823c3d3e5"/*"0x3aa3a263061c8395362b0098372d33c8f78072ed" THE ARENA*/);
  
          // 'result' is either true or false, you can use it as needed
          //console.log(`sharesBalance result for address ${account}: ${result}`);
          //console.log(`Your Wallet Address: ${account}`);
  
          //const hasSharesBalance = result;
          setHasSharesBalance(result);
          console.log(hasSharesBalance);
          if (result >= 1) {
            // Find the user with a matching address in the 'users' array
            const matchingUser = users.find(user => user.address === account);
  
            if (matchingUser) {
              // Set 'selectedUser' to the username of the matching user
              setSelectedUser(matchingUser.username);
              //console.log(users);
              //console.log(selectedUser);
              //console.log(users.0.username);
              //console.log(account);
            } else {
              setSelectedUser("User not found");
            }
          } else {
            setSelectedUser("You do not own The Spot's ticket");
          }
        }
      }
    } catch (error) {
      console.error("Error checking sharesBalance:", error);
    }
  };

  useEffect(() => {
  
    checkSharesBalance(account);
  }, [account]); 

  return (
<div className='flex w-full pt-4 px-8'>



  <div className='pt-40 md:pt-0 w-3/5 flex-grow flex flex-col items-center'>
    <div className='text-white font-bold text-4xl pt-12 pb-24'>Channel3 Creator Portal</div>
 {/* Form Input Section */}
 {currentUser === null || currentUser === 'User not found' && (
 <p className='text-xl text-white font-bold pt-8 pb-6'>Add the username to associate with your connected wallet address <div className='text-spot-yellow'>{account}</div> <div className='px-12'>Ensure this is your StarsArena wallet address. For more info check out The Spot on Channel3 to find out more about the platform.</div></p>
 
 )}
  {currentUser === null || currentUser === 'User not found' && (
 <form className='text-white' onSubmit={handleUsernameSubmit}>
      <label>
        <div className='pr-2 pb-4 flex'><div className='pr-2'>Username:</div>
        <input className='text-black w-32 pl-2' type="text" placeholder="Username" value={username} onChange={handleUsernameChange} />
      </div></label><div className='pt-6 pb-8'>
      <button
  className={`align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow ${
    username === '' || hasSharesBalance < 1 ? 'pointer-events-none opacity-50' : 'bg-slate-900 hover:bg-spot-yellow hover:text-black hover:border-white'
  } duration-300`}
  type="submit"
  //onClick={checkSharesBalance(account)}
  disabled={username === '' || hasSharesBalance < 1}
>
  Link Username to Wallet
</button>


   </div> </form>)}

 <div className='pb-8 pt-12'>
  {currentUser === null ? (
    <p className='text-xl text-white font-bold w-full'>Select your creator wallet to upload video URL</p>
  ) : (
    <p className='text-xl text-white font-bold'>
      Add video to {currentUser}'s Channel3
    </p>
  )}
</div>
 <form onSubmit={(e) => handleFormSubmit(e, selectedUser, account)}>
  <div>
    <input
    className='pl-2'
      type="text"
      name="url"
      value={formData.url}
      onChange={handleInputChange}
      placeholder="Video URL"
    />
  </div>
  <div className='pt-6'>
    <button
  className={`align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 hover:bg-spot-yellow hover:text-black duration-300 hover:border-white bg-opacity-60 ${
    selectedUser === null || selectedUser.startsWith('You') || currentUser === "User not found" ? 'pointer-events-none opacity-50' : '' // Add pointer-events-none and opacity-50 classes when currentUser is null
  }`}
  type="submit"
  disabled={selectedUser === null || selectedUser.startsWith('You') || currentUser === "User not found"}
>
  Add Video
</button>

  </div>
</form>

        
    </div>

<div className='w-1/5 pr-10'>
      <h2 className='text-white font-bold pb-4 pt-6'>Select your Creator Wallet</h2>
      <div className='pb-2'>
      <ul>
            <li className='py-2'>
              <button
                className="w-full sm:w-max md:w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm-text-xs md-text-l 2xl-text-xl flex justify-center"
                onClick={() => checkSharesBalance(account)}
              >
                {currentUser} {account.substring(0, 5) + "..." + account.substring(account.length - 4)}
              </button>
            </li>
          </ul></div>
</div>

      


    </div>
  );
};

export default Channel3;
