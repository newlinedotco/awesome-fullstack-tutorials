# A guide to using React Hooks
React Hooks is a new feature proposal that introduced to the public at the recent [ReactConf](https://www.youtube.com/watch?v=dpw9EHDh2bM) by the React team. Hooks are a new feature proposal that lets you use state and other React features without writing a class. 


## Motivation behind Hooks

The Hooks feature is a welcome change as it solves many of the problems React devs have faced over the years. One of those problems is the case of React having support for reusable state logic between components. This can sometimes lead to huge components, duplicated logic in the constructor and lifecycle methods.

Inevitably, this forces us to use some complex patterns such as render props and higher order components and that can lead to complex codebases.

Hooks aims to solve all of these by enabling you to write functional components that have access to features like state, context, lifecycle methods, ref, etc. without writing the class component.

Also by introducing Hooks, this means that you can improve development experience as using classes can sometimes make hot reloading flaky and unreliable.

## Different types of Hooks

There are various types of Hooks that you can begin to use in your React code. They are listed below:


- [useState](https://reactjs.org/docs/hooks-reference.html#usestate) - useState allows us to write pure functions with state in them.
- [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect) - The useEffects hook lets us perform side effects. Side effects can be API calls, Updating DOM, subscribing to event listeners.
- [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) - useContext allows to write pure functions with context in them. 
- [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) - useReducer
- [useRef](https://reactjs.org/docs/hooks-reference.html#useref) - useContext allows to write pure functions that return a mutable `ref` object.
- [useMemo](https://reactjs.org/docs/hooks-reference.html#usememo) - useMemo is used to return a memoized value.
- [useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback) - the useCallback Hook is used to return a memoized callback.
- [useImperativeMethods](https://reactjs.org/docs/hooks-reference.html#useimperativemethods) - useImperativeMethods customizes the instance value that is exposed to parent components when using `ref`.
- [useMutationEffects](https://reactjs.org/docs/hooks-reference.html#usemutationeffect) - the useMutationEffect is similar to the useEffect Hook in the sense that it allows you perform DOM mutations.
- [useLayoutEffect](https://reactjs.org/docs/hooks-reference.html#uselayouteffect) - The useLayoutEffect hook is used to read layout from the DOM and synchronously re-render.
- Custom Hooks - Custom Hooks allows you to write component logic into reusable functions.
## Examples on using Hooks

With React Hooks you can simulate the following in functional components:

- Component state using the `useState()` hook.
- Lifecycle methods like componentDidMount() and componentDidUpdate() using the `useEffect()` hook.
- Static contextType using the `useContext()` hook.
- Custom hooks that are reusable

Let’s take a look at some examples on how to use the various types of React Hooks. You can get started with Hooks right now by setting `react` and `react-dom` in your package.json file to `next` .

```javascript
// package.json
"react": "next",
"react-dom": "next"
```

**useState() Hook**

States are an essential part of React. They allow us to declare state variables that hold pertinent data that will be used in React app. States are usually defined like this:

```javascript
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

States are usually only used in a Class component but as mentioned above, Hooks allows us to add state to a functional component. Let's see an example below. We'll be building a switch for a lightbulb using `useState`.

```javascript
import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function LightBulb() {
  let [light, setLight] = useState(0);

  const setOff = () => setLight((light = 0));
  const setOn = () => setLight((light = 1));

  let yellowColor;

  light === 1 ? (yellowColor = "#ffbb73") : (yellowColor = "#000000");

  return (
    <div className="App">
      <div>
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
                fill={yellowColor}
              />
            </g>
          </g>
        </svg>
      </div>

      <button onClick={setOff}>Off</button>
      <button onClick={setOn}>On</button>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<LightBulb />, rootElement);
```

<iframe src="https://codesandbox.io/embed/6vv9xxwyww?moduleview=1" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

In the code block above, we start by importing `useState` from `react`. `useState` is a new way to use the exact same capabilities that `this.state` would have offered. Next, we actually use `useState` to create a state variable.

```javascript
let [light, setLight] = useState(0);
```

useState is used to declare a state variable and it's initialised with any type of value, not necessarily an object, unlike state classes. As seen above, we set the useState to a destructuring array. The first value, `light` in this case is the actual state (`this.state`) and the second value is the method used to update the first value, just like the traditional `this.setState`.

We have two functions that set the state to different values, 0 and 1. The functions are then passed as event handlers to the buttons in the `return` function.

The current state is then used to determine whether the bulb should be on or not. The fill color of the SVG in the code is determined by the state. If it's 0 (off), it's set to `#000000` and if it's 1 (on), it's set to `#ffbb73`

Multiple states can also be created in the similar fashion as above.

```javascript
let [light, setLight] = useState(0);
let [count, setCount] = useState(10);
let [name, setName] = useState('Yomi');
```

**useEffect() Hook**

As mentioned above, the useEffect Hook lets you perform side effects in function components. Side effects can be API calls, Updating DOM, subscribing to event listeners.

By using the useEffect() Hook, React knows that you'd like to carry out a certain action after it's done rendering. Let's look at an example below. We'll be using the useEffect() hook to make API calls and get the response.

```javascript
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function App() {
  let [names, setNames] = useState([]);

  useEffect(() => {
    fetch("https://uinames.com/api/?amount=25&region=nigeria")
      .then(response => response.json())
      .then(data => {
        setNames(data);
      });
  }, []);

  return (
    <div className="App">
      <div>
        {names.map((item, i) => (
          <div key={i}>
            {item.name} {item.surname}
          </div>
        ))}
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

```

<iframe src="https://codesandbox.io/embed/5k9ko0287n?moduleview=1" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

As seen in the code block above, both `useState` and `useEffect` are imported and that's because we'd like to set the result from the API call to a state. To 'use an effect', you need to place your action in the `useEffect` function. In our example above, we're making an API call to an endpoint that returns a list of names, and then setting the result to a state using a `useState` variable. How wonderful!

There are some things to note about using `useEffect` though. One of which is that whatever is passed to `useEffect` will be different on every render. This is because it allows us to always us to get the `names` value from inside the effect without needing to worry about stale data.

The other thing is making sure that memory leaks are being prevented by 'cleaning up' after the effect. Cleaning up effects can be useful for a case where subscriptions are used in the `useEffect` function. See below an example from the React [docs](https://reactjs.org/docs/hooks-effect.html#example-using-hooks-1).

```javascript
import { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

The `cleanup` function returned in the `useEffect` function is what tells React to cleanup after the initial effect has been carried out. Therefore every effect can return a cleanup function if there is a need.

Also, just like `useState` function above, `useEffect` allows for multiple instances, which means you can have several `useEffect` functions.

**useContext() Hook**

Context in React is a way for a child component to access a value in a parent component. React Context solves the problem of props drilling by allowing you to share props or state with an indirect child or parent.

Prop drilling occurs in situations where you’re looking to get the state from the top of your React tree to the bottom and you end up passing props through components that do not necessarily need them.

With the `useContext` Hook, you can begin writing better Context code. The `useContext` function accepts a context object, which is initially returned from an already created context using React.createContext, and then returns the current context value. Let's look at an example below.

```javascript
import React, { useContext } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

const JediContext = React.createContext();

function Display() {
  const value = useContext(JediContext);
  return <div>{value}, I am your Father.</div>;
}

function App() {
  return (
    <JediContext.Provider value={"Luke"}>
      <Display />
    </JediContext.Provider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

<iframe src="https://codesandbox.io/embed/3q2x15l4rm" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

In the code above, the context is first created using `React.createContext()` and in the `Display(`) function, useContext is initialised.

We then pass in the context object we got from `React.createContext`, and it automatically outputs the value. When the value of the provider updates, this Hook will trigger a rerender with the latest context value.

**useRef() Hook**

Refs provide a way to access the React elements created in the `render()` method. If you're new to React refs, you can read this great introduction to React refs [here](https://www.fullstackreact.com/articles/using-refs-in-react/). `useRef` returns a mutable ref object which has the `current` property passed as an argument (`initialValue`).

```javascript
const refContainer = useRef(initialValue);
```

Let's see an example on using the `useRef` hook.

```javascript
import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function App() {
  let [name, setName] = useState("Nate");

  let nameRef = useRef();

  const submitButton = () => {
    setName(nameRef.current.value);
  };

  return (
    <div className="App">
      <p>{name}</p>

      <div>
        <input ref={nameRef} type="text" />
        <button type="button" onClick={submitButton}>
          Submit
        </button>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

<iframe src="https://codesandbox.io/embed/v6948pww5y" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

In the example above, we're using the `useRef()` hook in conjunction with the `useState()` to spit out whatever is typed into an input field.

The ref is instantiated into the `nameRef` variable. The `nameRef` variable can then be used in the input field by being set as the `ref`. That basically means the content of the input field will now be in the ref.

The submit button in the code has an onClick event handler called `submitButton`. The `submitButton` function contains `setName`, gotten from `useState`, `setName`is then used to set the state `name` to the value (nameRef.current.value) in `nameRef`.

Another thing to note concerning `useRef` is the fact that it can be used for more than the `ref` attribute. It can be useful for keeping any mutable value around. The `current` property is mutable and can hold any value, similar to an instance property on a class.



**useMemo() Hook**

The `useMemo()` Hook is used to return a memoized value. A memoized value is one which has been stored or cached.

The `useMemo()` hook is passed a create function and an array of inputs. `useMemo` will only recompute the memoized value when one of the inputs has changed. This optimization helps to avoid expensive calculations on every render.

An example from the React [docs](https://reactjs.org/docs/hooks-intro.html).

```javascript
import React, { useMemo } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

function App({ a, b }) {
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
  return <span>{memoizedValue}</span>;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

```

**useReducer() Hook**

The `useReducer `Hook is an alternative to the `useState` Hook. It's used in cases where you have complex state logic that involves multiple sub-values. It also lets you optimize performance for components that trigger deep updates.

Even though the name of this particular hook has 'reducer' in it, Redux is not needed to use the `useReducer` hook

Here's an example from the React docs:

```javascript
import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "reset":
      return initialState;
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
  }
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Counter />, rootElement);

```

<iframe src="https://codesandbox.io/embed/mzxl7k4k48" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>In the code above, `useReducer` is imported from React and a `const` variable `initialState` is created and set to an object.

The `useReducer` hook accepts a reducer function and an initial state, and then returns the current state paired with a `dispatch` method.

Reducers in JavaScript are basically functions that takes 2 values and returns 1 value and the same logic applies for `useReducer` too. Before you begin to use `useReducer`, you need to have a reducer function and that's why the function `reducer()` is created. 

The function takes in two values, state and action. The type of action, `action.type` is then used to determine what should be done to the state. Event handlers are then hooked up to the buttons that dispatches the action type to the reducer function.

The `useReducer` hook also accepts an optional third argument, `initialAction` which when provided, applies an initial action on the first render.

```javascript
import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "reset":
      return initialState;
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
  }
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialState, {
    type: "increment",
    payload: 1
  });
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Counter />, rootElement);

```

<iframe src="https://codesandbox.io/embed/nrq333x0vj" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

**Using Custom Hooks**

Custom Hooks makes it possible to easy to share logic across multiple components by making a custom hook. They are JavaScript functions whose name starts with ”use” and can use other Hooks.

In the example below, we're making the setCount Hook into it's own function and that can be then be reused.

```javascript
import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

function useCounter({ initialState }) {
  const [count, setCount] = useState(initialState);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  return { count, increment, decrement, setCount };
}

function App() {
  const { count, increment, decrement } = useCounter({ initialState: 0 });
  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

<iframe src="https://codesandbox.io/embed/jlx6xmlknw" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

As seen in the code block above, a function called `useCounter `is created and it contains the setState Hook which is being used to set the state. The function then returns an object of values which can be used in other components e.g the `App` function.



## Writing Tests for React Hooks

**Writing tests for useState() Hook**

In order to write tests for the hooks, we'll be using the [react-testing-library](https://github.com/kentcdodds/react-testing-library) to test them. react-testing-library is a very light-weight solution for testing React components. It extends upon `react-dom` and `react-dom/test-utils` to  provides light utility functions. Using react-testing-library ensures that your tests work on the DOM nodes directly.

Let's see an example on writing tests for the `useState `Hook. In the lesson above, we are testing a more variation of the useState example we used above. We'll be writing tests to ensure that clicking on an "Off" button sets the state to 0 and clicking on an "On" button sets the state to 1.

```javascript
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

```

<iframe src="https://codesandbox.io/embed/x22k03k1nw?module=%2Fsrc%2F__tests__%2Ftesthooks.js&view=editor" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

In the code block above, we start by importing some helpers from `react-testing-library` and the component to be tested.

- `render`, this will help render our component. It renders into a container which is appended to `document.body`
- `getByTestId`, this fetches a DOM element by `data-testid`.
- `fireEvent`, this is used to "fire" DOM events. It attaches an event handler on the `document` and handles some DOM events via event delegation e.g. clicking on a button.

Next, in the test assertion function, we create constant variables for the `data-testid`  elemtents and their values that we'd like to use in the test. With references to the elements on the DOM, we can then use the `fireEvent` method to simulate clicking on the button.

The test checks that if the `onButton` is clicked on, the state is set to 1 and when the `offButton` is clicked on, the state is set to 1.

**Writing tests for useEffect() Hook**

For this example, we'll be writing tests to add an item to cart using the `useEffect` Hook. The count of the item is also stored in the `localStorage`. The `index.js` file in the CodeSandbox below contains the actual logic used to add items to cart. 

We'll be writing tests to ensure that updating the cart item count is also reflected in the localStorage and even if there's a page reload, the cart item count still persists.

```javascript
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

```

<iframe src="https://codesandbox.io/embed/2wwm826x5r?module=%2Fsrc%2F__tests__%2Ftesthooks.js&moduleview=1&view=editor" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

In the test assertion function, we are first setting the `cartItem` in the `localStorage` to 0, which means the cart item count is 0. We then get both `container` and `rerender` from the `App` component via destructuring. The `rerender` allows us to simulate a page reload.

Next, we get references to the buttons and `p` tag which displays the current cart item count and set them to constant variables.

Once that's done, the test then simulates clicking on the `addButton` and checks if the current cart item count is `1` and reloads the page, after which if it checks if the `localStorage` count, `cartItem`, is also set to `1`. It then simulates clicking on the `resetButton`  and checks if the current cart item count is set to `0`.

**Writing tests for useRef() Hook**

For this example, we'll be testing the `useRef` Hook and we'll be using the original `useRef` example up above as a base for the test. The `useRef` hook is used to get the value from an `input` field and then set to a state value. The `index.js` file in the CodeSandbox below contains the logic of typing in a value and submitting it. 

```javascript
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

```



<iframe src="https://codesandbox.io/embed/4094rk76j0?module=%2Fsrc%2F__tests__%2Ftesthooks.js&moduleview=1&view=editor" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

In the test assertion function, we are setting the constant variables to the iput field, the` p` tag which displays the current ref value, and the submit button. We are also setting the value we'd like to be entered into the input field to a constant variable `newName`. This will be used to do checks in the test.

```javascript
fireEvent.change(inputName, { target: { value: newName } });
```

The `fireEvent.change` method is used to enter a value into the input field and in this case, the name stored in the `newName` constant variable is used, after which the submit button is clicked on.

The test then checks if the value of the ref after the button was clicked is equal to the the `newName`. 

Finally, you should see a `There are no failing tests, congratulations!` message in the console.


## Community Reaction to Hooks

Ever since the news about React hooks, the community has been stoked about the experimental feature and we've seen a plethora of examples and use cases for React Hooks. Here are some of the highlighted ones:

- This [website](https://nikgraf.github.io/react-hooks/) which showcases a collection of React Hooks.
- [react-use](https://github.com/streamich/react-use), a library that ships with a bunch of React Hooks.
- This [CodeSandbox](https://codesandbox.io/s/ppxnl191zx?from-embed) example that shows how to use the `useEffect` Hook to create animations with [react-spring](https://github.com/drcmda/react-spring).
- [An example](https://gist.github.com/aweary/be8338a211e72b9f1563d75091005c0e) of a useMutableReducer hook that lets you just mutate the state to update it in the reducer. 
- This [CodeSandbox](https://codesandbox.io/s/y570vn3v9) example that shows complex usage of the child-parent communication and reducer usage.
- A [toggle component](https://codesandbox.io/s/m449vyk65x) built with React Hooks.
- [Another collection](https://rehooks.com/) of React Hooks that features hooks for input values, device orentation and document visibility.

## Future of Hooks

The good thing about Hooks is that it works side-by-side with existing code so you begin to slowly make changes that adopt Hooks. All you have to do is upgrade your React version that has the Hooks feature, even though it goes with out saying that Hooks are still an experimental feature.

What does the emergence of Hooks mean for Classes though? According to the React team, Classes are still here to stay, they are a huge part of the React codebase and most likely to be around for a while.

> We have no plans to deprecate classes. At Facebook we have tens of thousands of class components and, like you, we have no intention of rewriting them. But if the React community embraces Hooks, it doesn’t make sense to have two different recommended ways to write components.  - Dan Abramov

The React team has done a wonderful job of documenting React Hooks and you more about that [here](https://reactjs.org/docs/hooks-overview.html) and check out the [API Reference here](https://reactjs.org/docs/hooks-reference.html). There's also an ongoing RFC, it's an experimental feature, so you can head over [there](https://github.com/reactjs/rfcs/pull/68) to ask questions or drop comments.

****
