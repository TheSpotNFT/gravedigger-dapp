import React from 'react'
import spot from "../../assets/TheSpot.png"
import tombstone from "../../assets/tombstone1.png"
import goatd from "../../assets/goatdmacho.png"
import spotbot from "../../assets/spotbot/7.png"

export default function Ecosystem() {
  return (
    <div className='text-white h-full'>
      {/* Tailblocks Theme */}

      <section className="text-gray-400 body-font  font-mono">
        <div className="container px-5 py-10 mx-auto flex flex-col">
          <div className="lg:w-4/6 mx-auto">
            <div className="lg:text-left sm:text-center">
              <h1 className='text-5xl  font-mono uppercase text-yellow-400 mt-10 pt-10 pb-10 lg:text-left sm:text-center'>The Spot Underground Eco-System</h1>
            </div>
            <div className="lg:text-left sm:text-center">
              <h1 className='text-2xl  font-mono uppercase text-yellow-400 lg:text-left sm:text-center'>Overview: More details dropping soooon...</h1>
            </div>
            {/* Q1 */}
            <div className="flex flex-col sm:flex-row mt-10">
              <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                <div className="w-32 h-32 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
                  <h1 className='font-mono text-4xl'>Spot</h1>
                </div>
                <div className="flex flex-col items-center text-center justify-center">
                  <h2 className="font-medium title-font mt-4 text-white text-lg">Genesis Collection</h2>
                  <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
                  <p className="text-yellow-400 text-lg font-bold">Enabling</p>
                </div>
              </div>
              <div className='grid grid-cols-5'>
                <div className="sm:w-full sm:pl-8 sm:py-8 sm:pr-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-34 pt-4 sm:mt-0 text-center sm:text-left col-span-4">
                  <p className="leading-relaxed text-xl text-justify mb-4">Your Spot is the key to The Spot's Underground Eco-system. You will need to hold at least 1 Spot NFT in order to access the rest of the eco-system's functionality. The Spot NFT collections will still be available to mint and customize on their own but you will not be able to use them in the underground unless you hold a Spot NFT. Your Spot is about to get a major facelift...</p>
                </div>
                <div className='flex items-center'> <img src={spot} alt="The Spot dNFT" className='w-full rounded-lg' /></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Q3 */}
      <section className="text-gray-400 body-font  font-mono">
        <div className="container px-5 py-10 mx-auto flex flex-col">
          <div className="lg:w-4/6 mx-auto">
            <div className="flex flex-col sm:flex-row mt-1">
              <div className="sm:w-1/3 text-center sm:pr-20 sm:py-8">
                <div className="w-32 h-32 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
                  <h1 className='font-mono text-4xl'>NFTombstone</h1>
                </div>
                <div className="flex flex-col items-center text-center justify-center">
                  <h2 className="font-medium title-font mt-4 text-white text-lg">Your Plot</h2>
                  <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
                  <p className="text-yellow-400 text-lg font-bold">Home Base</p>
                </div>
              </div>
              <div className='grid grid-cols-5'>
                <div className="sm:w-full sm:pr-8 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-34 pt-4 sm:mt-0 text-center sm:text-left col-span-4">
                  <p className="leading-relaxed text-xl mb-4 text-justify">NFTombstones will be used to represent your location in the underground. The Spot will be rolling out locations for your plots. These will be claimable and you will be able to choose your plot within the your Spot community (as shown on your Spot NFT). It's first come, first served so if you want a plot in a location with your crew you better get on it and organize with your people. It will be advantageous to be surrounded by like-minded underground dwellers. Keep in mind Spot NFT communities will be clustered together so you should hold the same Spot NFT as your crew to make sure you can claim plots close by. Coming Q2 2023. </p>
                </div>
                <div className='flex items-center'> <img src={tombstone} alt="Tombstone dNFT" className='w-full rounded-lg' /></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Q2 */}
      <section className="text-gray-400 body-font  font-mono">
        <div className="container px-5 py-10 mx-auto flex flex-col">
          <div className="lg:w-4/6 mx-auto">
            <div className="flex flex-col sm:flex-row mt-1">
              <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                <div className="w-32 h-32 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
                  <h1 className='font-mono text-4xl'>Goatd</h1>
                </div>
                <div className="flex flex-col items-center text-center justify-center">
                  <h2 className="font-medium title-font mt-4 text-white text-lg">Your Underground PFP</h2>
                  <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
                  <p className="text-yellow-400 text-lg font-bold">Represent</p>
                </div>
              </div>
              <div className='grid grid-cols-5'>
                <div className="sm:w-full sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-34 pt-4 sm:mt-0 text-center sm:text-left sm:pr-8 col-span-4">
                  <p className="leading-relaxed text-xl mb-4 text-justify">Your Goatd NFT is your PFP for the underground. This will represent you in our underground eco-system. <a className="font-bold" href="/goatd">Get yours with the transmorphisizer here.</a> Collect the traits that represent you and build your underground identity.</p>
                </div>
                <div className='flex items-center'> <img src={goatd} alt="Goatd NFT" className='w-full rounded-lg' /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Q3 */}
      <section className="text-gray-400 body-font  font-mono">
        <div className="container px-5 py-10 mx-auto flex flex-col">
          <div className="lg:w-4/6 mx-auto">
            <div className="flex flex-col sm:flex-row mt-1">
              <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                <div className="w-32 h-32 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
                  <h1 className='font-mono text-4xl'>Spot Bot</h1>
                </div>
                <div className="flex flex-col items-center text-center justify-center">
                  <h2 className="font-medium title-font mt-4 text-white text-lg">Ready Player 1?</h2>
                  <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
                  <p className="text-yellow-400 text-lg font-bold">Gamification</p>
                </div>
              </div>
              <div className='grid grid-cols-5'>
                <div className="sm:w-full sm:pr-8 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-34 pt-4 sm:mt-0 text-center sm:text-left col-span-4">
                  <p className="leading-relaxed text-xl mb-4 text-justify">Your Spot Bot will be the token you actively use in the underground eco-system. We believe in releasing details as we buidl them out, not promising something we aren't 1000% sure will work, so we will be releasing exact details of the Spot Bot's gamification in the coming months.</p>
                </div>
                <div className='flex items-center'> <img src={spotbot} alt="Spot Bot NFT" className='w-full rounded-lg' /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Q3 */}
      <section className="text-gray-400 body-font  font-mono">
        <div className="container px-5 py-10 mx-auto flex flex-col">
          <div className="lg:w-4/6 mx-auto">
            <div className="flex flex-col sm:flex-row mt-1">
              <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                <div className="w-32 h-32 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
                  <h1 className='font-mono text-4xl'>Ur Wallet's Wallet</h1>
                </div>
                <div className="flex flex-col items-center text-center justify-center">
                  <h2 className="font-medium title-font mt-4 text-white text-lg">Storage</h2>
                  <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
                  <p className="text-yellow-400 text-lg font-bold">What's in your wallet?</p>
                </div>
              </div>
              <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-34 pt-4 sm:mt-0 text-center sm:text-left">
                <p className="leading-relaxed text-xl mb-4 text-justify">To be released in Q2 2023, ur wallet's wallet will be storage for everything underground. Without ur wallet's wallet you won't be able to store any underground assets as they roll out. More details to be released as we get closer to mint.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Q3 */}
      <section className="text-gray-400 body-font  font-mono">
        <div className="container px-5 py-10 mx-auto flex flex-col">
          <div className="lg:w-4/6 mx-auto">
            <div className="flex flex-col sm:flex-row mt-1">
              <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                <div className="w-32 h-32 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
                  <h1 className='font-mono text-4xl'>Vibes</h1>
                </div>
                <div className="flex flex-col items-center text-center justify-center">
                  <h2 className="font-medium title-font mt-4 text-white text-lg">Asset</h2>
                  <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
                  <p className="text-yellow-400 text-lg font-bold">gudVibes?</p>
                </div>
              </div>
              <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-34 pt-4 sm:mt-0 text-center sm:text-left">
                <p className="leading-relaxed text-xl mb-4 text-justify">gudVibes will be the first usable asset in the underground's eco-system. Not only will it allow users to claim dNFTs associated with the Vibes project it will act as a token within the underground eco-system.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className='flex w-full pb-8 pt-8'><div className="px-4"><img src={spot} alt="Spot NFT" className='w-96 rounded-lg' /></div><div className="px-4"><img src={tombstone} alt="Tombstone dNFT" className='w-96 rounded-lg' /></div><div className="px-4"><img src={goatd} alt="Goatd cNFT" className='w-96 rounded-lg' /></div><div className="px-4"><img src={spotbot} alt="Spot Bot NFT" className='w-96 rounded-lg' /></div></div>
    </div>
  )
}
