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

# Przewodnik korzystania z React Hooks

Jeśli używasz Twittera, prawdopodobnie wiesz, że Hooks są nową funkcją React, ale możesz spytać **jak faktycznie ich używamy?** W tym poście pokażemy ci kilka przykładów użycia hooks.

Jednym z kluczowych pomysłów do zrozumienia jest to, że **Hooks pozwalają używać stanu i innych funkcji React bez pisania klas.**

## Motywacja za Hooks

Kiedy projektowanie oparte na komponentach pozwala nam na ponowne użycie _views_ w naszej aplikacji, jednym z największych problemów, przed którymi stają programiści React, jest to, jak możemy **ponownie użyć logiki stanu między komponentami**. Kiedy mamy komponenty, które mają podobną logikę stanu, nie było świetnych rozwiązań do ponownego użycia, co czasami może prowadzić do zduplikowanej logiki w metodach konstruktora i cyklu życia.

Typowym sposobem radzenia sobie z tym jest tradycyjnie:

* elementy wyższego rzędu lub
* render props complex 

Ale oba te wzorce mają wady, które mogą przyczynić się do skomplikowanych baz kodu.

**Hooks mają na celu rozwiązanie wszystkich tych problemów, umożliwiając pisanie funkcjonalnych komponentów, które mają dostęp do takich funkcji, jak stan, kontekst, metody cyklu życia, referencje itp. bez pisania komponentu klasy.**

## Hooks są Alpha

> Przed zanurzeniem należy wspomnieć, że interfejs API Hooks nie jest sfinalizowany.
>
> Także, [oficjalna dokumentacja](https://reactjs.org/docs/hooks-intro.html) jest bardzo dobra i zalecamy jej przeczytanie, w szczególności, ponieważ rozszerza ona motywację Hooks.

## Spis treści

<!-- toc -->
<!-- tocstop -->

## Jak Hooks Map dla Component Classes

Jeśli znasz React, jednym z najlepszych sposobów zrozumienia hooks jest sprawdzenie, w jaki sposób odtwarzamy zachowanie, do którego jesteśmy przyzwyczajeni "component classes" używając hooks.

Pamiętaj, że pisząc klasy komponentów, często musimy:

- Utrzymać `state`
- Użyć metod cyklu życia, takich jak `componentDidMount()` i `componentDidUpdate()`
- Dostęp kontekstu (używając ustawień `contextType`)

Wraz z React Hooks możemy odtworzyć podobne / takie samo zachowanie w komponentach funkcjonalnych:

- Stan komponentu używa `useState()` hook.
- Metody cyklu życia, takie jak `componentDidMount()` i `componentDidUpdate()` używają `useEffect()` hook.
- Statyczny contextType używa `useContext()` hook.

## Używanie Hooks wymaga `react` `"next"`

Możesz zacząć korzystać z Hooks już teraz, ustawiając `react` i `react-dom` w twoim pliku package.json dla `next` .

```javascript
// package.json
"react": "next",
"react-dom": "next"
```

## przykład useState() Hook

Stan jest istotną częścią React. Pozwalaja nam deklarować zmienne stanu, które przechowują dane, które zostaną wykorzystane w naszej aplikacji. W przypadku komponentów klasy stan jest zwykle definiowany w następujący sposób:

```javascript
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

Przed hooks, stan był zwykle używany tylko w komponencie klasy, ale jak wspomniano powyżej, **Hooks pozwala nam dodać stan do komponentu funkcjonalnego**.

Zobaczmy przykład poniżej. Tutaj zbudujemy przełącznik żarówki SVG, który zmieni kolor w zależności od wartości stanu. Aby to zrobić, będziemy używać `useState` hook.

Oto pełny kod (i możliwy do uruchomienia przykład) -- omówimy to, co dzieje się poniżej.

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

### Nasz Komponent jest Funkcją

W powyższym bloku kodu zaczynamy od importowania `useState` z `react`. `useState` to nowy sposób korzystania z możliwości, które `this.state` zaoferowałby. 

Następnie zauważ, że ten komponent jest **funkcją i nie klasą**. Interesujące!

### Czytanie i Pisanie Stanu

W ramach tej funkcji wywołujemy `useState`, aby utworzyć zmienną stanu:

```javascript
let [light, setLight] = useState(0);
```

**`useState` służy do deklarowania zmiennej stanu** i można go zainicjować za pomocą **każdego** typu wartości (w przeciwieństwie do stanu w klasach, które musiały być obiektami).

Jak widać powyżej, używamy destrukcji na wartości zwracanej `useState`. 

- Pierwsza wartość, `light` w tym przypadku, jest bieżącym stanem (coś w rodzaju `this.state`) i 
- Druga wartość jest **funkcją używaną do aktualizacji wartości stanu (pierwszej)** (tak jak tradycyjnt `this.setState`).

Następnie tworzymy dwie funkcje, z których każda ustawia stan na różne wartości, 0 lub 1. 

```javascript
const setOff = () => setLight(0);
const setOn = () => setLight(1);
```

Następnie używamy tych funkcji jako procedur obsługi zdarzeń dla przycisków w widoku:

```javascript
<button onClick={setOff}>Off</button>
<button onClick={setOn}>On</button>
```

### Śledzenie Stanu React

Gdy przycisk "On" jest naciśnięty, `setOn` jest wywoływany, który wywoła `setLight(1)`. Wywołanie `setLight(1)` **aktualizuje wartość `light` w następnym renderze**. To może wydawać się trochę magiczne, ale tak się dzieje **React śledzi wartość tej zmiennej** i przekaże nową wartość, gdy ponownie renderuje ten komponent. 

Następnie używamy bieżącego stanu (`light`) aby ustalić, czy żarówka powinna być „włączona”, czy nie. Oznacza to, że ustawiamy kolor wypełnienia SVG w zależności od wartości `light`. Jeśli `light` jest 0 (off), wtedy `fillColor` jest ustawione na `#000000` (a jeśli jest 1 (on), `fillColor` jest ustawione na `#ffbb73`).

### Wiele Stanów

Chociaż nie robimy tego w powyższym przykładzie, ty **możesz** stwórzyć wiele stanów wywołując `useState` więcej niż raz. Np.: 

```javascript
let [light, setLight] = useState(0);
let [count, setCount] = useState(10);
let [name, setName] = useState("Yomi");
```

> UWAGA: Podczas używania hooks istnieją pewne ograniczenia, o których powinieneś wiedzieć. Najważniejsze jest to, że ty **musisz wywoływać hooks tylko na najwyższym poziomie twojej funkcji**. Zobacz [The Rules of Hooks](https://reactjs.org/docs/hooks-rules.html) aby znaleźć więcej informacji.

## Przykład useEffect() Hook

**Hook `useEffect` pozwala wykonywać działania niepożądane w komponentach funkcji.** Skutkami ubocznymi mogą być wywołania interfejsu API, aktualizacja DOM, subskrybowanie detektorów zdarzeń - wszystko, gdzie chcesz, aby miało miejsce „działanie imperatywne”.

Używając Hook `useEffect()`, React wie, że chcesz wykonać określoną akcję po zakończeniu renderowania.

Spójrzmy na przykład poniżej. Będziemy używać hook `useEffect()` do wykonywania połączeń API i uzyskania odpowiedzi.

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

W tym przykładzie kodu oba `useState` oraz `useEffect` są importowane, a to dlatego, że chcielibyśmy **ustawić wynik wywołania interfejsu API na stan**.

```javascript
import React, { useState, useEffect } from "react";
```

### Pobierz dane i zaktualizuj stan

Aby „użyć efektu”, musimy umieścić naszą akcję w funkcji 'useEffect' - to znaczy przekazujemy naszą „akcję” efektu jako funkcję anonimową jako pierwszy argument do `useEffect`. 

W powyższym przykładzie wykonujemy wywołanie API do punktu końcowego, który zwraca listę nazw. Kiedy 'response' powraca, konwertujemy ją na JSON, a następnie używamy `setNames(data)` do ustawienia stanu.

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

### Problemy z wydajnością podczas korzystania z efektów

Jest jednak kilka rzeczy, na które należy zwrócić uwagę przy korzystaniu z `useEffect`.

Pierwszą rzeczą do rozważenia jest to, że domyślnie nasz `useEffect` będzie wywoływany przy każdym renderowaniu! Dobrą wiadomością jest to, że nie musimy się martwić o nieaktualne dane, ale złą wiadomością jest to, że prawdopodobnie nie chcemy wysyłać żądania HTTP przy każdym renderowaniu (jak w tym przypadku).

Możesz pominąć efekty, **używając drugiego argumentu do `useEffect`**, tak jak zrobiliśmy w tym przypadku. Drugim argumentem 'useEffect' jest lista zmiennych, które chcemy 'obserwować', a następnie ponownie uruchomimy efekt tylko, gdy jedna z tych wartości się zmieni. 

W powyższym przykładzie kodu zauważmy, że przekazujemy **pustą tablicę** jako drugi argument. To znaczy mówimy Reactowi, że chcemy wywołać ten efekt tylko wtedy, gdy element jest zamontowany.

> Aby dowiedzieć się więcej o wydajności efektu, [sprawdź tę sekcję w oficjalnych dokumentach](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects)

Również, tak jak funkcja `useState` powyżej, `useEffect` pozwala na wiele wystąpień, co oznacza, że możesz mieć ich kilka funkcji `useEffect`.

## Przykład `useContext()` Hook

### Punkt kontekstu

Kontekst w React to sposób, w jaki komponent potomny może uzyskać dostęp do wartości w komponencie macierzystym.

Aby zrozumieć potrzebę kontekstu, budując aplikację React, często musisz uzyskać wartości z góry drzewa React na dół. Bez kontekstu kończysz przekazywanie rekwizytów przez komponenty, które niekoniecznie ich potrzebują. Problemem jest nie tylko przekazywanie rekwizytów przez komponenty, które ich nie potrzebują, ale może również wprowadzić przypadkowe sprzężenie, jeśli zostanie wykonane nieprawidłowo.

Przekazywanie props przez drzewo „niepowiązanych" komponentów jest nazywany pieszczotliwie _props drilling_.

React Context rozwiązuje problem wiercenia propsów, umożliwiając współdzielenie wartości przez drzewo komponentów do dowolnego komponentu, który prosi o te wartości.

### `useContext()` ułatwia korzystanie z kontekstu

Z Hook `useContext` używajanie Context jest łatwiejsze niż kiedykolwiek.

Funkcja `useContext()` akceptuje **obiekt kontekstu**, który początkowo jest zwracany z `React.createContext()`, a następnie zwraca bieżącą wartość kontekstu. Spójrzmy na przykład poniżej.

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

W powyższym kodzie kontekst `JediContext` jest tworzony używając `React.createContext()`.

Używamy `JediContext.Provider` w naszym komponencie `App` i ustawiamy `value` tam to `"Luke"`. Oznacza to, że każdy obiekt czytający kontekst w drzewie może teraz odczytać tę wartość.

Aby odczytać tę wartość w funkcji `Display()` wywołujemy `useContext`, uwzględniając argument `JediContext`.

Następnie przekazujemy obiekt kontekstu, który otrzymaliśmy `React.createContext`, i automatycznie wyświetla wartość. Gdy wartość dostawcy zostanie zaktualizowana, ten Hook spowoduje wyrenderowanie z najnowszą wartością kontekstu.

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

