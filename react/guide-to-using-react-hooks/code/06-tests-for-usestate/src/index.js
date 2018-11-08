import React, { useState } from "react";

import "./styles.css";

function LightBulb() {
  let [light, setLight] = useState(0);

  const setOff = () => setLight((light = 0));
  const setOn = () => setLight((light = 1));

  return (
    <div className="App">
      <p data-testid="lightState">{light}</p>

      <button data-testid="offButton" onClick={setOff}>
        Off
      </button>
      <button data-testid="onButton" onClick={setOn}>
        On
      </button>
    </div>
  );
}

export default LightBulb;
