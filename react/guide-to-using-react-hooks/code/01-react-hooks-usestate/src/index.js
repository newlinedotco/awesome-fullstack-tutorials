import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function LightBulb() {
  let [light, setLight] = useState(0);

  const setOff = () => setLight(0);
  const setOn = () => setLight(1);

  let fillColor = light === 1 ? "#ffbb73" : "#000000";

  return (
    <div className="App">
      <div>
        <LightbulbSvg fillColor={fillColor} />
      </div>

      <button onClick={setOff}>Off</button>
      <button onClick={setOn}>On</button>
    </div>
  );
}

function LightbulbSvg(props) {
  return (
    /*
      Below is the markup for an SVG that is the shape
      of a lightbulb.
      The important part is the `fill`, where we set the
      color dynamically based on props
    */
    <svg width="56px" height="90px" viewBox="0 0 56 90" version="1.1">
      <defs />
      <g
        id="Page-1"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      >
        <g id="noun_bulb_1912567" fill="#000000" fill-rule="nonzero">
          <path
            d="M38.985,68.873 L17.015,68.873 C15.615,68.873 14.48,70.009 14.48,71.409 C14.48,72.809 15.615,73.944 17.015,73.944 L38.986,73.944 C40.386,73.944 41.521,72.809 41.521,71.409 C41.521,70.009 40.386,68.873 38.985,68.873 Z"
            id="Shape"
          />
          <path
            d="M41.521,78.592 C41.521,77.192 40.386,76.057 38.986,76.057 L17.015,76.057 C15.615,76.057 14.48,77.192 14.48,78.592 C14.48,79.993 15.615,81.128 17.015,81.128 L38.986,81.128 C40.386,81.127 41.521,79.993 41.521,78.592 Z"
            id="Shape"
          />
          <path
            d="M18.282,83.24 C17.114,83.24 16.793,83.952 17.559,84.83 L21.806,89.682 C21.961,89.858 22.273,90 22.508,90 L33.492,90 C33.726,90 34.039,89.858 34.193,89.682 L38.44,84.83 C39.207,83.952 38.885,83.24 37.717,83.24 L18.282,83.24 Z"
            id="Shape"
          />
          <path
            d="M16.857,66.322 L39.142,66.322 C40.541,66.322 41.784,65.19 42.04,63.814 C44.63,49.959 55.886,41.575 55.886,27.887 C55.887,12.485 43.401,0 28,0 C12.599,0 0.113,12.485 0.113,27.887 C0.113,41.575 11.369,49.958 13.959,63.814 C14.216,65.19 15.458,66.322 16.857,66.322 Z"
            id="Shape"
            fill={props.fillColor}
          />
        </g>
      </g>
    </svg>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<LightBulb />, rootElement);
