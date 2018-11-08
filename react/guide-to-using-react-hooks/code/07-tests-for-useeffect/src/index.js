import React, { useState, useEffect } from "react";
import "./styles.css";

function App() {
  let initialState = Number(window.localStorage.getItem("cartItem")) || 0;
  let [cartItem, setCartItem] = useState(initialState);

  const addToCart = () => setCartItem(cartItem + 1);
  const resetCart = () => setCartItem((cartItem = 0));

  useEffect(
    () => {
      window.localStorage.setItem("cartItem", cartItem);
    },
    [cartItem]
  );

  return (
    <div className="App">
      <p data-testid="countTitle">Cart Item - {cartItem}</p>
      <button data-testid="addButton" onClick={addToCart}>
        Add to Cart
      </button>
      <button data-testid="resetButton" onClick={resetCart}>
        Reset
      </button>
    </div>
  );
}

export default App;
