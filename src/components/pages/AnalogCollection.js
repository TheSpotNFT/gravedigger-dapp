import React, { useState, useEffect, useRef, useCallback } from "react";
import Card from "../AnalogCards";
import analogNfts from "../../AnalogNfts";


const renderCard = (analogNfts, index) => {
  return (
    <Card
      key={analogNfts.id}
      nftName={analogNfts.name}
      image1={analogNfts.image1}
      image2={analogNfts.image2}
      image3={analogNfts.image3}
      image4={analogNfts.image4}
      variations={analogNfts.variations}
      id={analogNfts.id}
    />
  );
};


const AnalogCollection = () => {
  const [filterButton, setFilterButton] = useState(1);

  const onClickUrl = (url) => {
    return () => openInNewTab(url);
  };
  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  let Links = [
    { name: "AnalogCampfire", link: "https://discord.com/invite/4wvC6xTFyB" },
    { name: "AnalogNFTrade", link: "https://discord.com/invite/4wvC6xTFyB" },
  ];


  return (
    <div className="pt-24 px-10 py-4 gap-10 font-mono text-spot-yellow bg-slate-900">
      <div className="text-5xl pb-8">Analog</div>
      Analog is a dNFT that you may change to a specific variation if you own a
      Spot NFT and the 1/1 piece. Below you can browse all the variations of the
      pieces and commit a variation once you own the piece. Get a Spot NFT at
      <href
        style={{ cursor: "pointer" }}
        onClick={onClickUrl("https://thespot.art")}
      >
        {" "}
        thespot.art
      </href>{" "}
      and your Analog piece on{" "}
      <href
        style={{ cursor: "pointer" }}
        onClick={onClickUrl(
          "https://campfire.exchange/collections/0xbe18cf471925d683c272aafe9d1aafda99612b69"
        )}
      >
        Campfire.exchange
      </href>{" "}
      or{" "}
      <href
        style={{ cursor: "pointer" }}
        onClick={onClickUrl(
          "https://nftrade.com/assets/avalanche/0xbe18cf471925d683c272aafe9d1aafda99612b69"
        )}
      >
        NFTrade.com
      </href>
      <div className="py-6 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 xxl:grid-cols-6 gap-10 font-mono text-spot-yellow bg-slate-900">
        {analogNfts
          .filter((renderCard) => {
            if (filterButton === 1) {
              return renderCard;
            } else return renderCard.id.walletNFTs;
          })
          .map(renderCard)}
      </div>
    </div>
  );
};

export default AnalogCollection;
