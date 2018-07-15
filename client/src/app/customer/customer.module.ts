import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '../../../node_modules/@angular/forms';
import { allContainerComponents } from './container';
import { allPresentationalComponents } from './presentational';
import { CustomerFormComponent } from './presentational/customer-form/customer-form.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [
    ...allPresentationalComponents,
    ...allContainerComponents,
    CustomerFormComponent
  ],
  exports: [...allContainerComponents]
})
export class CustomerModule {}
