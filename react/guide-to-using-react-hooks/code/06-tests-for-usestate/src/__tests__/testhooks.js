import React from "react";
import { render, fireEvent, getByTestId } from "react-testing-library";
// import the lighbulb component
import LightBulb from "../index";

test("bulb is on", () => {
  // get the containing DOM node of your rendered React Element
  const { container } = render(<LightBulb />);
  // the p tag in the LightBulb component that contains the current state value
  const lightState = getByTestId(container, "lightState");
  // this references the on button
  const onButton = getByTestId(container, "onButton");
  // this references the off button
  const offButton = getByTestId(container, "offButton");

  //simulate clicking on the on button
  fireEvent.click(onButton);
  // the test expects the state to be 1.
  expect(lightState.textContent).toBe("1");
  //simulate clicking on the off button
  fireEvent.click(offButton);
  // the test expects the state to be 1.
  expect(lightState.textContent).toBe("0");
});
