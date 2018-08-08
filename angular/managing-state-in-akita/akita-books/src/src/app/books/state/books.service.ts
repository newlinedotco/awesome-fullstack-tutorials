import { ID } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { BooksStore } from './books.store';
import { books } from './../books.data';
import { timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BooksService {
  constructor(private booksStore: BooksStore) {}

  getBooks() {
    timer(1000)
      .pipe(mapTo(books))
      .subscribe(books => {
        this.booksStore.set(books);
      });
  }

  getBook(id: ID) {
    const book = books.find(current => +current.id === +id);

    timer(50)
      .pipe(mapTo(book))
      .subscribe(book => {
        this.booksStore.add(book);
      });
  }
}
