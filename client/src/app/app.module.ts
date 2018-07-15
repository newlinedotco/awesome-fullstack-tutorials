import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { CustomerModule } from './customer/customer.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CoreModule, CustomerModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
