import React from 'react'
import traits from '../traits';

function Card(props) {
  return (


    <div className="hover:z-0 rounded overflow-hidden shadow-lg bg-slate-700 hover:text-bold hover:scale-105 hover:bg-slate-500 duration-300">
      <img className="w-full" src={props.image}></img>
      <div className="px-6 py-4">
        <div className="font-bold text-l mb-2 pt-6">
          <div className="text-white text-xl pb-2">Claim with</div>
          <h4>{props.nftName}</h4>
          <h4>ID: {props.id}</h4>
        </div>
      </div>
      <div className="px-6 pt-4 pb-2">
      </div>
    </div>


  )
}
export default Card;