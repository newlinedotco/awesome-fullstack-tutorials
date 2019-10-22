---
title: How to get started with Cypress
slug: how-to-get-started-with-cypress
description: Cypress is a great tool for testing your frontend applications.  This post will cover an intro on how to use Cypress, and showcase how to get started.
author: Andrew Evans
tags: javascript, testing
banner: https://atevans85.files.wordpress.com/2019/10/shuttle.jpg?w=1024
---

![](https://atevans85.files.wordpress.com/2019/10/shuttle.jpg?w=1024)

> This post was originally posted on **Rhythm and Binary** [check it out here](https://rhythmandbinary.com/2019/10/22/how-to-get-started-with-cypress/).

If you’ve been developing frontend applications recently, you’ve undoubtedly heard of Cypress.io. Cypress is a powerful testing framework that makes writing tests easy and really fun. I’ve used Cypress on a number of projects, and had a great experience. In this post I’m going to introduce Cypress, and walkthrough using Cypress with an Angular project.

The Angular Project that I use for this post can be reached [at the GitHub repo here](https://github.com/andrewevans0102/learn-cypress).

## What is Cypress?

Traditionally speaking, writing tests for projects has been a chore for developers. Cypress is a framework that enables you to more easily write tests for your frontend applications. One of the best parts about Cypress is that it **makes testing fun**. When you have developers that **want** to write tests, you get better projects for both the developer and user.

Why is testing important? Having tests enables you to quickly verify changes, be pseudo documentation, verify your apps health, and promote good code practices overall.

Cypress makes tests easier as it is (1) interactive and (2) runs alongside your application. This means that the Cypress test runner has full access to your code, and doesn’t run externally like Selenium frameworks do.

Cypress also sits on top of:

- [Mocha](https://mochajs.org/)
- [Chai](https://www.chaijs.com/)
- [Sinon](https://sinonjs.org/)

Since it uses these known frameworks, the syntax is very familiar like so:

```js
describe('Form Test', () => {
  it('should visit home page', () => {
    cy.visit('/home-page');
  });
});
```

It’s really incredible to see it all in action. When you run Cypress it opens a Chrome Browser and has your application running on the right with the Cypress test history on the left:

<iframe width="560" height="315" src="https://www.youtube.com/embed/KB3fj8ad--Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

As you can see from the video, the Cypress test runner shows the execution steps of your tests. You can see what happened at each step, and even **time travel** back to what the app looked like at a specific point. You also can use the test runner to be able to select elements for tests (think xpath queries with Karma).

Additionally, with the Cypress test runner you get an output in the form of a report and video. You can store that output locally or [send it to a Dashboard](https://www.cypress.io/dashboard/) with your CI provider.

For the purposes of our post here, we’re just going to walkthrough setting up Cypress locally. For additional information, I recommend checking out my [Angular-In-Depth post on Cypress here](https://blog.angularindepth.com/how-cypress-makes-testing-fun-a56da1294285). I also recommend Michael Karén’s Angular-In-Depth post on [Cypress here](https://blog.angularindepth.com/get-started-with-cypress-d6ac4b910605).

## Installing Cypress

So before you can write Cypress tests, you’ll need to install it as a dev dependency of your application.

Go to your project root and do the following:

```
npm install cypress --save-dev
```

> I should note that you can also do this same process in CI. Please consult the [Cypress docs for more info here](https://docs.cypress.io/guides/guides/continuous-integration.html#Setting-up-CI).

Once you’ve got it installed locally, you can run it directly from your `node_modules` directory with the following:

```
./node_modules/.bin/cypress open
```

I usually make this a npm script so I can just run it like so:

```
"cypress-open": "./node\_modules/.bin/cypress open"
```

You should also notice that Cypress right out of the box has several examples in the `/cypress/integration/examples` folder. These are really helpful when you’re first getting started. If you click “run all specs” you’ll see it run through the examples one file at a time.

Additionally, on your first run of Cypress notice several folders are created in your project:

![Alt Text](https://thepracticaldev.s3.amazonaws.com/i/9bw3oewycnwj7qjsua9j.png)

- **fixtures** are static data that you can call from within your tests. These could be mocks or stubbed responses. Check out the [official docs on Cypress fixtures](https://docs.cypress.io/api/commands/fixture.html#Syntax).
- **integration** is where you place your actual test files by default.
- **plugins** are where you can extend Cypress behavior.
- **screenshots** are where screenshots of your test runs are stored. There are also videos that can be taken, but that must be done with [the CI run of Cypress](https://docs.cypress.io/guides/guides/continuous-integration.html#).
- **support** is where you can define custom behavior of Cypress with your application.

With the `cypress-open` npm script I mentioned, you are working directly with the test runner. If you want to run it directly (as you would in CI) you’ll need to call `cypress run`. You can do this with another npm script like the following:

```
"cypress-run": "./node\_modules/.bin/cypress run"
```

Go ahead and run the npm script with the following:

```
npm run cypress-run
```

What you’ll find is that cypress will run the example tests right out of the box. This is nice because you can see what your CI output would look like. It also saves the videos (by default) in the “videos” directory.

![](https://atevans85.files.wordpress.com/2019/10/running_ci.png?w=919)

![](https://atevans85.files.wordpress.com/2019/10/video_directory.png?w=367)

> Note that the **videos** created with Cypress are only done when using `cypress run`, and not when just using the test runner locally. You can see more on this in [the Cypress configuration docs](https://docs.cypress.io/guides/references/configuration.html#Screenshots).

Also, Cypress can be configured with the `cypress.json` file in your project’s root directory. Please consult the [Cypress Docs for more info](https://docs.cypress.io/guides/references/configuration.html#Options).

In the next section we’ll write our first test!

## Your First Cypress Test

So as I mentioned in the intro, I’m going to be writing Cypress tests with my [project here](https://github.com/andrewevans0102/learn-cypress). Please go ahead and do a `git clone` of that project if you haven’t already done so.

Before we proceed, we also need to make sure we can run Cypress alongside our application. If you just open cypress like we did before, it runs the test runner against the [Cypress kitchen sink page](https://example.cypress.io/). This is great, except we want to run Cypress against a locally running application instead of a hosted environment.

How do we do this? There are several npm packages that will achieve this for us. I recommend the following:

- [concurrently](https://www.npmjs.com/package/concurrently) for local tests
- [start-server-and-test](https://www.npmjs.com/package/start-server-and-test) for CI tests

Since I’m focusing on local testing for this post, I’m just going to cover using **concurrently**.

First install concurrently in your project with:

```
npm i concurrently
```

Next I recommend creating an npm script that will call concurrently. You just have to supply concurrently two processes for it to run together. Here’s the script I created:

```
"cypress-local": "concurrently \"npm run start\" \"npm run cypress-open\""
```

Once you’ve done that, run the following:

```
npm run cypress-local
```

It should start the Cypress electron app and look like the following:

![](https://atevans85.files.wordpress.com/2019/10/example_tests.png?w=976)

As you can see in the screenshot, Cypress is seeing the example files.

> I recommend moving the examples from the `/examples` folder to a different directory outside of the `/integration` directory. This way the test runner only reads in the spec files you want to create and you don’t haver to be bothered with the default examples.

So now let’s go ahead and create a spec file for our first test.

In the sample app I’ve got pages that include:

- forms (login)
- lists
- network requests

I’ve also already built out tests for each page:

- forms = `cypress/integration/form.spec.js`
- lists = `cypress/integration/list.spec.js`
- network requests = `cypress/integration/network.spec.js`

I also created a file called `first_test.spec.js` that we can use to start. this file is found at `/cypress/integration/first_test.spec.js`. Let’s start there first.

The login form I’ve included with my sample app looks like the following:

![](https://atevans85.files.wordpress.com/2019/10/forms_page.png?w=1024)

The `first_test.spec.js` file already has a test that accesses the home page:

```js
describe('Form Test', () => {
  it('should visit home page', () => {
    cy.visit('http://localhost:4200/home-page');
  });
});
```

Here you see we’re using the `cy.visit` command to navigate to the home page.

![](https://atevans85.files.wordpress.com/2019/10/first_runner.png?w=1024)

To make things easier, lets add a base URL in the `cypress.json` file. This will prefix any URL paths we use to have the same base so we don’t have to type `http://localhost:4200` for tests.

So open `cypress.json` and add:

```
{ "baseUrl": "http://localhost:4200" }
```

Now lets change our test to just go to the `/home-page` path with:

```js
describe('Form Test', () => {
  it('should visit home page', () => {
    cy.visit('/home-page');
  });
});
```

Now when you run the test, you should see the same result.

## Selector Playground

![](https://atevans85.files.wordpress.com/2019/10/selector_playground.png?w=1024)

We’re going to find the start button on the home page, and then pass a `click` event to it. If you notice in the screenshot here, the “Cypress Selector Playground” tooltip is highlighted. We’ll need to click on that to turn that on. Once it’s on, you can select anything on the page and Cypress will generate the “cy.get” code for whatever element you’re trying to interact with.

Go back to the `first_test.spec.js` file from before. Run the test, and when it finishes click on the Playground Selector. Next click on the “start” button.

![](https://atevans85.files.wordpress.com/2019/10/selector_playground2.png?w=953)

The **Selector Playground** detected that the “start button” had an ID of “startButton,” and created the line of code to get it as the following:

```js
cy.get('#startbutton');
```

So lets go ahead and add that to a new test, where we go to the home page, and click the start button like so:

```js
describe('Form Test', () => {
  it('should visit home page', () => {
    cy.visit('/home-page');
  });

  it('should visit home page and click start', () => {
    cy.visit('/home-page');
    cy.get('#startButton').click();
    cy.get('h1').should('contain', 'Learn Cypress');
  });
});
```

Here you notice that I also added a `should` to do an actual test. I’m verifying that the `h1` element on the page has the text “Learn Cypress.” Since this all sits on top of mocha, chai, and sinon this is somewhat intuitive if you’ve used test runners before.

When you run the test again, you should see the following:

![](https://atevans85.files.wordpress.com/2019/10/learn_cypress.png?w=1024)

Now let’s wrap up the test by actually going to the page, entering a value and checking that the value is entered.

The finished test is in the file `cypress/integration/form.spec.js` as you see here:

```js
describe('Form Test', () => {
  it('should visit home page', () => {
    cy.visit('/home-page');
  });

  it('should visit home page and click start', () => {
    cy.visit('/home-page');
    cy.get('#startButton').click();
    cy.get('h1').should('contain', 'Learn Cypress');
  });

  it('should go to the forms page and enter login information', () => {
    cy.visit('/home-page');
    cy.get('#startButton').click();
    cy.get('h1').should('contain', 'Learn Cypress');
    cy.get('#formsButton').click();
    cy.get('#email').type('HanSolo@gmail.com');
    cy.get('#password').type('password');
    cy.get('#submitButton').click();
    cy.get('#popupMessage').should('contain', 'login successful');
  });
});
```

## List Pages

In most frontend applications you’ll utilize a list of some form. In my sample project I’ve included a list page that has a basic list that you can add and delete records from.

In my sample project if you look at the file `/cypress/integration/list.spec.js` you’ll see the list tests that I’ve written.

```js
describe('List Test', () => {
  it('should go to the list page and add a value', () => {
    cy.visit('/home-page');
    cy.get('#startButton').click();
    cy.get('h1').should('contain', 'Learn Cypress');
    cy.get('#listsButton').click();
    cy.get('#createInput').type('use the force Luke!');
    cy.get('#createButton').click();
    cy.get('li')
      .eq(4)
      .should('contain', 'use the force Luke!');
  });

  it('should go to the list page and delete a value', () => {
    cy.visit('/home-page');
    cy.get('#startButton').click();
    cy.get('h1').should('contain', 'Learn Cypress');
    cy.get('#listsButton').click();
    cy.get('#createInput').type('use the force Luke!');
    cy.get('#createButton').click();
    cy.get('li')
      .eq(4)
      .should('contain', 'use the force Luke!');
    cy.get('li > .value-row > .btn')
      .eq(4)
      .click();
    cy.get('ul')
      .its('length')
      .should('be.eq', 4);
  });
});
```

They’re very simple but basically just tests behavior for adding and removing a value from the list. If you notice, Cypress enables you to select items within a list with the “eq” syntax. This is really powerful, and also very intuitive.

In this case I found the fifth (counting starts at 0) element that I added, and did an assertion of its value.

Also in the delete test I check for the lists length with a “its” as you see here.

There are a lot more cool things you can do with lists. Check out the Cypress Docs on this [type of selection here](https://docs.cypress.io/api/commands/eq.html#Index).

## Network Requests

Finally, let’s briefly discuss network requests. Cypress has a lot of great support for async behavior and network requests.

If you navigate over to my sample project’s “Network Requests” page you’ll see that it asks you to pick a Star Wars movie. Once you’ve selected the movie, if you click “show details” it calls the [Star Wars API](https://swapi.co/) and retrieves some details.

![](https://atevans85.files.wordpress.com/2019/10/network_requests.png?w=1024)

> My project here is using the Star Wars API that [can be viewed here](https://swapi.co/). The project is open source and a fun API that you can use in projects.

To test this directly (an actual end to end test) looks like the following:

```js
it('should go to the network requests page and select a movie', () => {
  cy.visit('/home-page');
  cy.get('#startButton').click();
  cy.get('h1').should('contain', 'Learn Cypress');
  cy.get('#networkButton').click();
  cy.get('#movieSelect').select('A New Hope (1)');
  cy.get('#detailsButton').click();
  cy.get('#movieTitle').should('contain', 'A New Hope');
  cy.get('#episodeNumber').should('contain', 4);
});
```

You can also verify the underlying payload from the API by intercepting the HTTP calls with Cypress. If you add a `beforeEach` that includes `cy.server` and `cy.route`:

```js
beforeEach(() => {
  // server starts to listen for http calls
  cy.server();
  // create route that cypress will listen for, here it is the films endpoint of the SWAPI
  cy.route('GET', 'https://swapi.co/api/films/**').as('films');
});

it('should go to the network requests page and verify the HTTP payload called', () => {
  cy.visit('/home-page');
  cy.get('#startButton').click();
  cy.get('h1').should('contain', 'Learn Cypress');
  cy.get('#networkButton').click();
  cy.get('#movieSelect').select('A New Hope (1)');
  cy.get('#detailsButton').click();

  // await the response from the SWAPI http call
  cy.wait('@films').then(films => {
    expect(films.response.body.title).to.equal('A New Hope');
  });

  cy.get('#movieTitle').should('contain', 'A New Hope');
  cy.get('#episodeNumber').should('contain', 4);
});
```

![](https://atevans85.files.wordpress.com/2019/10/network_requests2.png?w=1024)

There are a lot of really cool things you can do with the network request options with Cypress. Check out the [docs for more info](https://docs.cypress.io/api/commands/server.html#Syntax).

## Tasks

In addition to the basic testing behavior we’ve covered you can also setup `tasks` in Cypress.

`Tasks` in Cypress are ways that you can get the runner to do some action alongside a test that is run. A typical example is read a file during testing. The code for this could look similar to the following:

```js
// in plugins/index.js
const fs = require('fs');

module.exports = (on, config) => {
  on('task', {
    readFileMaybe(filename) {
      if (fs.existsSync(filename)) {
        return fs.readFileSync(filename, 'utf8');
      }

      return null;
    }
  });
};
```

> This example was copied from [the Cypress Tasks documentation](https://docs.cypress.io/api/commands/task.html#Command).

There are a lot of cool things you can do with tasks. My friend [Tim Deschryver](https://twitter.com/tim_deschryver) wrote a really good [post covering Cypress tasks here](https://timdeschryver.dev/posts/reseed-your-database-with-cypress).

## Commands

`Commands` in Cypress enable you to create routines that your tests can follow. This is particularly advantageous with a login or logout flow. It prevents you from having to add boilerplate code to walkthrough the login pages etc.

I’ve included an example of this in my GitHub project. If you go over to the file at `cypress/support/commands.js` file you’ll see the following:

```js
Cypress.Commands.add('start', () => {
  cy.visit('/home-page');
  cy.get('#startButton').click();
  cy.get('h1').should('contain', 'Learn Cypress');
  cy.get('#formsButton').should('contain', 'Forms');
  cy.get('#listsButton').should('contain', 'Lists');
  cy.get('#networkButton').should('contain', 'Network Requests');
});
```

Here you can see that the syntax almost is identical to how we were setting up our tests before. The difference here is that we are registering this behavior as a `command`. The really cool part about this is that you can use this to reduce boiler plate in your tests.

If you next go over to the file at `cypress/integration/command_test.spec.js` you’ll see the following:

```js
describe('Network Requests Page Test', () => {
  before(() => {
    cy.start();
  });

  it('should use a Cypress command to go to the forms page', () => {
    cy.get('#formsButton').click();
    cy.get('h1').should('contain', 'Forms Page');
  });
});
```

Here you notice in the test’s `before` block I make reference to “start” which is just the command I built in the **support** directory. Before this test ran, Cypress read in the “start” command that I had created.

This is one of many really cool things you can do with commands. I recommend checking out the [docs on this here](https://docs.cypress.io/api/cypress-api/custom-commands.html#Syntax).

## Wrapping Up

So in this post you were introduced to Cypress. You were able to write some basic tests, and got the appropriate links to learn more. I highly recommend working with my sample project and building out additional tests. The Cypress documentation is really thorough, and they have a [team of folks that are maintaining it](https://www.cypress.io/about).

One thing that I didn’t mention was that it currently only supports Chrome, but there is [discussion of future browser expansion](https://github.com/cypress-io/cypress/issues/310). However, when you consider the huge user base that Chrome supports, you realize that this really isn’t a problem for many applications.

In my honest opinion, the most powerful part of Cypress is that **it makes testing fun**. Once you’ve worked with Cypress for some time, you’ll notice that you enjoy the process of building tests in your project. It also greatly improves your code quality as the Cypress tests force you to see code you wouldn’t have noticed otherwise.

I hope my post has helped you to get started with Cypress. Feel free to leave comments and follow me on Twitter at [@AndrewEvans0102](https://www.twitter.com/andrewevans0102)!
