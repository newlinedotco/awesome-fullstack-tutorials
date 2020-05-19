---
page_id: guide-to-using-hooks-in-react
permalink: guide-to-using-hooks-in-react
title: "Guide to using Hooks in React"
subtitle: ""
draft: false
published: true
date: "Thu Nov 7th 2018 14:53:26 GMT-0700 (PDT)"
autotoc: true
fileMetaKeyHeadingsAllowed: true
authors: ["yomi", "nate"]
hero_image: /assets/images/articles/refs-guide/guide-to-refs.jpg
main_image: /assets/images/articles/refs-guide/thumb/guide-to-refs.jpg
---

# A guide to using React Hooks

If you've been reading Twitter you probably are aware that Hooks are a new feature of React, but you might be asking **how do we actually use them?** In this post, we're going to show you a bunch of examples on how to use hooks.

One of the key ideas to understand is that **Hooks let you use state and other React features without writing a class.**

## Motivation behind Hooks

While component-based design lets us reuse _views_ across our app, one of the biggest problems React developers face is how we can **reuse state logic between components**. When we have components that share similar state logic, there hasn't been great solutions for reuse and this can sometimes lead to duplicated logic in the constructor and lifecycle methods.

The typical way to deal with this has traditionally been either:

* higher-order components or
* render props complex 

But both of these patterns have drawbacks that can contribute to complex code-bases.

**Hooks aims to solve all of these by enabling you to write functional components that have access to features like state, context, lifecycle methods, ref, etc. without writing the class component.**

## Hooks are Alpha

> Before we dive in, it's important to mention that the Hooks API is not finalized.
>
> Also, [the official docs](https://reactjs.org/docs/hooks-intro.html) are very good and we recommend that you read them, in particular, because they expand on the motivations of Hooks.

## Table of Contents

<!-- toc -->
<!-- tocstop -->

## How Hooks Map to Component Classes

If you're familiar with React, one of the best ways to understand hooks is by looking at how we reproduce the behavior we're used to in "component classes" by using hooks.

Recall that when writing component classes we often need to:

- Maintain `state`
- Use lifecycle methods like `componentDidMount()` and `componentDidUpdate()`
- Access context (by setting `contextType`)

With React Hooks we can replicate a similar/the same behavior in functional components:

- Component state uses the `useState()` hook.
- Lifecycle methods like `componentDidMount()` and `componentDidUpdate()` use the `useEffect()` hook.
- Static contextType uses the `useContext()` hook.

## Using Hooks Requires `react` `"next"`

You can get started with Hooks right now by setting `react` and `react-dom` in your package.json file to `next` .

```javascript
// package.json
"react": "next",
"react-dom": "next"
```

## useState() Hook Example

State are an essential part of React. They allow us to declare state variables that hold data that will be used in our app. With class components, state is usually defined like this:

```javascript
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

Before hooks, state was usually only used in a class component but as mentioned above, **Hooks allows us to add state to a functional component**.

Let's see an example below. Here, we'll be building a switch for a lightbulb SVG, which will change color depending on the value of the state. To do this, we'll be using the `useState` hook.

Here's the complete code (and runnable example) -- we'll walk through what's going on below.

```javascript
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
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<LightBulb />, rootElement);

```

<iframe src="https://codesandbox.io/embed/mpnoljl19?moduleview=1" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Our Component is a Function

In the code block above, we start by importing `useState` from `react`. `useState` is a new way to use the capabilities that `this.state` would have offered. 

Next, notice that this component is **a function and not a class**. Interesting!

### Reading and Writing State

Within this function, we call `useState` to create a state variable:

```javascript
let [light, setLight] = useState(0);
```

**`useState` is used to declare a state variable** and can be initialized with **any** type of value (unlike state in classes, which were required to be an object). 

As seen above, we use destructuring on the return value of `useState`. 

- The first value, `light` in this case, is the current state (sort of like `this.state`) and 
- The second value is **a function used to update the state (first) value** (like the traditional `this.setState`).

Next, we create two functions that each set the state to different values, 0 or 1. 

```javascript
const setOff = () => setLight(0);
const setOn = () => setLight(1);
```

We then use these functions as event handlers to the buttons in the view:

```javascript
<button onClick={setOff}>Off</button>
<button onClick={setOn}>On</button>
```

### React Tracks the State

When the "On" button is pressed, `setOn` is called, which will call `setLight(1)`. The call to `setLight(1)` **updates the value of `light` on the next render**. This can feel a bit magical, but what is happen is that **React is tracking the value of this variable** and it will pass in the new value when it re-renders this component. 

Then, we use the current state (`light`) to determine whether the bulb should be "on" or not. That is, we set the fill color of the SVG depending on the value of `light`. If `light` is 0 (off), then the `fillColor` is set to `#000000` (and if it's 1 (on), `fillColor` is set to `#ffbb73`).

### Multiple States

While we don't do this in the above example, you **can** create multiple states by calling `useState` more than once. E.g.: 

```javascript
let [light, setLight] = useState(0);
let [count, setCount] = useState(10);
let [name, setName] = useState("Yomi");
```

> NOTE: There are some constraints when using hooks that you should be aware of. The most important one is that you **must only call hooks at the top level of your function**. See [The Rules of Hooks](https://reactjs.org/docs/hooks-rules.html) for more information.

## useEffect() Hook Example

**The `useEffect` Hook lets you perform side effects in function components.** Side effects can be API calls, Updating DOM, subscribing to event listeners - anything where you want an "imperative" action to happen.

By using the `useEffect()` Hook, React knows that you'd like to carry out a certain action after it's done rendering. 

Let's look at an example below. We'll be using the `useEffect()` hook to make API calls and get the response.

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

In this code example both `useState` and `useEffect` are imported and that's because we'd like to **set the result from the API call to a state**. 

```javascript
import React, { useState, useEffect } from "react";
```

### Fetch Data and Update State

To "use an effect", we need to place our action in the `useEffect` function - that is, we pass our effect "action" as an anonymous function as the first argument to `useEffect`. 

In our example above, we make an API call to an endpoint that returns a list of names. When the `response` comes back, we convert it to JSON and then use `setNames(data)` to set the state.

```javascript
  let [names, setNames] = useState([]);

  useEffect(() => {
    fetch("https://uinames.com/api/?amount=25&region=nigeria")
      .then(response => response.json())
      .then(data => {
        setNames(data);
      });
  }, []);
```

### Performance Concerns When Using Effects

There are some things to note about using `useEffect` though. 

The first one to think about is that, by default, our `useEffect` will be called on every render! The good news is that we don't need to worry about stale data, but the bad news is that we probably don't want to make an HTTP request on every render (as in this case). 

You can skip effects by **using the second argument to `useEffect`**, as we did in this case. The second argument to `useEffect` is a list of variables we want to "watch" and then we will only re-run the effect when one of those values changes. 

In the above code example, notice that we pass **an empty array** as the second argument. That is us telling React that we only want to call this effect when the component is mounted. 

> To learn more about Effect performance, [checkout this section in the official docs](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects)

Also, just like `useState` function above, `useEffect` allows for multiple instances, which means you can have several `useEffect` functions.

## `useContext()` Hook Example

### The Point of Context

Context in React is a way for a child component to access a value in a parent component. 

To understand the need for context, when building a React app you often need to get values from the top of your React tree to the bottom. Without context, you end up passing props through components that do not necessarily need them. Not only is it a hassle to passing props through components that don't need them, it can also introduce an inadvertent coupling if done incorrectly.

Passing props down through a tree of "unrelated" components is affectionately called _props drilling_.

React Context solves the problem of props drilling by allowing you to share values through the component tree, to any component that asks for those values.

### `useContext()` makes context easier to use

With the `useContext` Hook, using Context is easier than ever. 

The `useContext()` function accepts a **context object**, which is initially returned from `React.createContext()`, and then returns the current context value. Let's look at an example below.

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

In the code above, the context `JediContext` is created using `React.createContext()`.

We use the `JediContext.Provider` in our `App` component and set the `value` there to `"Luke"`. This means any context-reading object in the tree can now read that value.

To read this value in the `Display()` function we call `useContext`, passing the `JediContext` an argument.

We then pass in the context object we got from `React.createContext`, and it automatically outputs the value. When the value of the provider updates, this Hook will trigger a rerender with the latest context value.

### Getting a Reference to the Context in a Larger App

Above, we created `JediContext` within the scope of both components, but in a larger app `Display` and `App` would be in different files. So if [you're like us](https://twitter.com/fullstackio/status/1060629351819952128) you might be wondering, "how do we get a reference to `JediContext` across files?"

The answer is that you need to **create a new file which exports `JediContext`**. 

For example, you might have a file `context.js` that reads something like this:

```javascript
const JediContext = React.createContext();
export { JediContext };
```

and then in `App.js` (and `Display.js`) you would write:

```javascript
import { JediContext } from './context.js';
```

(Thanks, [Dave](https://twitter.com/dceddia)!)

## `useRef()` Hook Example

Refs provide a way to access the React elements created in the `render()` method. 

If you're new to React refs, you can read this [introduction to React refs here](https://www.fullstackreact.com/articles/using-refs-in-react/). 

The `useRef()` function returns a ref object.

```javascript
const refContainer = useRef(initialValue);
```

### `useRef()` and forms with `input`

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

In the example above, we're using the `useRef()` hook in conjunction with the `useState()` to render the value of the `input` tag into a `p` tag.

The ref is instantiated into the `nameRef` variable. The `nameRef` variable can then be used in the input field by being set as the `ref`. Essentially, this means the content of the input field will now be accessible through ref.

The submit button in the code has an `onClick` event handler called `submitButton`. The `submitButton` function calls `setName` (created via `useState`). 

As we've done with `useState` hooks before, `setName` will be used to set the state `name`. To extract the name from the `input` tag, we read the value `nameRef.current.value`.

Another thing to note concerning `useRef` is the fact that it can be used for more than the `ref` attribute. 

## Using Custom Hooks

One of the coolest features of Hooks is that you can easily to **share logic across multiple components by making a custom hook**.

In the example below, we'll make a custom `setCounter()` Hook which lets us track state and provide custom state updating functions!

> See also, this `useCounter` hook from [`react-use`](https://github.com/streamich/react-use/blob/master/src/useCounter.ts)

```javascript
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
```

<iframe src="https://codesandbox.io/embed/nk05nmrmxp" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

In the code block above, we create a function `useCounter`, which stores the logic of our custom hook.

Notice that `useCounter` can use other Hooks! We start by creating a new state Hook via `useState`.

Next, we define two helper functions: `increment` and `decrement` which call `setCount` and adjust the current `count` accordingly.

Lastly, we `return` the references necessary to interact with our hook. 

> **Q: What's with `return`ing and array with an object?** 
> 
> A: Well, like most things in Hooks, API conventions haven't been finalized yet. But what we're doing here is returning an array where:
>
> * The first item is the _current value_ of the hook and
> * The second item is an object, containing functions used to interact with the hook.
>
> This convention allows you to easily "rename" the current value of the Hook - as we do above with `myCount`. 
>
> That said, you can return whatever you'd like from your custom Hook.

In the example above, we use `increment` and `decrement` as `onClick` handlers in our view. When the user presses the buttons, the counter is updated and re-displayed (as `myCount`) in the view.

## Writing Tests for React Hooks

In order to write tests for the hooks, we'll be using the [`react-testing-library`](https://github.com/kentcdodds/react-testing-library) to test them. 

`react-testing-library` is a very light-weight solution for testing React components. It extends upon `react-dom` and `react-dom/test-utils` to provides light utility functions. Using `react-testing-library` ensures that your tests work on the DOM nodes directly.

The testing story for hooks is, as of writing, a bit under-developed. You currently [can't test a hook in isolation](https://twitter.com/dan_abramov/status/1060315729524936706). Instead, you need to attach your hook to a component and test that component.

So below, we'll be writing tests for our Hooks, by interacting with our _components_ and not the hooks directly. The good news is that means that our tests look like normal React tests.

### Writing tests for useState() Hook

Let's see an example on writing tests for the `useState` Hook. In the lesson above, we are testing a more variation of the useState example we used above. We'll be writing tests to ensure that clicking on an "Off" button sets the state to 0 and clicking on an "On" button sets the state to 1.

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

Next, in the test assertion function, we create constant variables for the `data-testid` elemtents and their values that we'd like to use in the test. With references to the elements on the DOM, we can then use the `fireEvent` method to simulate clicking on the button.

The test checks that if the `onButton` is clicked on, the state is set to 1 and when the `offButton` is clicked on, the state is set to 1.

### Writing tests for `useEffect()` Hook

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

Once that's done, the test then simulates clicking on the `addButton` and checks if the current cart item count is `1` and reloads the page, after which if it checks if the `localStorage` count, `cartItem`, is also set to `1`. It then simulates clicking on the `resetButton` and checks if the current cart item count is set to `0`.

### Writing tests for `useRef()` Hook

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

In the test assertion function, we are setting the constant variables to the iput field, the`p` tag which displays the current ref value, and the submit button. We are also setting the value we'd like to be entered into the input field to a constant variable `newName`. This will be used to do checks in the test.

```javascript
fireEvent.change(inputName, { target: { value: newName } });
```

The `fireEvent.change` method is used to enter a value into the input field and in this case, the name stored in the `newName` constant variable is used, after which the submit button is clicked on.

The test then checks if the value of the ref after the button was clicked is equal to the the `newName`.

Finally, you should see a `There are no failing tests, congratulations!` message in the console.

## Community Reaction to Hooks

Since the news of React hooks the community has been excited about the feature and we've seen **tons** of examples and use cases for React Hooks. Here are some of the highlights:

- This [website](https://nikgraf.github.io/react-hooks/) which showcases a collection of React Hooks.
- [react-use](https://github.com/streamich/react-use), a library that ships with a bunch of React Hooks.
- This [CodeSandbox](https://codesandbox.io/s/ppxnl191zx?from-embed) example that shows how to use the `useEffect` Hook to create animations with [react-spring](https://github.com/drcmda/react-spring).
- [An example](https://gist.github.com/aweary/be8338a211e72b9f1563d75091005c0e) of a useMutableReducer hook that lets you just mutate the state to update it in the reducer.
- This [CodeSandbox](https://codesandbox.io/s/y570vn3v9) example that shows complex usage of the child-parent communication and reducer usage.
- A [toggle component](https://codesandbox.io/s/m449vyk65x) built with React Hooks.
- [Another collection](https://rehooks.com/) of React Hooks that features hooks for input values, device orentation and document visibility.

## References to the Different types of Hooks

There are various types of Hooks that you can begin to use in your React code. They are listed below:

- [`useState`](https://reactjs.org/docs/hooks-reference.html#usestate) - `useState` allows us to write pure functions with state in them.
- [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) - The `useEffects` hook lets us perform side effects. Side effects can be API calls, Updating DOM, subscribing to event listeners.
- [`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext) - `useContext` allows to write pure functions with context in them.
- [`useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer) - `useReducer` gives us a reference do a Redux-like reducer
- [`useRef`](https://reactjs.org/docs/hooks-reference.html#useref) - `useContext` allows to write pure functions that return a mutable `ref` object.
- [`useMemo`](https://reactjs.org/docs/hooks-reference.html#usememo) - `useMemo` is used to return a memoized value.
- [`useCallback`](https://reactjs.org/docs/hooks-reference.html#usecallback) - the `useCallback` Hook is used to return a memoized callback.
- [`useImperativeMethods`](https://reactjs.org/docs/hooks-reference.html#useimperativemethods) - `useImperativeMethods` customizes the instance value that is exposed to parent components when using `ref`.
- [`useMutationEffects`](https://reactjs.org/docs/hooks-reference.html#usemutationeffect) - the `useMutationEffect` is similar to the useEffect Hook in the sense that it allows you perform DOM mutations.
- [`useLayoutEffect`](https://reactjs.org/docs/hooks-reference.html#uselayouteffect) - The `useLayoutEffect` hook is used to read layout from the DOM and synchronously re-render.
- Custom Hooks - Custom Hooks allows you to write component logic into reusable functions.

## Future of Hooks

The great thing about Hooks is that it works side-by-side with existing code so you can slowly make changes that adopt Hooks. All you have to do is upgrade your React dependency to a version that has the Hooks feature.

That said, **Hooks are still an experimental feature** and the React team has repeatedly warned that the API may be changed. Consider yourself warned. 

What does the emergence of Hooks mean for Classes? According to the React team, Classes are still here to stay, they are a huge part of the React codebase and most likely to be around for a while.

> We have no plans to deprecate classes. At Facebook we have tens of thousands of class components and, like you, we have no intention of rewriting them. But if the React community embraces Hooks, it doesn’t make sense to have two different recommended ways to write components. - [Dan Abramov](https://twitter.com/fullstackio/status/1057335949766455296)

**While the specific Hooks API is experimental today, the community loves the idea of Hooks so I don't anticipate it going away anytime soon.**

Hooks are here and we're excited to use them in our apps!

## More Resources

* The React team has done a wonderful job of documenting React Hooks and you more about that [here](https://reactjs.org/docs/hooks-overview.html) 
* Check out the [Official API Reference here](https://reactjs.org/docs/hooks-reference.html). There's also 
* An ongoing RFC, so you can head over [there](https://github.com/reactjs/rfcs/pull/68) to ask questions or drop comments.

