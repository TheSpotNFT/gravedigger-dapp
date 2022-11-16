import React, { useState, useEffect, useRef, useCallback } from "react";
import traits from '../traits';
import Card from "./ScribbleCard";


function DisplayCards() {
  const [filter, setFilter] = useState("");
  const [walletTraits, setWalletTraits] = useState([]);
  const [nftSelected, setNftSelected] = useState(false);
  const [chosenTrait, setChosenTrait] = useState({
    Scribble: "1",
    ScribbleID: "1",
    Custom: "",
    CustomID: "1",

  });

  const searchText = (event) => {
    setFilter(event.target.value);
  };

  let dataSearch = traits.filter((item) => {
    return Object.keys(item).some((key) =>
      item[key]
        .toString()
        .toLowerCase()
        .includes(filter.toString().toLowerCase())
    );
  });
  let ownedFilter = traits.filter((item) => {
    if (walletTraits.includes(item.id.toString())) {
      return item;
    }
  });

  const [ownedCards, setOwnedCards] = useState(true);

  function updateCanvasTraits(trait) {
    setChosenTrait((prevTrait) => ({
      ...prevTrait,
      [trait.traitType]: trait.traitName,
      [trait.traitType + "ID"]: trait.id,
    }));
    setNftSelected(true);
  }

  function createMindMatterCard(trait) {
    //Building the card here from Card.jsx passing props and simultaneously fetching traits on click.
    return (
      <div
        key={trait.id}
        onClick={() => {
          updateCanvasTraits(trait);
        }}
      >
        {" "}
        <Card
          nftName="Mind Matter"
          id={trait.id}

        />
      </div>
    );
  }



  return (


    <div className="overflow-y-auto">
      <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 font-mono text-spot-yellow">
        {ownedCards
          ? ownedFilter.map(createMindMatterCard)
          : dataSearch.map(createMindMatterCard)}
      </div>
    </div>


  )
}
export default DisplayCards;