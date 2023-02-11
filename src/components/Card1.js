import "./card.css";
import "./flip-transition.css";
import Card from "./MainCard";
import scribbleFront from "../assets/scribble/CARD_PLACEHOLDER.jpg";
import scribbleBack from "../assets/scribble/CC3.png";

function Card1({onClick}) {
  return (
    <div className="card" onClick={onClick}>
      <div className="card-back"><Card 
      image={scribbleBack}
      alt="The Spot"
      /></div>
      <div className="card-front"><Card 
      image={scribbleFront}
      alt="The Spot"
      /></div>
    </div>
  );
}

export default Card1;
