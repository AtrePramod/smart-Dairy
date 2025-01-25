import React, { useState } from 'react'
import "../../Styles/AssetsComponents/Toggle.css"

const Toggle = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleChange = () => {
    setIsToggled(!isToggled);
  };

  return (
    <button
      onClick={handleChange}
      className={`toggle-button ${isToggled ? "on" : "off"}`}>
      {isToggled ? "Yes" : "No"}
    </button>
  );
}

export default Toggle
