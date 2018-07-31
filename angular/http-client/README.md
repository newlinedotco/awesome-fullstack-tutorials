# Angular 6 HttpClient

The HttpClient is an Angular module that allows your application to communicate with backend services over the HTTP protocol. You can perform all HTTP requests including GET, POST, PUT, PATCH and DELETE. You can also modify headers in order to insert authorization parameters, or to specify the type of content your application needs e.g. JSON, XML e.t.c.

The module also provides features such as testability, typed request and response objects, interception, Observable apis and error handling. If you are wondering what all those terms mean, don't worry. We'll cover them in this chapter. In order to use HttpClient in your application, you'll need to activate it in the project's root `AppModule`. Here is an example:

```ts
import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
```

## What will we build?

In the project we are going to build, we are going to explore how to use Angular's 6 HttpClient module. We'll use [Semantic UI CSS Framework](https://semantic-ui.com) to build the view layouts, and a [free online JSON server](https://jsonplaceholder.typicode.com/) as our backend. Later, we'll install a local [JSON Server](https://www.npmjs.com/package/json-server) on our machine and use it in our project.

## Example Code

You can find the full source code for the project on [GitHub](https://github.com/brandiqa/ng-http-sui). You can also check out the live code of the project on [StackBlitz](https://stackblitz.com/github/brandiqa/ng-http-sui). The following link will take you straight to the [live demo](https://qgniyoya.github.stackblitz.io) of the application.

Before we start working on the project, we'll need to look at a couple of technologies that we'll use to build the application.

## RxJS Library

RxJS stands for Reactive Extensions Library for JavaScript.

Why do we need this?

Well, about 20 years ago, the Internet had about 280 million users. The web technology used at that time was quite capable of handling the traffic then.

Fast forward to 2018. We now have over 4 billion Internet users. Facebook alone deals with 2 billion active users per month. That's like the entire Internet of 2010. Dealing with such massive traffic requires spreading our application across multiple servers. The problem with that is that each server is manipulating data concurrently. This makes it difficult to ensure data remains consistent among all servers at any given time. Definitely new technology is needed to solve modern problems.

Today, we have what is known as **Reactive Programming**, also known as **Reactive Architecture**. The goal of this technology to help developers build applications that are responsive, resilient, scalable and message-driven.

As an Angular developer, you have access to this technology via the open-source RxJS library. This comes already shipped in your project. You don't have to install anything. This means you can easily build an application that is easy to scale, and will always remain consistent whether traffic is high or low.

Reactive programming is a comprehensive topic that needs a chapter of its own. For the sake of clarity, I'll just mention only the RxJS classes and operators that we'll use to build the application.

### Observable

An [Observable](https://angular.io/guide/observables) is a class that provides support for passing data between publishers and subscribers in an application. It provides additional benefits over techniques such as Promises. Observables allow you to synchronously or asynchronously receive data from an HTTP response, keystroke, interval timer or an event listener. When you subscribe to an observable, the function responsible for fetching or pushing data gets executed. When the function completes, the subscriber gets a notification which can either be a success or a fail.

### Pipe

A [pipe](https://angular.io/guide/pipes) is a class that takes input data and transforms it into a desired output. In our case, we'll pipe received data through an error handler. We can also call a [retry()](https://angular.io/guide/http#retry) operation within a pipe to deal with network interruptions. Here is an example:

```ts
 getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl)
      .pipe(
         retry(3), // retry a failed request up to 3 times
         catchError(this.handleError) // then handle the error
      );
  }
```

Take note that `retry()` is placed before the error handler.

### Tap

This is simply a mechanism for wiretapping data passing through an Observable without causing disturbance. It's often used for logging.

### Error Operators

We have two operators that can help us manage errors that may be caused either by network interruptions or the server rejecting the request. These operators are:

- `catchError` - we'll use this to call our custom error handler
- `throwError` - we'll use this to pass a custom error message to the view

That's enough RxJS for now. You can check out their [reference](https://rxjs-dev.firebaseapp.com/api) api page for a complete list.

## Semantic UI CSS Framework

We'll use [Semantic UI](https://semantic-ui.com) to style our app with minimal effort. We'll also use an Angular version of the framework, [ng2-semantic-ui](https://edcarroll.github.io/ng2-semantic-ui), to make the site interactive. Below is the documentation for the elements we'll use. Do read the documentation to familiarize yourself before we get started.

- [Container](https://semantic-ui.com/elements/container.html) : Restricts width of page elements based on screen size
- [Segment](https://semantic-ui.com/elements/segment.html) : Groups related elements
- [Header](https://semantic-ui.com/elements/header.html) : Styling for page headers, content headers, sub headers e.t.c
- [Menu](https://semantic-ui.com/collections/menu.html) : Navigation bar styling
- [Loader](https://semantic-ui.com/elements/loader.html) : Displays Loading animation
- [sui-dimmer](https://edcarroll.github.io/ng2-semantic-ui/#/modules/dimmer) : Dims page when loading
- [sui-message](https://edcarroll.github.io/ng2-semantic-ui/#/collections/message) : Styling for info, warning and error messages
- [Table](https://semantic-ui.com/collections/table.html) : Styling for responsive html table
- [sui-pagination](https://edcarroll.github.io/ng2-semantic-ui/#/collections/pagination) : Table pagination controls
- [Form](https://semantic-ui.com/collections/form.html) : Styling for html form

Take note that elements starting with `sui` are Angular versions. The rest are just CSS styling.

### Project Setup

You'll need a recent version of NodeJS. It doesn't have to be the latest, but you should at least have version 6.9.0 or higher. The npm version also needs to be at least v3 or higher. In my case, am using Node v8.11, and npm v5.6.0. Once you've confirmed your Node environment meets the minimum specifications, proceed with installing or updating the following global packages:

```bash
# Angular CLI tool
npm i -g @angular/cli

# JSON Server
npm i -g json-server
```

Next, let's setup the project and install semantic-ui.

```bash
# Generate Angular Project
ng init ng-http-sui

# Install Angular Semantic-UI Dependency
cd ng-http-sui
npm i ng2-semantic-ui
```

Open `src/index.html` and add this line in the `<head>` section:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.min.css">
```

Open `src/app.module.ts` and add the following lines at the correct positions:

```ts
import { SuiModule } from 'ng2-semantic-ui'; // <- Add this
...
@NgModule({
  declarations: [
    ...
  ],
  imports: [
    BrowserModule,
    SuiModule, // <- Add this
  ],
  providers: [],
  bootstrap: [AppComponent]
})
...
```

Feel free to update the title as well. Let's now fire up the application to confirm everything is working.

```bash
ng serve
```

Give the compilation process a moment to finish. Once it's ready, you should be able to access the app at [localhost:4200](http://localhost:4200)

![ng-serve](https://github.com/brandiqa/awesome-fullstack-tutorials/blob/master/angular/http-client/images/01-ng-serve.jpg?raw=true)

### Generate Components and Routes

Next, we'll generate the necessary components required for our project. You'll need to stop the server to proceed with this task.

```bash
ng generate component components/post-list
ng generate component components/post-view
ng generate component components/post-form
```

Let's now setup routes. The `PostForm` component will be shared by the `CREATE` and `EDIT` routes. Open `app.module.ts` and insert the following code at the correct locations:

```ts
import { RouterModule, Routes } from '@angular/router';
...
const appRoutes: Routes = [
  { path: 'posts', component: PostListComponent },
  { path: 'post/create', component: PostFormComponent },
  { path: 'post/:id', component: PostComponent },
  { path: 'post/edit/:id', component: PostFormComponent },
  { path: '', redirectTo: '/posts', pathMatch: 'full' },
]
...
@NgModule({
  declarations: [
   ...
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes), // <- Insert this here
    SuiModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
...
```

 Open `app.component.html` and delete all existing code. Replace it with this one which contains a Navigation menu:

 ```html
 <div class="ui menu">
  <div class="header item">
    Angular 6 Http Client
  </div>
  <a class="active item" href="posts">
    Post List
  </a>
  <a class="item" href="post/create">
    Create Posts
  </a>
</div>

<div class="ui container">
  <div class="ui basic segment">
    <router-outlet></router-outlet>
  </div>
</div>
```

Fire up `ng serve`. The browser should now have the following output:

![ng-routes](https://github.com/brandiqa/awesome-fullstack-tutorials/blob/master/angular/http-client/images/02-routes.jpg?raw=true)

Click on `Create Posts` menu to ensure it works. It should output 'post-form works!'. Let's now proceed to the next step.

### Display List of Posts

As mentioned earlier, we'll be using a free online JSON server. We'll use the route [https://jsonplaceholder.typicode.com/posts](https://jsonplaceholder.typicode.com/posts) to access posts json data. Here is a small sample:

```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  },
  {
    "userId": 1,
    "id": 2,
    "title": "qui est esse",
    "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
  },
  {
    "userId": 1,
    "id": 3,
    "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
  },
]
```

First, we are going to need a `Post` model to encapsulate the json structure. Simply create the folder `models` under `src/app` directory. Then create the file `post.model.ts` inside the folder. Copy the following code:

```ts
export class Post {
  id: number;
  userId: number;
  title: String;
  body: String;
}
```

We are creating a class instead of an interface since we'll need to instantiate it when we want to create a new post.

Next, we'll need a Http Client service that will fetch data from the JSON site for our app. First close the running server with `Ctrl+C` and generate the service like this:

```bash
ng generate service services/post
```

The file `post.service.ts` will be created for you. Insert the following code in the right location:

```ts
..
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Post } from '../models/post.model';
...
export class PostService {

  private postsUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl)
      .pipe(
        tap(posts => console.log(`fetched ${posts.length} posts`))
      );
  }
}

```

Next, we need to enable the `HttpClientModule` module in `app.module.ts` for our service to work. Simply copy the following code in the right sections:

```ts
import { HttpClientModule } from '@angular/common/http';
...
 imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule, // <- Insert here
    SuiModule,
  ],
```

Next, we need to update the `PostList` component to perform the following actions:

- Perform a GET request via `PostService`
- Paginate the data
- Display the data on a table

Let's start with the `post-list.component.ts`. We're going to setup a paginated table that will list 10 records at a time. When we perform the GET `/posts` request, the application will receive 100 records which will be assigned to the variable `allPosts`. Using simple logic, we'll split this data into multiple pages each holding a maximum of 10 records. Update the code as follows:

```ts
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
...
export class PostListComponent implements OnInit {

  loading = false;
  // Pagination Fields
  allPosts: Post[] = [];
  posts: Post[] = []; // Current Page
  total = 0;
  selectedPage = 1;
  start = 0;
  limit = 10;
  end = this.limit;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.getPosts();
  }

  getPosts(): void {
    this.loading = true;
    this.postService.getPosts()
      .subscribe(posts => {
        this.total = posts.length;
        this.allPosts = posts;
        this.posts = this.allPosts.slice(this.start, this.end);
        this.loading = false;
      }
    );
  }

  // Handle Pagination Clicks
  public pageChange(page): void {
    this.start = (this.selectedPage - 1) * this.limit;
    this.end = this.start + this.limit;
    this.posts = this.allPosts.slice(this.start, this.end);
  }
}

```

Now overwrite the contents of `post-list.component.html` with this code. This will create a view of the paginated table that the user can interact with.

```html
<h2 class="ui header">
  Post List
</h2>
<hr>
<div class="ui segment">
  <sui-dimmer class="inverted" [(isDimmed)]="loading">
    <div class="ui text loader">Loading</div>
  </sui-dimmer>
  <table class="ui celled table">
    <thead>
      <tr>
        <th>Id</th>
        <th>UserId</th>
        <th>Title</th>
        <th>Edit</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let p of posts">
        <td>{{ p.id }}</td>
        <td>{{ p.userId }}</td>
        <td>
          <a href="post/{{p.id}}">{{ p.title }}</a>
        </td>
        <td>
          <a href="post/edit/{{p.id}}">
            <i class="edit icon"></i>
          </a>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th colspan="4">
          <sui-pagination [collectionSize]="total" [pageSize]="limit" [hasNavigationLinks]="true" [hasBoundaryLinks]="true" [(page)]="selectedPage"
            (pageChange)="pageChange()">
          </sui-pagination>
        </th>
      </tr>
    </tfoot>
  </table>
</div>
```

Start the server and check the browser. You should have the following view:

![post-list](https://github.com/brandiqa/awesome-fullstack-tutorials/blob/master/angular/http-client/images/03-post-list.png?raw=true)

Do click the pagination buttons to ensure everything works as expected. Next, we'll add some error handling code.

### Error Handling

Now that we have `PostList` working, we need to write some error handling code. A couple of things can go wrong with the `PostList` component:

1. Network interruption
2. Server sends an error response i.e. 404, 500

Currently, if either of the two happens, our application will continue display the spinning icon forever with no indication to the user that something has gone wrong. To fix this, open `post.service.ts` and update the code as follows:

```ts
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
...
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl)
      .pipe(
        tap(posts => console.log(`fetched ${posts.length} posts`)), // <- Add comma
        catchError(this.handleError<any>('updatePost')) <- Call error handling code here
      );
  }

  /**
  * Handle Http operation that failed.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // Log raw error to console
      console.error(error); // log to console instead

      // Log custom error message to console
      console.log(`${operation} failed: ${error.message}`);

      // Send custom error message to view
      return throwError(`${operation} failed: ${error.message}`);
    };
  }
  ...
```

Now our service is capable of handling errors. The `handleError` function simply constructs a custom error message which it sends back to the view layer. We need to update our html to display this error message. First update `post.list.component.ts`:

```ts
error: String; // <- Add this to the variables sections
...
getPosts(): void {
    this.loading = true;
    this.postService.getPosts()
      .subscribe(posts => {
        this.total = posts.length;
        this.allPosts = posts;
        this.posts = this.allPosts.slice(this.start, this.end);
        this.loading = false;
      },
      (error) => { // <- Add this error handling section
        this.error = error
        this.loading = false;
      }
    );
  }

```

Next add an element to display an error message in `post.list.component.html`. Place this section above the `table` tag.

```html
    ...
  </sui-dimmer>
  <div class="ui negative message {{ error ? 'visible' : 'hidden'}}">
    <i class="close icon"></i>
    <div class="header">An Error Occurred!</div>
    <p>{{error}}</p>
  </div>
<table>
  ...
```

Now let's test our error handling code. You can either change the URL in `post.service` to something incorrect or simply disconnect from the internet. Refresh the page and see if you get an error message:

![error-handling](https://github.com/brandiqa/awesome-fullstack-tutorials/blob/master/angular/http-client/images/04-error-handling.png?raw=true)

You should get a similar error message. Now, fix the problem you just simulated and move on to the next section.

### Display Single Post

Let's now work on displaying a single post. Start with adding a `getPost()` function to `post.service.ts`. Place this method below the `getPosts()` function:

```ts
 getPost(id: number): Observable<Post> {
    const url = `${this.postsUrl}/${id}`;
    return this.http.get<Post>(url).pipe(
      tap(_ => console.log(`fetched post id=${id}`)),
      catchError(this.handleError<Post>(`getPost id=${id}`))
    );
  }
```

Next, update the code in `post-view.component.ts` in the relevant sections as follows:

```ts
...
import { Post } from '../../models/post.model';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Location } from '@angular/common';

...
export class PostViewComponent implements OnInit {

  post: Post;
  loading: boolean;
  error: String;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getPost();
  }

  getPost() {
    this.loading = true;
    // Get Id from URL
    const id = +this.route.snapshot.paramMap.get('id');
    this.postService.getPost(id)
      .subscribe(post => {
        this.post = post
        this.loading = false
      },
        error => {
          this.error = error
          this.loading = false
        }
      )
  }
}

```

The way `PostView` works is that it expects a URL in the format `post/{id}`. The `id` is extracted from the URL and is used to call the `getPost(id)` function we defined in `post.service.ts`. If a post is found, it gets displayed. Otherwise an error message is displayed if the post is not found. Let's replace the code in `post-view.component.html` first before we test the new code:

```html
<h2 class="ui header">
  Post View
</h2>
<hr>
<div class="ui segment">
  <sui-dimmer class="inverted" [(isDimmed)]="loading">
    <div class="ui text loader">Loading...</div>
  </sui-dimmer>
  <div class="ui negative message {{ error ? 'visible' : 'hidden'}}">
    <i class="close icon"></i>
    <div class="header">Something went wrong!...</div>
    <p>{{error}}</p>
  </div>
  <h3 class="ui header">
    {{ post?.title }}
  </h3>
  <hr>
  <p>{{ post?.body }}</p>
</div>
```

If you look back at `post-list.component.html`, you'll notice that the column title is made up of hyperlinks. The cell code looks like this:

```html
 <td>
    <a href="post/{{p.id}}">{{ p.title }}</a>
 </td>
```

This link will take us to the `post-view` component page. Now refresh the page and click on any title. You should be taken to a view like this:

![post-view](https://github.com/brandiqa/awesome-fullstack-tutorials/blob/master/angular/http-client/images/05-post-view.png?raw=true)

Try entering a non-existent id in the URL such as: `http://localhost:4200/post/500`. An error message should get displayed. However, it's a little cryptic for casual end users. You can customize the `post.service` error handling code  in order to send a simpler error message. You can use the following error status codes to determine an appropriate error message.

- 404 : Post not found
- Unknown error : Network interruption
- 500: Server error

Now let's take a look at how we can Create, Update and Delete posts.

### Create Post Form

In order to use forms in Angular, we need to activate the `FormsModule` in `app.module.ts`:

```ts
import { FormsModule } from '@angular/forms';
...
 imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule, // <- Insert Forms Module here
    SuiModule,
  ],
```

Now we're ready to build Angular forms. The Create, Update and Delete features will all be implemented within the `PostForm` component and the `PostService` class. Let's start by updating the html file first. Open `post-form.component.html` and replace the existing code with this:

```html
<h2 class="ui header">
  Post Form
</h2>
<hr>
<div class="ui basic segment">
  <sui-dimmer class="inverted" [(isDimmed)]="loading">
    <div class="ui text loader">Please wait...</div>
  </sui-dimmer>
  <form class="ui form {{error ? 'error' : error}}" (ngSubmit)="onSubmit()" #postForm="ngForm" *ngIf="post">
    <div class="fields">
      <div class="field">
        <label>Id</label>
        <input type="number" [(ngModel)]="post.id" id="id" name="id" disabled>
      </div>
      <div class="field">
        <label>User Id</label>
        <input type="number" [(ngModel)]="post.userId" id="userId" name="userId" required>
      </div>
    </div>
    <div class="field">
      <label>Title</label>
      <input type="text" [(ngModel)]="post.title" id="title" name="title" required>
    </div>
    <div class="field">
      <label>Body</label>
      <textarea rows="5" [(ngModel)]="post.body" id="body" name="body" required></textarea>
    </div>
    <div class="ui error message">
      <div class="header">An Error Occurred!</div>
      <p>{{error}}</p>
    </div>
    <div class="ui buttons">
      <button type="submit" class="ui button green" [disabled]="!postForm.form.valid">{{submitText}}</button>
      <div class="or"></div>
      <button type="button" class="ui button" (click)="goBack()">Cancel</button>
    </div>
    <button *ngIf="post.id" type="button" class="ui button red right floated" (click)="onDelete()">Delete</button>
  </form>
</div>

```

We are using [Template-driven forms](https://angular.io/guide/forms). Validation is enforced by disabling the **submit button** and only enabling it when the form is valid. An error message will appear in case something goes wrong on the service end. This form is designed to handle both Create and Update operations. Let's look at how `post-form.component.ts` handles both situations. Update the code as follows:

```ts
import { Component, OnInit, Input } from '@angular/core'; // <- SImply add Input to existing import

import { Post } from '../../models/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Location } from '@angular/common';
...
@Input() post:Post;
  loading:boolean;
  submitText:String = "Save";
  error:String;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    this.getPost();
  }

  getPost() {
    this.loading = true;
    const id = +this.route.snapshot.paramMap.get('id');
    if(id) { // Fetch existing post
      console.log(`edit existing post ${id}`);
      this.postService.getPost(id)
        .subscribe(post => {
          this.post = post;
          this.submitText = "Update";
          this.loading = false;
        });
    } else {
      console.log('create new post');
      this.post = new Post(); // Create new post
      this.submitText = "Create";
      this.loading = false;
    }
  }

  onSubmit() {
    this.loading = true;
    if(this.post.id) { // Update Existing Post
      this.postService.updatePost(this.post)
        .subscribe(
          () => this.goBack(),
          error => this.handleError(error)
      );
    } else { // Create New Post
      this.postService.addPost(this.post)
        .subscribe(
          () => this.gotoPosts(),
          error => this.handleError(error)
        );
    }
  }

  onDelete() {
    this.loading = true;
    if(this.post.id) {
      this.postService.deletePost(this.post)
        .subscribe(
          () => this.goBack(),
          error => this.handleError(error)
        );
    }
  }

  gotoPosts() {
    this.router.navigate(['/posts']);
  }

  goBack() {
    this.location.back();
  }

  handleError(error) {
    this.error = error;
    this.loading = false;
  }

```

There are two ways this form is displayed to the user. If you look at the `PostList` table, we have a column called **edit**. It's cell code looks like this:

```html
 <td>
  <a href="post/edit/{{p.id}}">
    <i class="edit icon"></i>
  </a>
</td>
```

Clicking on any of the edit links will take you to `PostForm`. An id is passed via the URL which is then extracted and used to fetch a post. The fetched post is then loaded on the form ready for editing. The submit button text changes to **Update** letting the user know that they can update the existing record. The second way of accessing this form is through the `Create Post` menu link at the bottom. Since no `id` is supplied, a new Post instance is created and a blank form is loaded. The submit text button changes to **Create** letting the user know that they can Create a new record.

Now you may notice you may have some errors in your code due to non-existent functions in `post-service.ts`. Let's go ahead and fix that. Open the file and update the code accordingly:

```ts
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = { // <- Place outside class right below imports
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
...

  /** POST: add a new post to the server */
  addPost(newPost: Post): Observable<Post> {
    return this.http.post<Post>(this.postsUrl, newPost, httpOptions).pipe(
      tap((post: Post) => console.log(`added post w/ id=${post.id}`)),
      catchError(this.handleError<Post>('addPost'))
    );
  }

  /** DELETE: delete the post from the server */
  deletePost(post: Post | number): Observable<Post> {
    const id = typeof post === 'number' ? post : post.id;
    const url = `${this.postsUrl}/${id}`;

    return this.http.delete<Post>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted post id=${id}`)),
      catchError(this.handleError<Post>('deletePost'))
    );
  }

  /** UPDATE: update selected post on the server */
  updatePost(post: Post): Observable<any> {
    const url = `${this.postsUrl}/${post.id}`;
    // const url = `${this.postsUrl}`; // Uncomment this to demonstrate error handling

    return this.http.put(url, post, httpOptions).pipe(
      tap(_ => console.log(`updated post id=${post.id}`)),
      catchError(this.handleError<any>('updatePost'))
    );
  }
```

The service code is simple and self-explanatory. For Update and Delete functions, an id has to be passed to the backend service via the `url`. Now everything should work properly. Try the following:

- Create a new post
- Update an existing post
- Delete an existing post
- Simulate an error condition e.g. not passing an id for the update function

![post-edit-form](https://github.com/brandiqa/awesome-fullstack-tutorials/blob/master/angular/http-client/images/06-post-edit-form.png?raw=true)

The Create, Update, Delete operations should sort of work. The reason am saying sort of is because the backend server is actually returning fake responses to those requests. Nothing has actually changed. Later, we'll setup a local JSON server where actual changes will occur when we make those requests. First, let's look at interceptors.

### Interceptors - Logging

HTTP Interceptors allow developers to inspect and transform HTTP requests and responses passing between the application and the server. Interception can occur in both directions. Common use cases of interception include authentication, logging and cache manipulation.In this chapter, we'll take a look at implementing interceptors for logging and caching. The structure of an interceptor looks like this:

```ts
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class Interceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req);
  }
}
```

The above interceptor simply does nothing. It allows the `HttpRequest` to pass through without inspection nor modification. Let's create one for logging. Creating an interceptor is easy. Start by creating a folder called `http-interceptors` under the `app` folder. Next create the file `log.interceptor.ts` and copy the following code:

```ts
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap, finalize } from 'rxjs/operators';


@Injectable()
export class LogInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    let ok: string;

    // extend server response observable with logging
    return next.handle(req)
      .pipe(
        tap(
          // Succeeds when there is a response; ignore other events
          event => ok = event instanceof HttpResponse ? 'succeeded' : '',
          // Operation failed; error is an HttpErrorResponse
          error => ok = 'failed'
        ),
        // Log when response observable either completes or errors
        finalize(() => {
          const elapsed = Date.now() - started;
          const msg = `${req.method} "${req.urlWithParams}"
             ${ok} in ${elapsed} ms.`;
          console.log(msg);
        })
      );
  }
}
```

In the above example, we allow the request to pass through untouched. However, we capture the response by piping the result of `next.handle(req)`. We check the result to determine the status. We also calculate the duration it took for the server to respond to the request.

Next, we'll need to add the interceptor to our `app.module.ts` file. However, we'll be creating additional interceptors which will clutter the `app.module.ts`. To keep the file clean, we'll create a reference for all our interceptors in one file. Inside the `http-interceptor`'s folder, create `index.ts` and copy the following code:

```ts
/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LogInterceptor } from './log.interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: LogInterceptor, multi: true }
];

```

Next, update `app.module.ts` as follows:

```ts
import { httpInterceptorProviders } from './http-interceptors';
...
  providers: [httpInterceptorProviders],
...
```

Now interact with the application as usual. Open your browser console to see the logs. If you are using Chrome, just press `F12`.

![log-interceptor](https://github.com/brandiqa/awesome-fullstack-tutorials/blob/master/angular/http-client/images/07-log-interceptor.png?raw=true)

Fantastic! Isn't it. Now let's setup a local JSON server.

### Local JSON-Server

For this section, we are going to create a local database right inside our project. Start by creating a folder called `data` at the root of the project. Next, create a file called `db.json` and copy the following code:

```json
{
  "posts": [
    {
      "id": 1,
      "userId": 1,
      "title": "First Post",
      "body": "This is my first post!"
    },
    {
      "id": 2,
      "userId": 1,
      "title": "Second Post",
      "body": "This is my second post!"
    },
    {
      "id": 3,
      "userId": 2,
      "title": "Awesome Day",
      "body": "This is an article on how awesome my day is"
    }
  ]
}
```

Next open `package.json` and add the following scripts:

```json
"scripts": {
  "local": "ng serve -c local",
  "json": "json-server --watch data/db.json",
}
```

The json script is what we'll use to launch the `json server`. But what is the `local` script for?

Well, we are going to create a special environment where our application uses the local json server instead of the online one. To do this, we need to make some changes starting from `post.service.ts` file. Update the file as follows:

```ts
import { environment } from '../../environments/environment';
...
private postsUrl = environment.postsUrl;
```

Next open the file `environments/environment.ts` and update as follows:

```ts
export const environment = {
  production: false,
  postsUrl: 'https://jsonplaceholder.typicode.com/posts'
};

```

We've specified the online version of `postsUrl` in the default environment file. To specify the local version of `postsUrl`, we need to create a new environment. Create the file `environments/environment.local.ts` and copy the following:

```ts
export const environment = {
  production: false,
  postsUrl: 'http://localhost:3000/posts'
};
```

We now have the local `postsUrl` in the `environment.local.ts` file. We now need to configure our Angular project to recognize our new local environment. Open `angular.json` and look for the first "configurations" node. Under this node, you'll find "production". Add a comma then copy this:

```json
"local": {
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.local.ts"
    }
  ]
}
````

Next, look for the second "configurations" node which should be under the "serve" node. Add this node:

```json
"local": {
  "browserTarget": "ng-http-sui:build:local"
}
```

Don't forget to separate nodes with a comma.

Change `ng-http-sui` to match your project name in case you named it differently. Otherwise the command will fail. Now we are ready to launch the application with the new local environment. First, in a new terminal, start the local JSON server like this:

```bash
npm run json
```

Open the URL [localhost:3000/](http://localhost:3000/) to confirm the JSON server is running.

![json-server](https://github.com/brandiqa/awesome-fullstack-tutorials/blob/master/angular/http-client/images/08-json-server.png?raw=true)

Next, stop the current Angular server and start a new one using this command:

```bash
npm run local
```

Refresh or open the URL [http://localhost:4200/posts](http://localhost:4200/posts) in your browser. You should have the following view.

![ng-serve-local](https://github.com/brandiqa/awesome-fullstack-tutorials/blob/master/angular/http-client/images/09-ng-serve-local.png?raw=true)

Your application has now switched to the local database. This time, any changes you make will be persisted. Go ahead and perform CREATE, UPDATE and DELETE operations.

### Interceptors - Caching

Let's quickly create a new post:

![create-local](https://github.com/brandiqa/awesome-fullstack-tutorials/blob/master/angular/http-client/images/10-create-local.png?raw=true)

Hit save. You should be redirected to the list page upon successful save.

![post-create-local](https://github.com/brandiqa/awesome-fullstack-tutorials/blob/master/angular/http-client/images/11-post-create-local.png?raw=true)

Let's now update an existing record. You can simply add an exclamation mark to the title.

![update-local](https://github.com/brandiqa/awesome-fullstack-tutorials/blob/master/angular/http-client/images/12-update-local.png?raw=true)

When you hit the update button, you should be redirected to the post list page.

![post-update-local](https://github.com/brandiqa/awesome-fullstack-tutorials/blob/master/angular/http-client/images/13-post-update-local.png?raw=true)

Wait a minute, why has the title not changed. Hit the refresh button to confirm.

![post-update-refresh](https://github.com/brandiqa/awesome-fullstack-tutorials/blob/master/angular/http-client/images/14-post-update-refresh.png?raw=true)

Okay. This confirms the record was updated. For some reason, the old record was being listed instead of the new one. I suspect the problem has to do with caching. Let's write an interceptor to disable caching completely. Create a new file in `http-interceptors` folder called `cache.interceptor.ts`. Copy the following code:

```ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const httpRequest = req.clone({
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
      })
    });

    return next.handle(httpRequest);
  }
}
```

Next, you'll need to add this new interceptor to `http-interceptors/index.ts`:

```ts
/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LogInterceptor } from './log.interceptor';
import { CacheInterceptor } from './cache.interceptor'; // <- Add import here

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: LogInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }, // <- Add cache interceptor here

];

```

Next refresh the post and try updating an existing post. For example, rename the title of the last post to 'Just Another Post'. Hit the update button. You should be redirected to this view:

![cache-fix](https://github.com/brandiqa/awesome-fullstack-tutorials/blob/master/angular/http-client/images/15-cache-fix.png?raw=true)

Awesome! The fix has worked. That's all for this chapter. Feel free to modify the application to your liking. Also, check the following links for more information.

## Additional Links

- [Angular Http Client](https://angular.io/guide/http)
- [Angular Observables](https://angular.io/guide/observables)
- [RxJS Library](https://angular.io/guide/rx-library)
