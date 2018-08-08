import { BooksService } from './state/books.service';
import { Book } from './state/book.model';
import { BooksQuery } from './state/books.query';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { switchMap, startWith, tap } from 'rxjs/operators';

@Component({
  templateUrl: './books.component.html'
})
export class BooksComponent implements OnInit {
  books$: Observable<Book[]>;
  selectLoading$: Observable<boolean>;
  sortControl = new FormControl('price');

  constructor(
    private booksQuery: BooksQuery,
    private booksService: BooksService
  ) {}

  ngOnInit() {
    this.books$ = this.sortControl.valueChanges.pipe(
      startWith<keyof Book>('price'),
      switchMap(sortBy => {
        return this.booksQuery.selectAll({ sortBy: sortBy });
      })
    );
    this.selectLoading$ = this.booksQuery.selectLoading();
    this.getBooks();
  }

  getBooks() {
    if (this.booksQuery.isPristine) {
      this.booksService.getBooks();
    }
  }
}
