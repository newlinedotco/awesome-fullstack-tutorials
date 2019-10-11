# Replace @OutPut, @Input, and EventEmitters with ViewChild For Component Interction
The first time I used the Angular framework I found the concept of two-way data binding hard to keep track of. A simple app grew complex with the more properties I needed to share between child and parent components. The straight forward solution was to use data binding with @Input, @Output and event emitters. There's a better way, however. Using viewChild is one, and utilizing Services is another. In this tutorial, ill show you how to use viewChild as an effective way of passing props and accessing content in a child component from a parent component.

## what youll learn
- Why Use ViewChild?
- What Is ViewChild?
- How Is ViewChild Structured?
- Referencing With ViewChild
- How To Use ViewChild
- Conclusion


## Why Use ViewChild?
We'll use ViewChild instead of @Output and event emitter to allow a parent component to access the child component's content. this comes in handy when we want to keep track of data that rely on one another, such as statuses.

## What Is ViewChild?
ViewChild is a property decorator. It is a class or a class member (an attribute or a method) that configures (decorates) a view query.

## How Is ViewChild Structured?
To use the ViewChild one must understand ViewChild. Here is a code snippet to help us break down the decorator's basic structure.

```typescript
@Component({
  selector: 'app-modal',
  template: `
    <div #elementToMatch></div>
  `
})
export class MyCompComponent {
  @ViewChild('elementToMatch', { static: false }) elementToMatch: ElementRef;
}
```

As we can see the ViewChild decorator accepts three parameters:
- selector
  - first parameter that matches the first component, directive, or element in the view query as a reference.
- static
  - a boolean that tells angular if the query should be ran statically or dynamically which changes when the view query will resolve.
- read
  - an optional param that allows changing of the type of view query result.

We use these parameters as a way of referencing an element in the DOM, or a component or directive.

## Referencing With ViewChild
there are a few ways of referencing a selector: template, reference of component or directive decorators, or a templateRef. 
in our sample we are using a templateRef where whe attached `#elementToMatch` to the `div` tag. this is our 'hook', a way to reference the element of interest.


## How To Use ViewChild
Now that we understand why we use ViewChild, and what its made of we can start understanding how it works, we'll use an example of grabbing a child component's data from the parent component. this could be helpful in situations like modal views, or keeping track of selected items.
it uses the change detector to find the first element or directive that matches the selector in the view DOM. 

## step 1: edit the app component
edit the components typescript file to setup out the functionality so the function `changeChildCompState()` will replace the string variable `buttonState` once clicked.
```typescript
  buttonState = 'n/a'

  changeChildCompState() {
    this.buttonState = 'clicked'
  }
```

navigate to the app.component.html and edit it like so. we are adding the buttonState string and adding a click handler to a button to call our `changeChildCompState()` function.

```typescript
<h1>Welcome to {{ title }}!</h1>
<h2>{{ buttonState }}</h2>
<button (click)="changeChildCompState()">Change component state</button>
```

Now if we navigate to the app. we will see our button and the interpolated texts. When we click the button our string should go from n/a to clicked.

![app component html img]()

## step 2: generate a new component
this will be the child component that is triggered from the button we added in app component
 - run `ng generate component child` to genenrate a component named child.
We now will add the modal component to our `app.component.html` file like so

```typescript
<app-child></app-child>
```

once added you should see proof that the component has been added 
[screenshot]()

## step 3: update the child component
add the method `changeCompState()` and the variables `compState` and `compTitle`. These we will access through the parent component using the ViewChild decorator.

when finished the code should look like this:
```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {


  compState = "inactive"
  compTitle = "Child Component"

  constructor() { }

  ngOnInit() {
  }


  changeCompState() {
    this.compState = "active"

  }

}
```

## step 4: update app component to trigger the modal component using ViewChild
Let's start by adding a reference, `childRef` to the child component's tag in the app template like so
```typescript
<app-modal #childRef></app-modal>
```

import ViewChild from angular core and elementref
```typescript
import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
```
next add a ViewChild property of type elementRef named `childElementRef` and target the reference we added to the app-modal tag `childRef`.
```typescript
  @ViewChild('childRef')  childElementRef: ElementRef;

```

Now we can access the referenced element after the parent component is rendered from using the lifecycle hook `ngAfterViewInit`. To do so first implement `AfterViewInit` to the class. 

```typescript
export class AppComponent implements AfterViewInit {}
```

now we can create the method `ngAFterViewInit`. inside the method we'll access the referenced component like so and log it to the console to view its content.
```typescript
  ngAfterViewInit(): void {
    console.log(this.childElementRef);
  }
  ```

if we check our browser's console we can see the accessible content from the child component
[screenshot of logged content]()


## step 4: final component updates
Seeing that the child component's content is accessible we'll use dot notation to first replace the string variable `childCompTitle` with the child component's title stored in it's own string variable `compTitle`. We do this after the parent component has rendered
```typescript

  ngAfterViewInit(): void {
    this.childCompTitle = this.childElementRef.compTitle;
  }
```

we can also invoke the child component's method `changeCompState()`.
To do so wrap the method call in a new method `changeChildCompState()`.
```typescript
  changeChildCompState() {
    this.childElementRef.changeCompState()
  }
  ```

this will call the child component's method whenever we click the button we've added the `changeChildCompState` method to.
[screenshot of button]()

clicking the button will change the text in the child component `inactive` to `active`.

## Conclusion
What we just learned is an easier way of handling child component data by using ViewChild to grab data from a child component, call a child component's function, and pass a prop from a parent component to a child component. We completely bypassed eventemitters, outputs, and inputs which could get messy and confusing quickly. 

take a look at the app below

https://stackblitz.com/edit/angular-viewchild-post

## references
- [share component data with other components](https://levelup.gitconnected.com/angular-7-share-component-data-with-other-components-1b91d6f0b93f)
- [Angular ViewChild](https://angular.io/api/core/ViewChild)
- [Angular ViewChild In Depth Explanation](https://blog.angular-university.io/angular-viewchild/)
- [component interaction](https://angular.io/guide/component-interaction)
