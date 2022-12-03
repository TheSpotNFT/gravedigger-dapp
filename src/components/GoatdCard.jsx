import React from 'react'

function Card(props) {
  return (


    <div className="rounded overflow-hidden shadow-lg bg-slate-700 hover: hover:scale-105 hover:bg-slate-500 duration-300 md:w-[200px] sm:w-[150px]">
      <img className="w-full" src={props.image} alt={props.traitName}></img>
      <div className="px-6 py-4">
        <div className="font-bold sm:text-sm sm:text-bold md:text-xl mb-2"><h3>Trait Name: </h3><h3>{props.traitName}</h3></div>
        <div className="text-slate-50 text-base">
          <h4>Trait Type:</h4>
          <h4> {props.traitType}</h4>
          <div className='grid sm:grid-cols-1 md:grid-cols-2'><div>Rarity: </div><div className='items-start'>{props.rarity}</div></div>

          <h5>ID: {props.id}</h5>
        </div>
      </div>
      <div className="px-6 pt-4 pb-2">
      </div>
    </div>


  )
}
export default Card;