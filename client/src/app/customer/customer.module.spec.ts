import { CustomerModule } from './customer.module';

describe('CustomerModule', () => {
  let customerModule: CustomerModule;

  beforeEach(() => {
    customerModule = new CustomerModule();
  });

  it('should create an instance', () => {
    expect(customerModule).toBeTruthy();
  });
});
