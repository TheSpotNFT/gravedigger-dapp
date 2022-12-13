import React from 'react'

function Card(props) {
  return (


    <div className="hover:z-0 rounded overflow-hidden shadow-lg bg-slate-700 hover: hover:scale-105 hover:bg-slate-500 duration-300 w-[200px] snap-start">
      <img className="w-full" src={props.image} alt={props.nftName}></img>
      <div className="px-0 py-4">
        <div className="font-bold text-xs mb-2">
          <h3>NFT: {props.nftName}</h3>
          <h3>ID: {props.id}</h3>
        </div>
      </div>
      <div className="px-6 pt-4 pb-2">
      </div>
    </div>


  )
}
export default Card;