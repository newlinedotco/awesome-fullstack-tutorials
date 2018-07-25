import { Component } from '@angular/core';
import { HttpService } from './services/http.service';
import { Movie } from './_interfaces/movie.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public movies: Movie[];

  constructor(private httpService: HttpService){}

  public getMovies = () => {
    let route: string = 'http://localhost:5000/api/movies';

    this.httpService.getData(route)
    .subscribe((result) => {
      this.movies = result as Movie[];
    },
    (error) => {
      console.error(error);
    });
  }
}
