Managing State in Angular using Akita

# What is Akita?

Akita is a simple and effective state management for Angular applications. Akita is built on top of RxJS and inspired by models like Flux and Redux.

Akita encourages simplicity. It saves you the hassle of creating boilerplate code and offers powerful tools with a moderate learning curve, suitable for both experienced and inexperienced developers alike.

# Akita's Architecture

The heart of Akita is the Store and the Query.

![Akita](https://cdn-images-1.medium.com/max/2000/1*ZvboOQwyeAjPVKdYmaA1dA.png)

A Store is a single object which contains the store state and serves as the "single source of truth."

A Query is a class offering functionality responsible for querying the store.

Akita provides two types of stores, a basic store which can hold any shape of data and an entity store which represents a flat collection of entities.

Akita keeps the natural work process using Angular services to encapsulate and manage asynchronous logic and store update calls.

In this article, we'll build a books application and focus on the entities store feature because, for the most part, it will be the one you’ll use in your applications.

<hr />

# Creating Books Application

### The Book Model

The model is a representation of an entity. Let's create the Book model.

```ts
// book.model.ts

import { ID } from '@datorama/akita';

export type Book = {
  id: ID;
  name: string;
  author: string;
  genres: string[];
  description: string;
};
```

### The Books Store

Next thing we need to do is create a books table, i.e., an `EntityStore` managing a `Book` object:

```ts
// books.store.ts

import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Book } from './book.model';

export interface BooksState extends EntityState<Book> {}

@StoreConfig({ name: 'books' })
export class BooksStore extends EntityStore<BooksState, Book> {
  constructor() {
    super();
  }
}
```

First, we need to define the stores' interface. In our case, we can make do with extending the `EntityState` from Akita, providing it with the `Book` Entity type.

If you are curious, `EntityState` has the following signature:

```ts
export interface EntityState<T> {
  entities: HashMap<T>;
  ids: ID[];
  loading: boolean;
  error: any;
}
```

By using this model, you’ll receive from Akita a lot of built-in functionality, such as CRUD operations on entities, active entity management, error management, etc.

### The Books Query

You can think of the query as being similar to database queries. Its constructor function receives as parameters its own store and possibly other query classes.

Let’s see how we can use it to create a books query:

```ts
import { Injectable } from '@angular/core';
import { QueryEntity, ID } from '@datorama/akita';
import { BooksStore, BooksState } from './books.store';
import { Book } from './book.model';

export class BooksQuery extends QueryEntity<BooksState, Book> {
  constructor(protected store: BooksStore) {
    super(store);
  }
}
```

Here, you’ll receive from Akita a lot of built-in functionality, including methods such `selectAll()`, `selectEntity(id)`, `selectCount()`, `selectActive()` and many more.

### The Books Component

After we finished with Akita's setup, let's see how we can use it to display the lists of books.

```ts
// books.component.ts
@Component({
  templateUrl: './books.component.html'
})
export class BooksComponent implements OnInit {
  books$: Observable<Book[]>;
  selectLoading$: Observable<boolean>;

  constructor(
    private booksQuery: BooksQuery,
    private booksService: BooksService
  ) {}

  ngOnInit() {
    this.books$ = this.booksQuery.selectAll();
    this.selectLoading$ = this.booksQuery.selectLoading();
    this.getBooks();
  }

  getBooks() {
    if (this.booksQuery.isPristine) {
      this.booksService.getBooks();
    }
  }
}
```

The `selectLoading()` is a query method from Akita that provides the value of the loading key from the store reactively.

The initial value of the loading state is set to true and is switched to false when you call `store.set()`. We'll take advantage of this feature for toggling a spinner in our view.

The `selectAll()` is self-explanatory - Selects the entire store's entity collection reactively.

Next, we want to call our books endpoint in order to fetch the books from the server only on the first time.

When using entities store, it’s initial state is pristine, and when you call `store.set()`, Akita changes it to false. This can be used to determine whether the data is present in the store, to save on additional server requests.

### The Books Service

Let's see the `getBooks()` method.

```ts
// books.service.ts

export class BooksService {
  constructor(private booksStore: BooksStore) {}

  getBooks() {
    timer(300)
      .pipe(mapTo(booksMock))
      .subscribe(books => {
        this.booksStore.set(books);
      });
  }
}
```

The `getBooks()` method is responsible for fetching the books from the server and adding them to the store. (in real life, this will be a real API call)

Let's also see how we can add easily a sort by functionality with Akita.

```ts
export class BooksComponent implements OnInit {
  books$: Observable<Book[]>;
  selectLoading$: Observable<boolean>;
  sortControl = new FormControl('price');

  ngOnInit() {
    this.books$ = this.sortControl.valueChanges.pipe(
      startWith('price'),
      switchMap(sortBy => this.booksQuery.selectAll({ sortBy }))
    );
  }
}
```

The `selectAll()` method supports sorting the entities collection based on an enitity key. We can listen to the control
value changes and according to it let Akita sorting the collection.

We have one more requirement - when the user clicks on a book, we need to navigate to the book page, showing the full content.

### The Book Component

We'll leave it to you to set up a new route. Let's create the book component.

```ts
// book.component.ts
@Component({
  templateUrl: './book.component.html'
})
export class BookComponent implements OnInit {
  book$ = this.booksQuery.selectEntity(this.bookId);

  constructor(
    private activatedRoute: ActivatedRoute,
    private booksService: BooksService,
    private booksQuery: BooksQuery
  ) {}

  ngOnInit() {
    if (this.booksQuery.hasEntity(this.bookId) === false) {
      this.booksService.getBook(this.bookId);
    }
  }

  get bookId() {
    return this.activatedRoute.snapshot.params.id;
  }
}
```

We have a `book$` observable that returns reactivly the current book entity based on the ID we get from the router.

A user has the ability to navigate directly to a page in a book, so we need to check if that book entity exists in the the bookstore (via the query’s `hasEntity()` method). If the store doesn’t have the book, we need to fetch it from the server and update the store.

```ts
// books.service

export class BooksService {
  getBook(id: ID) {
    timer(300)
      .pipe(mapTo(bookMock))
      .subscribe(book => {
        this.booksStore.add(book);
      });
  }
}
```

# Summary

We’ve seen here how the various core concepts of Akita work together to give us an easy way to manage a bookstore. This is only a small taste of Akita; it has many more additional features, such as powerful plugins, devtools, cli, support for active state, transactions, web workers, etc.

I encourage you to explore the API by reading the docs and the source code of the demo application.
