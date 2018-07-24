import { Movie } from './../../_interfaces/movie.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  @Input() public movies: Movie[];

  constructor() { }

  ngOnInit() {
  }

}
