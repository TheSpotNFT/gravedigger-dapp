import { useEffect, useState, useRef } from 'react';
import Player from '@vimeo/player';
import LogoutButton from "../Logout";
import { SA_ADDRESS, SA_ABI } from '../Contracts/StarsArena';
import { ethers, Contract } from "ethers";
import ToggleSwitch from '../ToggleSwitch';
import { useAuth } from '../../Auth';
import { supabase } from '../supabaseClient';

const Channel3 = () => {
  const {
    account,
    web3Modal,
    loadWeb3Modal,
    web3Provider,
    setWeb3Provider,
    logoutOfWeb3Modal,
  } = useAuth();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState('The Spot');
  const [userVideos, setUserVideos] = useState([]);
  const playerRefs = useRef([]);
  const [isToggled, setToggled] = useState(true);
  const [currentBuyPrice, setCurrentBuyPrice] = useState([]);
  const [currentBuyPriceEther, setCurrentBuyPriceEther] = useState(0);
  const [events, setEvents] = useState([]);
  const [contract, setContract] = useState(null);
  const [buyModes, setBuyModes] = useState([]);

  const handleToggle = () => {
    setToggled(!isToggled);
    console.log({ isToggled });
  };

  const spotWallet = "0x32bD2811Fb91BC46756232A0B8c6b2902D7d8763";

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data);
      }
    };

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

  // Update buyModes whenever users change
  useEffect(() => {
    setBuyModes(Array(users.length).fill(false));
  }, [users]);

  useEffect(() => {
    const fetchUserVideos = async () => {
      if (!selectedUser) return;

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

      // Fetch videos associated with the user_id
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('url')
        .eq('user_id', userId);

      if (videosError) {
        console.error('Error fetching videos:', videosError);
      } else {
        const videoUrls = videosData.map((video) => video.url);
        setUserVideos(videoUrls);

        // Initialize Vimeo players
        playerRefs.current.forEach((player) => player.destroy());
        playerRefs.current = [];

        playerRefs.current = videoUrls.map((videoUrl, index) => {
          const options = {
            url: videoUrl,
            width: 1080,
          };
          return new Player(`vimeo-player-${index}`, options);
        });
      }
    };

    fetchUserVideos();

    // Set up real-time subscription to videos
    let subscription;
    const subscribeToVideos = async () => {
      if (!selectedUser) return;

      // Use the userId from the fetchUserVideos function
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

      subscription = supabase
        .channel(`public:videos:user_id=eq.${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'videos',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            fetchUserVideos();
          }
        )
        .subscribe();
    };

    subscribeToVideos();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [selectedUser]);

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
          const hasSharesBalance = result.gte(1);
          if (hasSharesBalance) {
            setSelectedUser(user.username);
          } else {
            // Handle the case where the user does not have access
            // You might want to set a state variable to show an error message
            console.log('You do not have access to ' + user.username);
          }
        }
      }
    } catch (error) {
      console.error("Error checking sharesBalance:", error);
    }
  };

  const getBuyPriceAfterFee = async (userAddress) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        if (SA_ABI && SA_ADDRESS && signer) {
          const contract = new Contract(SA_ADDRESS, SA_ABI, signer);

          const result = await contract.getBuyPriceAfterFee(userAddress, "1");
          setCurrentBuyPrice(result.toString());
          const currentBuyPriceEther = Number(ethers.utils.formatUnits(result, 'ether')).toFixed(2);
          setCurrentBuyPriceEther(currentBuyPriceEther);
        }
      }
    } catch (error) {
      console.error("Error checking keysPrice:", error);
    }
  };

  const buyKey = async (user) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (SA_ABI && SA_ADDRESS && signer) {
          const contract = new Contract(SA_ADDRESS, SA_ABI, signer);

          let options = {
            value: currentBuyPrice,
          };

          await contract.buyShares(user.address, "1", options);

          alert("Successfully Bought Key");
        } else {
          console.log("Error with contract ABI, address, or signer");
        }
      }
    } catch (error) {
      console.log("Error on buyKey");
      console.log(error);
    }
  };

  useEffect(() => {
    const initializeContract = async () => {
      const provider = new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc');
      const yourContract = new ethers.Contract(SA_ADDRESS, SA_ABI, provider);
      setContract(yourContract);
    };

    initializeContract();
  }, []);

  return (
    <div className='flex w-full pt-4 px-8'>
      <div className='md:flex pt-6 md:pt-0 w-full'>
        <div className='w-full md:w-full items-center md:pt-0'>
          <div className='flex flex-col items-center min-h-screen'>
            {currentUser ? (
              <div className='font-bold text-3xl text-white pb-4 pt-6'>{currentUser}'s Channel3</div>
            ) : (
              <div className='font-bold text-3xl text-white pb-4 pt-6'>Channel3</div>
            )}

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
        </div>

        <div className='w-full md:w-1/5 pr-2 pl-2 pt-8'>
          <div className='pb-8'>
            <button
              className={`w-full rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 ${isToggled ? 'bg-spot-yellow text-black border-white' : ''} hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-lg flex justify-center`}
              onClick={() => window.location.href = "https://arena.social/?ref=TheSpotUG"}
            >
              Enter The Arena
            </button>
          </div>

          <button
            className="w-full rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-lg flex justify-center"
            onClick={() => window.location.href = "/creator"}
          >
            Creator Portal
          </button>

          <h2 className='text-white font-bold text-2xl pb-4 pt-6'>
            <button
              className="w-full rounded-lg px-4 py-2 border-4 border-white text-white bg-slate-900 bg-opacity-60 font-mono text-lg flex justify-center cursor-default"
            >
              Creators
            </button>
          </h2>

          <div className='pb-2'>
            <ul>
              {users.map((user, index) => (
                <li className='py-2' key={index}>
                  <button
                    className={`w-full rounded-lg px-4 py-2 ${buyModes[index] ? 'border-4 border-green-500 text-green-500 hover:border-white hover:bg-green-500 hover:text-black' : 'border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 hover:bg-spot-yellow hover:text-black hover:border-white'} duration-300 font-mono text-lg flex justify-center`}
                    onClick={() => {
                      // Reset buyModes
                      setBuyModes(Array(users.length).fill(false));

                      // Set the clicked index to true
                      setBuyModes((prevBuyModes) => {
                        const newBuyModes = [...prevBuyModes];
                        newBuyModes[index] = true;
                        return newBuyModes;
                      });

                      // Check if the user has access
                      checkSharesBalance(user);

                      // Get the buy price
                      getBuyPriceAfterFee(user.address);

                      // If buy mode is active, attempt to buy key
                      if (buyModes[index]) {
                        buyKey(user);
                      }
                    }}
                  >
                    {buyModes[index] ? `Buy ${user.username} (${currentBuyPriceEther} AVAX)` : user.username}
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
