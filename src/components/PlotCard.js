import React from "react";

const PlotCard = ({ plot }) => {
  return (
    <div className="bg-slate-700 rounded-lg shadow-md overflow-hidden relative">
      <img 
        src={plot.TombstoneImage} 
        alt={plot.PlotName} 
        className="w-full h-48 object-cover" 
      />
      <img 
        src={plot.PfpImage} 
        alt={`${plot.Username}'s PFP`} 
        className="absolute bottom-4 right-4 h-12 w-12 rounded-full border-2 border-white" 
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{plot.PlotName}</h3>
        <p className="text-gray-600">{plot.community}</p>
        <div className="mt-2 text-sm">
          <p>Token ID: {plot.TokenID}</p>
          <p>Collection: {plot.CollectionName}</p>
          <p>Owner: {plot.Owner}</p>
          <p>Username: {plot.Username}</p>
          <p className="line-clamp-3">{plot.Bio}</p> {/* Truncate bio */}
        </div>
      </div>
    </div>
  );
};

export default PlotCard;