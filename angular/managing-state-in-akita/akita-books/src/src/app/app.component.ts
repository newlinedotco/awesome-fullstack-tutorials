import { Component, NgZone } from '@angular/core';
import { akitaDevtools } from '@datorama/akita';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private ngZone: NgZone) {
    akitaDevtools(ngZone);
  }
}
