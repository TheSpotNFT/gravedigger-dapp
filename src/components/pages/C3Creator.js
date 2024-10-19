// Channel3.js

import { useEffect, useState, useRef } from 'react';
import Player from '@vimeo/player';
import LogoutButton from "../Logout";
import { SA_ADDRESS, SA_ABI } from '../Contracts/StarsArena';
import { ethers, Contract } from "ethers";
import { HOTTAKES_ABI, HOTTAKES_ADDRESS } from '../Contracts/HotTakes';
import { useAuth } from '../../Auth';
import { supabase } from '../supabaseClient'; // Import Supabase client

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
    url: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [hasSharesBalance, setHasSharesBalance] = useState(0);
  
  const [username, setUsername] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();

    // Create a new user data object
    const userData = {
      address: account,
      username: username,
    };

    try {
      // Insert the user data into Supabase 'users' table
      const { data, error } = await supabase
        .from('users')
        .insert([userData]);

      if (error) {
        console.error('Error uploading user data to Supabase:', error);
      } else {
        console.log('User data uploaded to Supabase successfully');
        // Clear the form fields
        setUsername('');
        // Refresh users list
        fetchUsers();
      }
    } catch (error) {
      console.error('Error uploading user data to Supabase:', error);
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

    // Find the user by username to get the user_id
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('username', selectedUser)
      .single();

    if (userError || !userData) {
      console.error('Error fetching user:', userError);
      return;
    }

    const userId = userData.id;

    // Create a new video object
    const newVideo = {
      user_id: userId,
      url: formData.url, // Use the URL from the form
    };
    console.log(account, selectedUser, formData.url);
    try {
      // Insert the new video into Supabase 'videos' table
      const { data, error } = await supabase
        .from('videos')
        .insert([newVideo]);

      if (error) {
        console.error('Error adding video to Supabase:', error);
      } else {
        console.log('Video added to Supabase successfully');

        // Reset the form fields
        setFormData({
          url: '', // Reset the URL field
        });
      }
    } catch (error) {
      console.error('Error adding video to Supabase:', error);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data);
    }
  };

  useEffect(() => {
    fetchUsers();

    // Optionally, set up real-time subscriptions
    const subscription = supabase
      .channel('public:users')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        (payload) => {
          fetchUsers(); // Re-fetch users on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    setCurrentUser(selectedUser);
  }, [selectedUser]);

  const checkSharesBalance = async (account) => {
    console.log("Account:", account);

    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
  
        if (SA_ABI && SA_ADDRESS && signer) {
          const contract = new Contract(SA_ADDRESS, SA_ABI, signer);
  
          // Call the sharesBalance function
          const result = await contract.sharesBalance(
            "0xD54bB51BBB6D843Ebae9061d098274CCa28dd78e", // THE ARENA address
            account
          );
  
          // 'result' is a BigNumber
          console.log(`sharesBalance result for address ${account}: ${result}`);
          console.log(`Your Wallet Address: ${account}`);
  
          setHasSharesBalance(result.toNumber());
          console.log(hasSharesBalance);
          if (result.gte(1)) {
            // Find the user with a matching address in the 'users' array
            const matchingUser = users.find(user => user.address === account);
  
            if (matchingUser) {
              // Set 'selectedUser' to the username of the matching user
              setSelectedUser(matchingUser.username);
            } else {
              setSelectedUser("User not found");
            }
          } else {
            setSelectedUser("You do not own a ticket to The Spot");
          }
        }
      }
    } catch (error) {
      console.error("Error checking sharesBalance:", error);
    }
  };

  useEffect(() => {
    if (users.length > 0) {
      checkSharesBalance(account);
    }
  }, [account, users]); 

  return (
    <div className='flex w-full pt-4 px-8'>

      <div className='pt-40 md:pt-0 w-3/5 flex-grow flex flex-col items-center'>
        <div className='text-white font-bold text-4xl pt-12 pb-24'>Channel3 Creator Portal</div>
     {/* Form Input Section */}
     {(currentUser === null || currentUser === 'User not found') && (
     <p className='text-xl text-white font-bold pt-8 pb-6'>
       Add the username to associate with your connected wallet address 
       <div className='text-spot-yellow'>{account}</div> 
       <div className='px-12'>
         Ensure this is your Arena wallet address. For more info check out The Spot on Channel3 to find out more about the platform.
       </div>
     </p>
     )}
      {(currentUser === null || currentUser === 'User not found') && (
     <form className='text-white' onSubmit={handleUsernameSubmit}>
          <label>
            <div className='pr-2 pb-4 flex'>
              <div className='pr-2'>Username:</div>
              <input
                className='text-black w-32 pl-2'
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>
          </label>
          <div className='pt-6 pb-8'>
            <button
              className={`align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow ${
                username === '' || hasSharesBalance < 1
                  ? 'pointer-events-none opacity-50'
                  : 'bg-slate-900 hover:bg-spot-yellow hover:text-black hover:border-white'
              } duration-300`}
              type="submit"
              disabled={username === '' || hasSharesBalance < 1}
            >
              Link Username to Wallet
            </button>
          </div>
        </form>
      )}

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
            selectedUser === null || selectedUser.startsWith('You') || currentUser === "User not found"
              ? 'pointer-events-none opacity-50'
              : ''
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
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Channel3;
