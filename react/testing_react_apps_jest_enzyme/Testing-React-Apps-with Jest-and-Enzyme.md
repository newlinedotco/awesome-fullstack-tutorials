# Testing React apps with Jest and Enzyme

Testing is an important part of building software as it allows you to catch annoying bugs and makes your code more maintainable and easy to understand. It can also be an avenue for automated quality assurance and documentation for developers.

In this article, we'll explore how to test your React apps using [Jest](https://jestjs.io/) and [Enzyme](https://airbnb.io/enzyme/). Let's take a look at what each tool does and how it can be combined to test React apps.

## Introduction to Jest and Enzyme

**Jest**

Jest is a JavaScript testing framework used to test JavaScript apps. It' was created by Facebook to test React apps or basically any JavaScript app.

Jest also provides **Snapshot testing**, the ability to create a rendered ‘snapshot’ of a component and compare it to a previously saved ‘snapshot’. The test will fail if the two do not match. 

**Enzyme**

Enzyme is a JavaScript testing utility for React that makes it easier to assert, manipulate, and traverse your React Components’ output.

Enzyme exports three different “modes” in which you can render and test components, [**shallow**](http://airbnb.io/enzyme/docs/api/shallow.html), [**mount**](http://airbnb.io/enzyme/docs/api/mount.html), and [**render**](http://airbnb.io/enzyme/docs/api/render.html). 

## Testing React Components

Before we can start writing any test, we need to create a React app that we can test against. To do that, we'll use the [create-react-app](https://github.com/facebook/create-react-app) CLI. You can create a new React app with the command below:

```bash
   npx create-react-app react-testing
```

Once the app has been created and installed, `cd` into the `react-testing` directory and run `npm start` to launch the React app.

The first step would be to write some basic tests using Jest so as to get a feel what tests look like in React. As Jest already comes installed with the `create-react-app` package, you don't need to install anything. We'll just go ahead to writing tests.

If you check the `src` folder of the newly created react-testing app, you should see a `App.test.js` file and its content should be like the one below.

```javascript
// src/App.test.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
```

The code above is an introductory test suite that tests if the app renders without crashing at all. Let's see the output of the test above by running the command below.

![](https://i.imgur.com/QVC5B6i.png)

As you can see in the screenshot, all test suites passed. We can also add an additional test to the `App.test.js` file. Add the code below to the `App.test.js` file.

```javascript
// App.test.js
// add the assert method
var assert = require('assert');

it('should return -1 when the value is not present', function() {
  assert.equal([1,2,3].indexOf(4), -1);
});

```

For the test above, the assert module is used. It provides a way of testing expressions and if an expression evaluates to 0, or false, an assertion failure is returned. In the test above, we're checking if an array contains a value by returning `-1` when the value is not present. The [.equal()](https://nodejs.org/api/assert.html#assert_assert_equal_actual_expected_message) method is used to check for the equality. Run the `npm run test` command again to see the tests result.

![](https://i.imgur.com/JXtaESK.png)

Now that we've gone through how to write tests with Jest, let's see how we can combine with Enzyme to test components.

To get started with Enzyme, you can install it via npm. You will also need to install Enzyme along with an Adapter corresponding to the version of React. For instance, if you are using Enzyme with React 16, you will need to install the `enzyme-adapter-react-16` adapter and if you use React 15, you'll need to install the `enzyme-adapter-react-15`. Run the command below to install the required dependencies.

```bash
npm i --save-dev enzyme enzyme-adapter-react-16
```

One last thing for the Enzyme setup is to create a `setupTests.js` file in the `src` folder. Because we created the React app using the `create-react-app` package, the `setupTests.js` file automatically communicates to Jest and Enzyme what Adapter will be used.

```javascript
// src/setupTests.js

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
```

### Shallow Rendering

Shallow rendering is useful to constrain yourself to test a component as a unit, and to ensure that your tests aren't indirectly asserting on the behavior of child components. A shallow render is a simulated render of a component tree that does not require a DOM. It renders only one level of components deep.

To carry out a shallow rendering test, we'll be building a simple switch that displays `1` when the on button is clicked on and `0` for when the off button is clicked on. Open up the `App.js` file in the `src` folder and edit with the code below.

```javascript
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      status: 0,
    }
  }

  setOn = event => {
    this.setState({status: 1})
  }; 

  setOff = event => {
    this.setState({status: 0})
  }; 

  render() {
    return (
      <div className="App">
        <p>
          {this.state.status}
        </p>

        <button onClick={this.setOff}>Off</button>
        <button onClick={this.setOn}>On</button>
      </div>
    );
  }
}

export default App;

```

Next up, let's write the test to ensure that the app works as expected. Open up the `App.test.js` file add the code below.

```javascript
// App.test.js
//import the shallow method.
import { shallow } from 'enzyme';

describe('Enzyme Tests', () => {
  it('App loads with initial state of 0', () => {
    const wrapper = shallow(<App />);
    const text = wrapper.find('p').text();
    expect(text).toEqual('0');
  });
});
```

In the test above, we use the `shallow` method imported from enzyme to return an instance of the rendered component. We then use the `.find` method to find the `p` tag and do a check using the `.toEqual` method to see if the value is 0. If it is, the test passes, if it's not, it fails. 

Run the `npm run test` command to see the test output.

![](https://i.imgur.com/LRblw32.png)

For the next test, we'll check to see if the buttons to turn on and off the switch works as expected. We'll need some way to identify the buttons, so, we'll add IDs to the buttons. Edit the button elements in the `App.js` file with the ones below.

```javascript
<button id="offbutton" onClick={this.setOff}>Off</button>
<button id="onbutton" onClick={this.setOn}>On</button>
```

On to the test, add the following code below to the `App.test.js` file.

```javascript
// App.test.js

it('on button works as expected', () => {
    const wrapper = shallow(<App />);
    const onButton = wrapper.find('button#onButton');
    onButton.simulate('click');
    const text = wrapper.find('p').text();
    expect(text).toEqual('1');
  });

  it('off button works as expected', () => {
    const wrapper = shallow(<App />);
    const offButton = wrapper.find('button#offButton');
    offButton.simulate('click');
    const text = wrapper.find('p').text();
    expect(text).toEqual('0');
  });
```

In the code block above, we are identifying the buttons by their IDs and then attaching a `simulate` method to the buttons. The test uses the `simulate` method to simulate a click event on the buttons and then there's a check to see if the value after clicking on the button is what is expected.

![](https://i.imgur.com/xiCwVWM.png)



### Snapshot Testing

Snapshot tests are a very useful tool whenever you want to make sure your UI does not change unexpectedly. A snapshot test verifies that a piece of functionality works the same as it did when the snapshot was created.

Snapshot tests essentially work by first generating a snapshot of a React component's UI. The snapshot tests are committed alongside the component and everytime the tests are run. 

The test will fail if the two snapshots do not match, that means either the change is unexpected, or the reference snapshot needs to be updated to the new version of the UI component.

Let's carry out a snapshot test on the existing `App.js` file. Before we begin, we'd need to install an additional package, [react-test-renderer](https://www.npmjs.com/package/react-test-renderer). react-test-renderer is a library that enables you to render React components as JavaScript objects without the need of a DOM.

```bash
npm i --save-dev react-test-renderer 
```

After the installation of the package, go ahead to import it in the `App.test.js` file.

```javascript
// App.test.js
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import App from './App';
var assert = require('assert');
```

Next step, let's add our first snapshot test. Add the code below to the bottom of the `App.test.js` file.

```javascript
// App.test.js
describe('Jest Tests', () => {
  it('snapshot matches', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
```

Let's run the `npm run test` command and observe what happens. You'll notice that a `__snapshots_` folder is created with a `App.test.js.snap` file in it.

```
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`Jest Tests snapshot matches 1`] = `
<div
  className="App"
>
  <p>
    0
  </p>
  <button
    id="offButton"
    onClick={[Function]}
  >
    Off
  </button>
  <button
    id="onButton"
    onClick={[Function]}
  >
    On
  </button>
</div>
`;

```

If you look closely, you'll see that the output above is very similar to the content of the `App.js` file. At this point, the snapshot test that was written passes as seen in the image below so how do we know when a snapshot test fails.

![Snapshot test passed](https://i.imgur.com/LtBU2hx.png)

To get the snapshot test to fail and make Jest throw an error, we'll have to edit the `App.js` file so as to change the rendered output and then run the `test` command again. Therefore, we'll be making a tiny edit to the `App.js` file,

```javascript
// App.js
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      status: 0,
    }
  }

  setOn = event => {
    this.setState({status: 1})
  }; 

  setOff = event => {
    this.setState({status: 0})
  }; 

  render() {
    return (
      <div className="App">
        <p className="value">
          {this.state.status}
        </p>

        <button id="offButton" onClick={this.setOff}>Off</button>
        <button id="onButton" onClick={this.setOn}>On</button>
      </div>
    );
  }
}

export default App;

```

The tiny change was `className="value"` added to the only `p` tag in the component. Once the file is updated, your Jest watcher should update and notify about a failed test.

![Failed snapshot test](https://i.imgur.com/5C5z1k4.png)

As seen in the image above, Jest specifies where the snapshot comparison failed. To fix this, we can do either of these two things.

1. Undo the change and you should see tests pass.
2. Press the `u` key in the terminal window to update the snapshots file itself and the tests should all pass.

## Conclusion

In this article, we were introduced to Jest and Enzyme. Both are testing tools that help test React apps. Jest is a JavaScript testing framework used to test JavaScript apps while Enzyme is a JavaScript testing utility for React that makes it easier to assert, manipulate, and traverse your React Components’ output.

We were then introduced to testing React components by using the combination of Jest and Enzyme.  We also saw the different methods in which we can use Enzyme to test React apps.

The codebase for this tutorial can be seen on GitHub [here](https://github.com/yomete/react-testing).