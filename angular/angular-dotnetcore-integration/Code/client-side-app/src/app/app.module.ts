import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { MovieListComponent } from './movies/movie-list/movie-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MovieListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
