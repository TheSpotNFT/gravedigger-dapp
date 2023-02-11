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


    <div className="hover:z-0 rounded overflow-hidden shadow-lg duration-300">
      <img className="w-full" src={props.image} alt={props.alt}></img>
      <div className="px-6 py-4">


      </div>
    </div>


  )
}
export default Card;