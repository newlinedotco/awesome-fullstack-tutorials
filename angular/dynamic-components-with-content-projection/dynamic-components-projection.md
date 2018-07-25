# Angular Dynamic Components with Content Projection

In this article, we are going to learn how to **apply content projection** to **dynamically generated components**.

The idea is this: imagine you have a _modal_ window component -- you want to encapsulate the idea of a popup message that can be reused in many different situations. 

But there's a problem -- how do you customize the modal for each individual situation? In this example, we'll show how to create a **dynamically generated component** that also supports _content projection_.

> You can run the final example on [StackBlitz here](https://dynamic-ng-content-l9cfn6.stackblitz.io).

<iframe width="700" height="400" allowfullscreen="" frameborder="0" src="https://stackblitz.com/edit/dynamic-ng-content-l9cfn6?embed=1&file=src/app/login-modal/login-modal.component.ts"></iframe>

We'll create a modal component and expose a modal service that will give our consumers the ability to open the modal in one of the following methods:

```javascript
@Component({
  ...
})
export class NavComponent {

  constructor(private modal: ModalService) { }

  open() {
    this.modal.open(LoginModalComponent);
    this.modal.open(TemplateRef);
    this.modal.open('Text to display');
  }
}

```

Let's start by creating the modal component:

```javascript
@Component({
  template: `
   <div class="modal-container">

    <div class="modal-body">
      <ng-content></ng-content>
    </div>

   </div>
  `
})
export class ModalComponent implements OnInit {
}
```

We have wrapping elements for styling purposes and `ng-content` tag that will be replaced with a custom component, template or a string that will get from the consumer.

Let's continue with the service.

```javascript
@Injectable()
export class ModalService {

  constructor(private resolver : ComponentFactoryResolver,
              private injector: Injector,
              @Inject(DOCUMENT) private document: Document
              ) { }

  open() {
    const factory = this.resolver.resolveComponentFactory(ModalComponent);
    const componentRef = factory.create(this.injector);

    componentRef.hostView.detectChanges();
    const { nativeElement } = componentRef.location;
    this.document.body.appendChild(nativeElement);
  }

}
```

The `resolveComponentFactory()` method takes a component and returns a `ComponentFactory`. You can think of `ComponentFactory` as an object that knows how to create a component. Once we have a factory, we can use the `create()` method to create a `componentRef` instance, passing the current injector.

A `componentRef` exposes a reference to the native DOM element which we append to the body.

In this stage, we can call the service `open()` method, and we'll get an empty working modal.

What we want now is to give our consumers the ability to pass a custom component, a template or a string and inject it as `ng-content`. Let's see how can we do it.

The factory `create()` method excepts as the second parameter `projectableNodes`, which is a two-dimensional array of DOM elements that Angular will pass as `ng-content` to the current component.

```javascript
  open() {
    const factory = this.resolver.resolveComponentFactory(ModalComponent);
    const componentRef = factory.create(this.injector, [ [] ]); // <==============

    componentRef.hostView.detectChanges();
    const { nativeElement } = componentRef.location;
    this.document.body.appendChild(nativeElement);
  }
```

Let's see how can we get a reference to the DOM elements in each of the cases mentioned above.

## Handling Strings
Strings are the most straightforward case. If the content is a string, we create a text node.

```javascript
export type Content<T> = string | TemplateRef<T> | Type<T>;

@Injectable()
export class ModalService {

  constructor(private resolver: ComponentFactoryResolver,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) { }

  open<T>(content: Content<T>) {
    const factory = this.resolver.resolveComponentFactory(ModalComponent);
    const ngContent = this.resolveNgContent(content);
    const componentRef = factory.create(this.injector, ngContent);

    componentRef.hostView.detectChanges();

    const { nativeElement } = componentRef.location;
    this.document.body.appendChild(nativeElement);
  }

  resolveNgContent<T>(content: Content<T>) {
    if (typeof content === 'string') {
      const element = this.document.createTextNode(content);
      return [[element]];
    }
  }
}
```

Now we can call the `open()` method and pass a string that'll be displayed in the modal.

```javascript
openModal() {
  this.modal.open('ng-content content');
}
```
## Handling Templates

By template, we mean a `TemplateRef`. For example, we want to be able to pass a reference to the template:

```html
<button (click)="openModal()">Open</button>

<ng-template #tpl>
  <h1>Login/h1>
  <button (click)="click()">submit</button>
</ng-template>
```

```javascript
export class NavComponent  {
  @ViewChild(TemplateRef) tpl: TemplateRef<any>;

  constructor(private modal: ModalService) {}

  openModal() {
    this.modal.open(this.tpl);
  }
}
```

Let's update our `resolveNgContent()` method and add support for this functionally.

```javascript
  resolveNgContent<T>(content: Content<T>) {
    if (typeof content === 'string') {
      const element = this.document.createTextNode(content);
      return [[element]];
    }

    if (content instanceof TemplateRef) {
      const viewRef = content.createEmbeddedView(null);
      return [viewRef.rootNodes];
    }
  }
```

We instantiate an embedded view based on the `TemplateRef` which returns a `viewRef` instance. This instance exposes a `rootNodes` property, which is an array of DOM nodes that are extracted from the template.

## Handling Components
The last and most powerful option is to be able to pass a custom component that will be injected as `ng-content`. For example:

```javascript
// login-modal.component.ts

@Component({
  template: `Login Modal Component`
})
export class LoginModalComponent {}
```

```javascript
// login.component.ts
import { LoginModalComponent } from './login-modal/login-modal.component';

@Component({
  ...
})
export class NavComponent  {
  constructor(private modal: ModalService) {}

  login() {
    this.modal.open(LoginModalComponent);
  }
}
```

Let's update our `resolveNgContent()` method and add support for this functionally:

```javascript
  resolveNgContent<T>(content: Content<T>) {
    if (typeof content === 'string') {
      const element = this.document.createTextNode(content);
      return [[element]];
    }

    if (content instanceof TemplateRef) {
      const viewRef = content.createEmbeddedView(null);
      return [viewRef.rootNodes];
    }

    /** Otherwise it's a component */
    const factory = this.resolver.resolveComponentFactory(content);
    const componentRef = factory.create(this.injector);
    return [[componentRef.location.nativeElement]];
  }

```

The same process follows: get the factory, create the component and pass the reference to the native DOM element.

*Pay attention that every dynamic component must be declared as `entryComponent`.*

```javascript
@NgModule({
  entryComponents: [ModalComponent, LoginModalComponent]
})
class AppComponent {}
```

You may have wondered why the `projectableNodes` parameter is a two-dimensional array. The reason is that we can pass more than one `ng-content`. For example:

```javascript
@Component({
  selector: 'app-modal',
  template: `
   <div class="modal-container">
    <div class="modal-body">
      <ng-content></ng-content>
      <footer class="modal-footer">
        <ng-content></ng-content>
      </footer>
    </div>
   </div>
  `
})
export class ModalComponent {}
```

```javascript
 const projectableNodes = [
   [this.document.createTextNode('First ng-content')],
   [this.document.createTextNode('Second ng-content')]
]
```

## Complete Code Example

You can view the [complete code example here](https://stackblitz.com/edit/dynamic-ng-content-l9cfn6?file=src%2Fapp%2Flogin-modal%2Flogin-modal.component.ts)

I want to take this opportunity to mention that we recently came out with Akita, which offers simple and effective state management for Angular applications. Check it out [here](https://netbasal.com/introducing-akita-a-new-state-management-pattern-for-angular-applications-f2f0fab5a8).

## About the Author

Netanel is a Frontend Architect who works at Datorama, blogs at [https://netbasal.com](netbasal.com), open source maintainer, creator of [Akita](https://github.com/datorama/akita) and Spectator, Husband, Father and the Co-founder of HotJS.
