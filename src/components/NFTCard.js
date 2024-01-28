import React, { useState } from 'react';

const NFTCard = ({ nft }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!nft || !nft.metadata) {
    console.error("Invalid NFT data", nft);
    return null; // Don't render this card if NFT data is invalid
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

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const link = `https://avax.hyperspace.xyz/collection/avax/${nft.address}?tokenAddress=${nft.address}_${nft.tokenId}`;


  return (
    <div>
      <img
        src={nft.metadata.imageUri}
        alt={nft.metadata.name}
        onLoad={handleImageLoad} // handle successful image load
        onError={handleImageError} // handle image load error
        style={{ display: 'none' }} // hide the image initially
      />
      {imageLoaded && !imageError && (
        <div className={`nft-card pt-4 px-4 ${imageError || !imageLoaded ? 'invisible' : ''}`}>
          {/* Render the image again for display */}
          <a href={link} target="_blank" rel="noopener noreferrer">
          <img
            src={nft.metadata.imageUri}
            className='rounded-lg w-full'
            alt={nft.metadata.name}
          /></a>
          <div className="nft-info text-gray-500 text-2xl">
            <h3 className='pt-4 font-mono'>{nft.name}</h3>
            {/* ... other NFT info ... */}
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTCard;
