import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

function useCounter({ initialState }) {
  const [count, setCount] = useState(initialState);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  return [count, { increment, decrement, setCount }];
}

function App() {
  const [myCount, { increment, decrement }] = useCounter({ initialState: 0 });
  return (
    <div>
      <p>{myCount}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
