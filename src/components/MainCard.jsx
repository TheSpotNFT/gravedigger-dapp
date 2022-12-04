import React from 'react'



function Card(props) {

  const onClickUrl = (url) => {
    return () => openInNewTab(url);
  };
  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  return (


    <div className="w-full rounded overflow-hidden shadow-lg bg-slate-700 hover: hover:scale-105 hover:bg-slate-500 duration-300">
      <img className="w-full" src={props.image} alt={props.alt}></img>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 flex justify-center">
          <h1>{props.title}</h1>
        </div>

        <div className="text-slate-50 text-base">
          <div className="flex flex-col gap-4 px-1 py-4 place-contents-center">
            <button
              className="align-middle w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
      hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l flex justify-center"
              onClick={onClickUrl(props.link)}
            >
              {props.button}
            </button>

          </div>
        </div>
      </div>
    </div>


  )
}
export default Card;