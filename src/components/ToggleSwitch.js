// ToggleSwitch.js
import React, { useState } from 'react';

const ToggleSwitch = () => {
  const [isToggled, setToggled] = useState(false);

  const handleToggle = () => {
    setToggled(!isToggled);
  };

  return (
    <div className={`w-full rounded-lg sm:px-4 md:px-4 lg:px-2 xl:px-4 px-4 py-2 border-4 border-spot-yellow text-spot-yellow bg-slate-900 bg-opacity-60 ${isToggled ? 'bg-spot-yellow text-black border-white' : ''} hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono sm:text-xs md:text-lg 2xl:text-xl flex justify-center`} onClick={handleToggle}>
      {isToggled ? 'Toggled On' : 'Toggled Off'}
    </div>
  );
};

export default ToggleSwitch;
