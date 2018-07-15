import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CustomerDataService } from '../../../core/customer/customer-data.service';
import { Customer } from '../../../shared/models/customer.model';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  allCustomers$: Observable<Customer[]>;
  constructor(private readonly customerDataService: CustomerDataService) {}

  ngOnInit() {
    this.allCustomers$ = this.customerDataService.getAll();
  }

  customerAdded(customerToAdd: Customer) {
    console.log(customerToAdd);
    this.allCustomers$ = this.customerDataService
      .add(customerToAdd)
      .pipe(switchMap(() => this.customerDataService.getAll()));
  }
}
