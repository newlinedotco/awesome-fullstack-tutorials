import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {


  compState = "inactive"
  compTitle = "Child Component"
  newState: string;

  constructor() { }

  ngOnInit() {
  }


  changeCompState(newState) {
    this.compState = newState

  }

}
