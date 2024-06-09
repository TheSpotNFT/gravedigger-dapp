import { React, useEffect, useState } from "react";
import ReactGA from 'react-ga';
import "../../index.css";
import { useAuth } from "../../Auth";
import PlotCard from "../PlotCard"; // Import the PlotCard component
import PlotMeta from "../../PlotMeta.json"; // Assuming local JSON file

ReactGA.initialize('G-YJ9C2P37P6');

export const Plots = () => {
  const [plotData, setPlotData] = useState([]);

  useEffect(() => {
    setPlotData(PlotMeta); // Load data from the JSON file
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-16">
      {plotData.map((plot) => (
        <PlotCard key={plot.TokenID} plot={plot} />
      ))}
    </div>
  );
};

export default Plots;
