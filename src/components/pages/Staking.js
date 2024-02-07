import { React, useEffect } from "react";
import ReactGA from 'react-ga';
import collection from "../../StakingCollections";
import Card from "../../components/StakingCards";
import { useAuth } from "../../Auth";

ReactGA.initialize('G-YJ9C2P37P6');

export const StakingCards = ({
  txProcessing,
  setTxProcessing}) => {
  
  const {
      account,
      web3Modal,
      loadWeb3Modal,
      web3Provider,
      setWeb3Provider,
      logoutOfWeb3Modal,
      // ... any other states or functions you need ...
    } = useAuth();

const renderCard = (collection, index) => {
  return (
    <Card
      key={collection.id}
      nftName={collection.name}
      image={collection.image}
      hoverimage={collection.hoverimage}
      id={collection.id}
      contract={collection.contract}
      contractIndex={collection.contractIndex}
      masterIndex={collection.masterIndex}
      stakingTokenId={collection.stakingTokenId}
      rewardContract={collection.rewardContract}
      rewardName={collection.rewardName}
      stakingTime={collection.stakingTime}
      stakingTimeSecs={collection.stakingTimeSecs}
      txProcessing={txProcessing}
      setTxProcessing={setTxProcessing}
      web3Provider={web3Provider}
      account={account}
    />
  );
};
useEffect(() => {
  ReactGA.pageview(window.location.pathname + window.location.search);
}, []);

  return (
    <div className="pt-32 px-10 py-4 gap-10 font-mono text-spot-yellow bg-slate-900">
      <div className="text-5xl pb-8">Staking</div>
      Stake your NFTs in either our non-custodial single sided staking or our
      non-custodial staking pairs. Your NFTs never leave your wallet and you can
      stake as many at the same time as you would like. We will always be adding
      staking pairs and rewards to keep yours eyes on our discord, twitter and
      this page! Staking times vary for each reward.
      <div className="py-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-8 gap-10 font-mono text-spot-yellow bg-slate-900">
        {collection.map(renderCard)}
      </div>
    </div>
  );
}

export default StakingCards;
