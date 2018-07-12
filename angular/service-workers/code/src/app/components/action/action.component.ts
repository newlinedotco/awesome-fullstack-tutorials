import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-action',
    templateUrl: './action.component.html',
    styleUrls: ['./action.component.scss'],
})
export class ActionComponent {
    randomData: number[];

    constructor(private http: HttpClient) {}

    fetchData() {
        this.http
            .get(
                'https://www.random.org/integers/?num=4&min=1&max=20&col=1&base=10&format=plain&rnd=new',
                { responseType: 'text' },
            )
            .subscribe(
                data => {
                    this.randomData = data
                        .split('\n')
                        .filter(n => !!n)
                        .map(n => parseInt(n, 10));
                    console.log(this.randomData);
                },
                err => {
                    console.error(err);
                },
            );
    }
}
