import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customer/container/customers/customers.component';
import { CustomerDetailsComponent } from './customer/presentational/customer-details/customer-details.component';

const routes: Routes = [
  { path: 'details/:id', component: CustomerDetailsComponent },
  { path: 'home', component: CustomersComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
