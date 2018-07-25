import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
   <div class="modal-container">
    <div class="modal-backdrop"></div>
    <div class="modal-body">
      <ng-content></ng-content> 
      <footer class="modal-footer">
        <ng-content></ng-content> 
      </footer>
    </div>
   </div>
  `
})
export class ModalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}