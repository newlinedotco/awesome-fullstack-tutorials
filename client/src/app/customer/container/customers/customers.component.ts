import { Component, OnInit } from '@angular/core';
import { Observable } from '../../../../../node_modules/rxjs';
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
}
