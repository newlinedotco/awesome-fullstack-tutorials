import React from "react";
import { render, fireEvent, getByTestId } from "react-testing-library";
// import the App component
import App from "../index";

test("input field is updated", () => {
  // get the containing DOM node of your rendered React Element
  const { container } = render(<App />);
  // this references the input field button
  const inputName = getByTestId(container, "nameinput");
  // this references the p tag that displays the value gotten from the ref value
  const name = getByTestId(container, "name");
  // this references the submit button which sets the state value to the ref value
  const submitButton = getByTestId(container, "submitButton");
  // the value to be entered in the input field
  const newName = "Yomi";

  // this simulates entering the value 'Yomi' into the input field
  fireEvent.change(inputName, { target: { value: newName } });
  // this simulates clicking on the submit button
  fireEvent.click(submitButton);
  // the test expects the name display reference to be equal to what was entered in the input field.
  expect(name.textContent).toEqual(newName);
});
