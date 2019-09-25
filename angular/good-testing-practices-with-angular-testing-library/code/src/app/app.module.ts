import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";
import { of } from 'rxjs';

import { MaterialModule } from "./material.module";
import { FeedbackContainer, FeedbackService } from "./feedback.container";
import { FeedbackComponent } from "./feedback.component";

@NgModule({
  declarations: [FeedbackContainer, FeedbackComponent],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    {
      provide: FeedbackService,
      useValue: {
        shirtSizes$: of(["XS", "S", "M", "L", "XL", "XXL"]),
        submit: console.log
      }
    }
  ],
  bootstrap: [FeedbackContainer]
})
export class AppModule {}
