import { Component, Injectable } from "@angular/core";
import { Observable } from 'rxjs';

@Component({
  selector: "feedback-container",
  template: `<feedback-form [shirtSizes]="service.shirtSizes$ | async" (submitForm)="service.submit($event)"></feedback-form>`,
})
export class FeedbackContainer {
  constructor(public service: FeedbackService) {}
}

@Injectable()
export abstract class FeedbackService {
  abstract shirtSizes$: Observable<string[]>;
  abstract submit(value: any): void;
}
