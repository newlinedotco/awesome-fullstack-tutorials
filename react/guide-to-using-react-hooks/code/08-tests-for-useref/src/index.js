import React, { useState, useRef } from "react";
import "./styles.css";

function App() {
  let [name, setName] = useState("Nate");

  let nameRef = useRef();

  const submitButton = () => {
    setName(nameRef.current.value);
  };

  return (
    <div className="App">
      <p data-testid="name">{name}</p>

      <div>
        <input data-testid="nameinput" ref={nameRef} type="text" />
        <button data-testid="submitButton" type="button" onClick={submitButton}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default App;
