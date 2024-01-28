import React, { useState } from 'react';

const NFTCard = ({ nft }) => {
  const [imageError, setImageError] = useState(false);

  if (!nft || !nft.metadata || imageError) {
    console.error("Invalid NFT data or image failed to load", nft);
    return null; // Don't render this card if NFT data is invalid or image failed to load
  }

  let attributes = [];
  try {
    attributes = nft.metadata.attributes ? JSON.parse(nft.metadata.attributes) : [];
  } catch (e) {
    console.error("Error parsing attributes JSON for NFT", nft.metadata.attributes, e);
    return null;
  }

  if (!nft.metadata.imageUri || !nft.metadata.name) {
    console.error("Missing essential data for NFT", nft);
    return null;
  }

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`nft-card pt-4 px-4 ${imageError ? 'invisible' : ''}`}>
      <img 
        src={nft.metadata.imageUri} 
        className='rounded-lg w-full'
        alt={nft.metadata.name} 
        onError={handleImageError} // handle image load error
      />
      {!imageError && (
        <div className="nft-info text-gray-500 text-2xl">
          <h3 className='pt-4 font-mono'>{nft.name}</h3>
          
        
        </div>
      )}
    </div>
  );
};

export default NFTCard;
