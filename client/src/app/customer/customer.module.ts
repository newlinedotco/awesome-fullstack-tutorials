import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { allContainerComponents } from './container';
import { allPresentationalComponents } from './presentational';
import { CustomerDetailsComponent } from './presentational/customer-details/customer-details.component';
import { CustomerFormComponent } from './presentational/customer-form/customer-form.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  declarations: [
    ...allPresentationalComponents,
    ...allContainerComponents,
    CustomerFormComponent,
    CustomerDetailsComponent
  ],
  exports: [...allContainerComponents]
})
export class CustomerModule {}
