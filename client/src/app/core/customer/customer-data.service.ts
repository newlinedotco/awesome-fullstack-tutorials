import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Customer } from '../../shared/models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerDataService {
  private controllerEndpoint = `customers`;
  constructor(private readonly http: HttpClient) {}

  getAll() {
    return this.http.get<Customer[]>(
      `${environment.endpoint}${this.controllerEndpoint}`
    );
  }
  add(toAdd: Customer) {
    return this.http.post<Customer>(
      `${environment.endpoint}${this.controllerEndpoint}`,
      toAdd
    );
  }
}
