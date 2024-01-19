import React from 'react';

const NFTCard = ({ nft, onCardClick, spotBotTokens }) => {
  const openNFTLink = () => {
    window.open(`https://avax.hyperspace.xyz/collection/avax/71bc03c0-0229-47d7-927a-9dbb7bc746d6?tokenAddress=0x20ef794f891c050d27bec63f50b202cce97d7224_${nft.edition}`, "_blank");
  };

  const getCount = (traitType, value) => {
    // Implement the getCount logic or pass it as a prop
  };

  return (
    <div 
      className={`grid grid-cols-1 bg-white bg-opacity-10 ${spotBotTokens.token_ids.includes(nft.edition) ? 'border-4 border-spot-yellow cursor-pointer' : ''}`}
      onClick={onCardClick || openNFTLink}
    >
      <div className="aspect-w-16 aspect-h-9 overflow-hidden">
        <img className="object-cover object-center w-full h-full" src={nft.image} alt={`SPOT bot #${nft.edition}`}></img>
      </div>
      <div className="p-4">
        <div className="pr-2 pl-2 h-60 overflow-y-auto">
          <div className="font-bold text-sm mb-2">
            <div className="bg-slate-600">
              <h2 className="text-blue-400 text-lg font-mono">Rank: {nft.attributes.find(attr => attr.trait_type === "Rank")?.value || 'Rank not found'}</h2>
            </div>
            <h1 className="pt-2 pb-2 text-md font-mono text-spot-yellow">ID: {nft.edition}</h1>
            {nft.attributes.map(attr => {
              const count = getCount(attr.trait_type, attr.value);
              return count ? (
                <h5 key={attr.trait_type} className="text-white break-words font-mono">{attr.trait_type}: {attr.value} (Count: {count})</h5>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
