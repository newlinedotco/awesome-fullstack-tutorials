import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CustomerDataService } from '../../../core/customer/customer-data.service';
import { Customer } from '../../../shared/models/customer.model';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  customerDetails$: Observable<Customer>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dataService: CustomerDataService
  ) {}

  ngOnInit() {
    this.customerDetails$ = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('id')),
      switchMap((id: string) => this.dataService.getSingle(+id))
    );
  }
}
