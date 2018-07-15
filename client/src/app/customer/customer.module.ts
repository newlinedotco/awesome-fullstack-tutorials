import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { allContainerComponents } from './container';
import { allPresentationalComponents } from './presentational';
import { CustomerFormComponent } from './presentational/customer-form/customer-form.component';

@NgModule({
  imports: [CommonModule],
  declarations: [...allPresentationalComponents, ...allContainerComponents, CustomerFormComponent],
  exports: [...allContainerComponents]
})
export class CustomerModule {}
