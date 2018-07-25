import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ModalService } from './modal.service';
import { LoginModalComponent } from './login-modal/login-modal.component';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  @ViewChild(TemplateRef) tpl: TemplateRef<any>;

  constructor(private modal: ModalService) { }

  openModal() {
    this.modal.open(LoginModalComponent);
  }

  click() {}
}
