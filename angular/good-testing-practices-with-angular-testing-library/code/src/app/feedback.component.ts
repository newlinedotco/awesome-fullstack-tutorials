import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: "feedback-form",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.css"]
})
export class FeedbackComponent {
  @Input() shirtSizes: string[];
  @Output() submitForm = new EventEmitter<any>();

  form = this.formBuilder.group({
    name: ["", [Validators.required]],
    rating: ["", [Validators.required, Validators.min(0), Validators.max(10)]],
    description: [""],
    shirtSize: ["", [Validators.required]]
  });

  nameControl = this.form.get("name");
  ratingControl = this.form.get("rating");
  shirtSizeControl = this.form.get("shirtSize");

  constructor(private formBuilder: FormBuilder) {}

  submit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    }
  }
}
