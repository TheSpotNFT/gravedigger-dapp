import { React, useEffect, useState } from "react";
import ReactGA from 'react-ga';
import collection from "../../StakingCollections";
import Card from "../StakingCards";
import "../../index.css";

ReactGA.initialize('G-YJ9C2P37P6');

export const Plots = ({account,
  web3Modal,
  loadWeb3Modal,
  web3Provider,
  setWeb3Provider,
  logoutOfWeb3Modal,
  txProcessing,
  setTxProcessing}) => {

    const [selectedCell, setSelectedCell] = useState(null);

   /* const handleCellClick = (x, y) => {
      setSelectedCell({ x, y });
      console.log(`Selected cell: (${x}, ${y})`);
    };
  
    const isCellSelected = (x, y) =>
      selectedCell?.x === x && selectedCell?.y === y;
*/
const handleCellClick = (id) => {
  setSelectedCell(id);
  console.log(`Selected cell: ${id}`);
};

const isCellSelected = (id) => selectedCell === id;

const polyCoords = [
  { id: "cell1", points: "90,240 230,240 250,320 90,320" },
  { id: "cell2", points: "90,370 230,370 250,450 90,450" },
  { id: "cell3", points: "320,240 440,240 480,320 320,320" },
  { id: "cell4", points: "320,370 460,370 480,450 320,450" },
  { id: "cell5", points: "580,240 700,240 720,320 580,320" },
  { id: "cell6", points: "580,370 720,370 740,450 580,450" },
  { id: "cell7", points: "810,240 950,240 970,320 810,320" },
  { id: "cell8", points: "71,85,66,167,144,201,128,161" },

  
];

useEffect(() => {
  ReactGA.pageview(window.location.pathname + window.location.search);
}, []);

  return (
    <div className="aspect-w-1 aspect-h-1">
    <div
    className="bg-cover bg-center bg-plots h-[1600px] w-[1600px] overflow-hidden"
  >
      <svg
        className="absolute top-0 left-0 w-[1600px] h-[1600px] overflow-hidden"
        viewBox="0 0 1600 1600"
      >
        {polyCoords.map((coord) => (
          <polygon
            key={coord.id}
            id={coord.id}
            className={`${
              isCellSelected(coord.id)
                ? "fill-white opacity-40"
                : "fill-transparent"
            } stroke-black`}
            points={coord.points}
            onClick={() => handleCellClick(coord.id)}
          />
        ))}
      </svg>
    </div>
  </div>
   /* <div className="container">
    <div
      className="relative bg-cover bg-center w-[1600px] h-[1600px] bg-botbg"
   
    >
      <div
        className="absolute top-0 left-0 grid grid-cols-22 grid-rows-22 gap-0 w-full h-full"
        style={{ gridTemplateColumns: "repeat(22, 1fr)" }}
      >
        {[...Array(610)].map((_, i) => {
          const x = i % 22;
          const y = Math.floor(i / 22);
          return (
            <div
              key={`${x}-${y}`}
              className={`${
                isCellSelected(x, y)
                  ? "bg-white bg-opacity-60"
                  : "bg-transparent"
              } border border-black`}
              onClick={() => handleCellClick(x, y)}
              style={{ gridColumn: `${x + 1}`, gridRow: `${y + 1}` }}
            />
          );
        })}
      </div>
    </div>
  </div>*/
  );
}

export default Plots;
