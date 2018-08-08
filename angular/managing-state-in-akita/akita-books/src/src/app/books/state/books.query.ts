import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { BooksStore, BooksState } from './books.store';
import { Book } from './book.model';

@Injectable({ providedIn: 'root' })
export class BooksQuery extends QueryEntity<BooksState, Book> {
  constructor(protected store: BooksStore) {
    super(store);
  }
}
