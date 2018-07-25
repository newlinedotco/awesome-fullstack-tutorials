import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from './modal.service';
import { LoginModalComponent } from './login-modal/login-modal.component';

@NgModule({
  imports: [BrowserModule],
  declarations: [AppComponent, ModalComponent, LoginModalComponent],
  entryComponents: [ModalComponent, LoginModalComponent],
  bootstrap: [AppComponent],
  providers: [ModalService]
})
export class AppModule { }
