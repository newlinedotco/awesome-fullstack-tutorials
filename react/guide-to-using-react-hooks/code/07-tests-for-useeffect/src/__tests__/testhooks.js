import React from "react";
import { render, fireEvent, getByTestId } from "react-testing-library";
// import the App component
import App from "../index";

test("cart item is updated", () => {
  // set the localStorage count to 0
  window.localStorage.setItem("cartItem", 0);
  // get the containing DOM node of your rendered React Element
  const { container, rerender } = render(<App />);
  // this references the add button which increments the cart item count
  const addButton = getByTestId(container, "addButton");
  // this references the reset button which resets the cart item count
  const resetButton = getByTestId(container, "resetButton");
  // this references the p tag that displays the cart item count
  const countTitle = getByTestId(container, "countTitle");

  // this simulates clicking on the add button
  fireEvent.click(addButton);
  // the test expects the cart item count to be 1
  expect(countTitle.textContent).toBe("Cart Item - 1");
  // this imulates reloading the app
  rerender(<App />);
  // the test still expects the cart item count to be 1
  expect(window.localStorage.getItem("cartItem")).toBe("1");
  // this simulates clicking on the reset button
  fireEvent.click(resetButton);
  // the test expects the cart item count to be 0
  expect(countTitle.textContent).toBe("Cart Item - 0");
});
