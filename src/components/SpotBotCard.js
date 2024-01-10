import React from 'react';
import rankedData from '../rankedOutput.json'; // Adjust the path to your rankedOutput.json

const NFTCard = ({ nft, setNftId, getCount }) => {
  if (!nft || !nft.normalized_metadata || !nft.normalized_metadata.attributes) {
    return null;
  }

  const tokenId = nft.token_id;
  const rankingInfo = rankedData[tokenId];
  if (!rankingInfo) {
    return null;
  }

  return (
    <div key={tokenId} onClick={() => setNftId(tokenId)}>
      <div className="hover:z-0 rounded overflow-hidden shadow-lg bg-slate-700 hover:scale-105 hover:bg-slate-500 duration-300">
        <div className="grid grid-cols-1">
          <img className="h-48 mx-auto pt-4" src={nft.normalized_metadata.image} alt=""></img>
          <div className="pt-4 pr-2 pl-2">
            {/* New Data */}
            <div className="font-bold text-sm mb-2 bg-slate-600">
              <h1>ID: {rankingInfo.ID}</h1>
              <h2>Rank: {rankingInfo.ranking}</h2>
              <h2>Rarest Trait: {rankingInfo.rarestTrait}</h2>
            </div>
            {/* Existing Data */}
            {nft.normalized_metadata.attributes.map((attr, index) => (
              <h5 key={index} className="text-white">
                {attr.trait_type}: {attr.value} ({getCount(attr.trait_type, attr.value)})
              </h5>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
