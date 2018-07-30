import { TestBed, inject } from '@angular/core/testing';

import { CustomerDataService } from './customer-data.service';

describe('CustomerDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerDataService]
    });
  });

  it('should be created', inject([CustomerDataService], (service: CustomerDataService) => {
    expect(service).toBeTruthy();
  }));
});
