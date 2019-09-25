import { render, getByText } from "@testing-library/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { of } from "rxjs";

import { MaterialModule } from "./material.module";
import { FeedbackComponent } from "./feedback.component";
import { FeedbackContainer, FeedbackService } from "./feedback.container";

it("form should display error messages and submit if valid (component)", async () => {
  const submitSpy = jasmine.createSpy("submit");
  const component = await render(FeedbackComponent, {
    imports: [ReactiveFormsModule, MaterialModule],
    componentProperties: {
      shirtSizes: ["XS", "S", "M", "L", "XL", "XXL"],
      submitForm: {
        emit: submitSpy
      } as any
    }
  });

  component.getByText("Feedback form");

  const name = component.getByLabelText("Name");
  const rating = component.getByLabelText("Rating");
  const description = component.getByLabelText("Description");
  const shirtSize = component.getByLabelText("T-shirt size");
  const submit = component.getByText("Submit your feedback");

  const inputValues = {
    name: "Tim",
    rating: 7,
    description: "I really like @testing-library ♥",
    shirtSize: "M"
  };

  component.click(submit);
  expect(submitSpy).not.toHaveBeenCalled();

  component.input(name, {
    target: {
      value: inputValues.name
    }
  });

  component.type(rating, inputValues.rating);
  component.type(description, inputValues.description);

  component.click(shirtSize);
  // Because the select options aren't rendered in the component
  // Here `getByText` (exported from `@testing-library/angular`) is used to be able to search outside the component
  component.click(getByText(document.body, "L"));

  component.selectOptions(shirtSize, inputValues.shirtSize);

  component.type(name, "");
  component.getByText("Name is required");
  expect(name.getAttribute("aria-invalid")).toBe("true");

  component.type(name, "Bob");
  expect(component.queryByText("Name is required")).toBeNull();
  expect(name.getAttribute("aria-invalid")).toBe("false");

  component.type(rating, 15);
  component.queryByText("Rating must be between 0 and 10");
  expect(rating.getAttribute("aria-invalid")).toBe("true");

  component.type(rating, inputValues.rating);
  expect(rating.getAttribute("aria-invalid")).toBe("false");

  component.click(submit);
  expect(submitSpy).toHaveBeenCalledWith({
    ...inputValues,
    name: "Bob"
  });
});

it("form should display error messages and submit if valid (container)", async () => {
  const submitSpy = jasmine.createSpy("submit");
  const component = await render(FeedbackContainer, {
    declarations: [FeedbackComponent],
    imports: [ReactiveFormsModule, MaterialModule],
    providers: [
      {
        provide: FeedbackService,
        useValue: {
          shirtSizes$: of(["XS", "S", "M", "L", "XL", "XXL"]),
          submit: submitSpy
        }
      }
    ]
  });

  const submit = component.getByText("Submit your feedback");
  const inputValues = [
    { value: "Tim", label: /name/i, name: "name" },
    { value: 7, label: /rating/i, name: "rating" },
    {
      value: "I really like @testing-library ♥",
      label: /description/i,
      name: "description"
    },
    { value: "M", label: /T-shirt size/i, name: "shirtSize" }
  ];

  inputValues.forEach(({ value, label }) => {
    const control = component.getByLabelText(label);
    if (control.tagName === "MAT-SELECT") {
      component.selectOptions(control, value as string);
    } else {
      component.type(control, value);
    }
  });
  component.click(submit);

  expect(submitSpy).toHaveBeenCalledWith(
    inputValues.reduce((form, { value, name }) => {
      form[name] = value;
      return form;
    }, {})
  );
});
