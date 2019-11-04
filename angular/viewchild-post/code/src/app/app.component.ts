import { Component, ViewChild, AfterViewInit, ElementRef } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements AfterViewInit {
  title = "viewchild-post";
  childCompTitle = "n/a";

  @ViewChild("childRef") childElementRef;

  ngAfterViewInit(): void {
    this.childCompTitle = this.childElementRef.compTitle;
  }

  changeChildCompState() {
    this.childElementRef.changeCompState("active");
  }
}
