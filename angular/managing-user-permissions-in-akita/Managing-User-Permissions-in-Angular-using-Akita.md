# Managing User Permissions in Angular using Akita

Some applications require functionality for changing what’s visible to the user, based on their role.

For example, a user might be able to see a todo item, but only an admin can see its delete button.

In this article, we'll learn how to manage permissions with Akita. We'll see how we can control the template visibility by creating a structural directive to keep our code DRY, and prevent navigation by creating a guard.

We'll focus on the permissions part rather than diving into the authentication process, as we already have a dedicated [article](https://engineering.datorama.com/the-complete-guide-to-authentication-in-angular-with-akita-dc1b343f7e71) for this topic.

## Create the Store

Akita supports both basic and entity stores. In our case, we don't need to manage a collection of entities so we'll create the basic store which can hold any form of data.

```ts
export const enum Permissions {
  READ = "read",
  WRITE = "write"
}

export interface AuthState {
  permissions: Permissions[];
}

export function createInitialState(): AuthState {
  return {
    permissions: [Permissions.READ, Permissions.WRITE]
  };
}

@StoreConfig({ name: "auth" })
export class AuthStore extends Store<AuthState> {
  constructor() {
    super(createInitialState());
  }
}
```

We create a store by extending Akita's `Store` and initialize the user permissions. In a real-world situation, you'd get this data from the server. Let's move on to the query.

## Create the Query

A Query is a class offering functionality responsible for querying the store. Let's create a selector that indicates whether the currently logged-in user has the provided permissions.

```ts
export class AuthQuery extends Query<AuthState> {
  constructor(protected store: AuthStore) {
    super(store);
  }

  hasPermission(permissions: Permissions[] | Permissions): Observable<boolean> {
    const asArray = coerceArray(permissions);

    return this.select(state => state.permissions).pipe(
      map(userPermissions =>
        asArray.every(current => userPermissions.includes(current))
      )
    );
  }
}
```

The `select()` query method selects a slice from the state. In our case, we need the user `permissions` in order to check if we can render the view. Now we can create the `*hasPermission` directive.

## Create the \*hasPermission Directive

Structural directives are responsible for HTML layout. They shape or reshape the DOM's structure, typically by adding, removing, or manipulating elements, and that's exactly what we need.

The `hasPermission` structural directive will manage, in a DRY way, whether the user is authorized to see the provided template. Let's create it:

```ts
@Directive({
  selector: "[hasPermission]"
})
export class HasPermissionDirective {
  @Input("hasPermission")
  checkPermissions: Permissions | Permissions[];
  private subscription: Subscription;

  constructor(
    private vcr: ViewContainerRef,
    private tpl: TemplateRef<any>,
    private authQuery: AuthQuery
  ) {}

  ngOnInit() {
    this.authQuery
      .hasPermission(this.checkPermissions)
      .subscribe(hasPermission => {
        this.vcr.clear();
        if (hasPermission) {
          this.vcr.createEmbeddedView(this.tpl);
        }
      });
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }
}
```

A structural directive creates an embedded view from the Angular-generated `<ng-template>` and inserts that view in a view container adjacent to the directive's original host element.

We pass the provided `permissions` from the `input` to our `hasPermission()` query method and based on the return value determine whether we can render the template. Let's use the directive:

```html
<ul>
  <li>Todo
    <button *hasPermission="'write'">Delete</button>
    <button *hasPermission="['write', 'admin']">Delete</button>
  </li>
</ul>
```

Notice that the directive can support an array of permissions. Let's finish with an example of a guard, which will prevent navigation from unauthorized users.

## Create the Auth Guard

Applications often restrict access to a feature area based on who the user is. You could permit access only to authenticated users or to users with a specific role.

The `CanActivate` guard is the tool to manage these navigation rules.

```ts
export class AuthGuard {
  constructor(private router: Router, private authQuery: AuthQuery) {}

  canActivate(): Observable<boolean> {
    return this.authQuery.hasPermission(Permissions.WRITE).pipe(
      take(1),
      switchMap(hasPermission => {
        if (hasPermission) {
          return of(true);
        }
        this.router.navigateByUrl("");
        return of(false);
      })
    );
  }
}
```

In the above example we're checking whether the user has a `write` permission, in which case we permit the navigation; otherwise, we navigate to the home page.

Remember, using client-side validation exclusively is never acceptable. Always perform server-side validation as well.

## But Wait, There’s More!

Akita is a very robust tool which saves you the hassle of creating boilerplate code and offers powerful tools with a moderate learning curve, suitable for both experienced and inexperienced developers alike. For more on that, please see the [documentation](https://netbasal.gitbook.io/akita/).

## Summary

We learn how Akita can provide you with a quick and easy way to manage what your users can see. Conclusion - use Akita it will make your life easier.

## Complete Code Example

You can view the [complete runnable example here](https://stackblitz.com/edit/akita-permissions) and the [source code here](https://stackblitz.com/edit/akita-permissions)

## About the Author

Netanel is a Frontend Architect who works at Datorama, blogs at [https://netbasal.com](netbasal.com), open source maintainer, creator of [Akita](https://github.com/datorama/akita) and Spectator, Husband, Father and the Co-founder of HotJS.
