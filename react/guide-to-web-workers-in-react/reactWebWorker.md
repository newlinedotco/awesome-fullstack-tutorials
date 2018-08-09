# A Guide to using Web Workers in React

Web Workers are a way of running web scripts in background threads without blocking the main thread. JavaScript is a single-threaded environment, which means that multiple scripts cannot be run at the same time. A single thread means that every line of JS code is executed one at a time.

For example, let’s look at a website that needs to do the following, handle UI interactions, interact with and process API responses, and manipulate the DOM. These are fairly common in a modern website/web app. Unfortunately all of the above cannot be simultaneous due to limitations in browsers’ JavaScript runtime. Script execution always happens within a single thread.

Therefore, if any of the activity above takes too much time to happen, it can cause blockage to the main thread and render the whole app unusable.

So how can this problem of thread blocking be solved?

By introducing multi-threading. Multi-threading allows the browser to run multiple scripts without causing an interruption to the main thereby resulting in a performant and responsive UI.

This is where Web Workers come in. [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) allow JavaScript code to run in a separate and background thread, entirely independent of the browser thread and its usual activities.

Since these workers run on a separate thread than the main execution thread, you can utilize web workers to run process intensive tasks from the browser without creating blocking instances.

Web Workers run in an isolated thread. As a result, the code that they execute needs to be contained in a separate file. Because, the worker script runs in another script. To get started with Web Workers, you need to create a new `Worker` object in your main page.

```

    // main.js file

    var worker = new Worker('workerfile.js');
```

The `Worker()` constructor call creates a worker and returns a `Worker` object representing that worker, which is used to communicate with the worker. How do we communicate with a worker? By calling the `postMessage()` method.

```

    // main.js file

    worker.postMessage('Hello World');

```

In the `workerfile.js` file, we’d have something like this:

```

    // workerfile.js

    self.addEventListener('message', function(e) {
      self.postMessage(e.data);
    }, false);

```

The event listener listens for any message event and then acts on the message by running the code inside the function in this case, sending a message back to the main thread with a postMessage() function.

*Note: We always send a message back to the main thread.*

Finally, we will also need a message event listener in the main file to receive the data and act upon it. Something like the code block below.

```
    // main.js file

    var worker = new Worker('workerfile.js');

    worker.addEventListener('message', function(e) {
      console.log('Message from Worker: ' + e.data);
    }

    worker.postMessage('Hello World');

```

**Web Workers in React**

Let’s explore how Web Workers can be used in a React app. In this example, we’ll see how a CPU-intensive action can cause blockage to the UI and then fix the issue with a Web Worker script.

We’ll write a for loop that’s a bit intensive and causes a blockage to the main thread and see how it behaves when called directly and through a Web Worker.

To get started, we’ll use the [create-react-app](https://github.com/facebook/create-react-app) package to bootstrap a new React app or you can follow using [CodeSandbox](http://codesandbox.io/).

You can create a new React app with the command below:

```
   npx create-react-app react-worker
```

Once the app has been created and installed, create a file named `Home.js` in the `src` folder.

Before we continue with setting up the project, we’ll need to install a React package called [react-countdown-clock](https://github.com/pughpugh/react-countdown-clock). It basically renders a countdown timer and it has no effect on what we’re building,
however it’s going to be used as an example for what happens when the main thread is being blocked. You can install with the command below.

```
   npm i react-countdown-clock
```

In the newly created `Home.js` file, edit it with the following code block:

In the code block above, we start by importing `React`, `Component` and the `ReactCountdownClock` package we installed earlier.

In the `render` function, we then create the necessary UI for the app. We are also using the `ReactCountdownClock` package by rendering it.

The important bit in the code above is the `fetchUsers` function. The function contains a for loop that runs 10,000,000 times. It’s a very impractical and unlikely (you’d never see anything like this in a production app) function but it’s needed for the demonstration of main thread blockage.

The `fetchUsers` function is then hooked to the `Fetch Users Directly` button like this:

```
    <button className="btn-direct" onClick={
    .fetchUsers}>Fetch Users Directly</button>
```

With that done, let’s see what clicking on the button actually does.

The next thing to do is to importthe `Home.js` file into the main `App.js` file so it can be referenced and then rendered on the UI. To do that, open up the `App.js` file and edit it with the code block below.

[https://gist.github.com/yomete/b13df5db43bbaff0f6bda06d43e03fbb](https://gist.github.com/yomete/b13df5db43bbaff0f6bda06d43e03fbb)

In the code block above, `Home.js` is imported and used in the render function like this; `<Home />`.

So far, your app should look similar to the one below.

![](https://cdn-images-1.medium.com/max/1600/1*moTOQ_r7WTjbnGJyZoXmrA.png)

Now, if you click on the Fetch Users Directly button, you’ll notice that for almost two seconds, the action causes a blockage to the main thread. How? The whole app becomes unresponsive and the countdown timer stops working. This is an example of a process/function causing a blockage to the apps’ main thread.

Let’s see how we can solve this with Web Workers.

We’ll start first by creating the Web Worker file named `worker.js` in the `src` folder and edit with the code below:

As seen in the code block above, the Web Worker file also contains the same `for` loop that was written in the `fetchUsers` function. The `for` loop is inside a `message` event listener which means that the processing will be done as soon as it receives an event and at the end it sends a message (the `users` array) via the `postMessage` function.

With the Web Worker file created, let’s import it into the `Home.js` file.Before we do that though, some config is needed before the `worker.js` file can be referenced in the React app.

This code block is necessary because we’ll be importing the `worker.js` therefore we need to make sure it’s Webpack compatible and the code block above does that by turning the Web Worker file into a path/string which can then be called as a web url.

Next, in the `Home.js` file, add the following imports to the top of the code:

```
    worker 
    './worker.js';
    WebWorker 
    './workerSetup';
```    

We’ll also need to initialize the Web Worker instance once the components are done mounting, in the `componentDidMount` lifecycle:

```

    componentDidMount = () => {
       
    .worker = 
    WebWorker(worker);
    }

```

Remember, Web Workers are all about posting and receiving messages asynchronously, therefore, let’s write the function that posts the message to the Web Worker file and then in turn receives the returned message. You can write the function below just before the `componentDidMount` lifecycle.

The postMessage is a simple one since we are only listening for one kind of event in the `worker.js` file. The `eventListener` then listens for the response from the Web Worker and then updates the state. The last bit of code to be written is hooking the `fetchWebWorker` function to the `Fetch Users With WebWorker` button.

```

    <button className="btn-worker" onClick={
    .fetchWebWorker}>Fetch Users with Web Worker</button>

```

Now if you visit the app, and try clicking on the `Fetch Users With Web Worker`button, you’ll observe that the app carries on smoothly while the requested process is happening in the background and the state is then updated with the appropriate value.

You can test this out on the live app at
[https://build-jrrpxladjd.now.sh/](https://build-jrrpxladjd.now.sh/).

**Conclusion**

Web Workers can be very useful for handling complicated processes and functions as demonstrated here and you should consider offloading long running tasks to a Web Worker file and then notify your main app when it’s done and you can then update whatever needs to be updated.

The complete codebase for the React app above can be viewed on [GitHub](https://github.com/yomete/react-worker) and also [CodeSandbox](https://codesandbox.io/s/w2v7zzn63w).
