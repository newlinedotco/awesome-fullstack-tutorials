# Service Workers & Angular

Last time I managed to migrate my small Angular application [from a custom Webpack build to Angular CLI](https://medium.com/bratislava-angular/from-custom-webpack-build-to-angular-cli-9d87c3da6925). Now my life as a developer of this application is much easier. After migrating and using (or sometimes abusing) the power of [Angular Schematics](https://blog.angular.io/schematics-an-introduction-dc1dfbc2a2b2) for generating *everything*, I was wondering what else does the [CLI](https://cli.angular.io/) offer to the developer. I found out that it should be quite easy to set up a service worker for my application using the CLI so I dug in and enabled it. And it *was actually easy*!

In this article I want to show you *how* and *why* you would use a service worker in an Angular application. We will create a simple application using the CLI and make a good use of a service worker for it.

## What are Service Workers

Well, to be honest, I am not that great at explaining things... But here we go. I'll do my best and explain *how I understand service workers*.

Basically, a service worker is a small JavaScript program (a worker) that runs in the background and intercepts HTTP requests. It is up to the worker implementation to decide what to do with these requests (and the worker gets access to *every* HTTP request, not just those made from the application scripts like `fetch`, but also for example the request for the initial `index.html` file). The worker can decide to modify the request data, make several requests to the server, use the [cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache), etc.

The service worker runs in the background and can continue running even when the user closes the application tab. Now why would you, my dear friend, want to use a service worker? Well, there are several reasons, but for the purpose of this article (and Angular, and PWAs), service workers allow you to manually handle the cache and use it even when the computer is not connected to the internet. Offline Angular applications? Sure why not.

### Inspecting Service Workers in Chrome

I wanted to show you how to inspect service workers because you will need it for the example project below. When you are on a page with a service worker, open the developer tools, select the `Application` tab, and choose `Service Workers` in the left navigation panel.

![service worker in Chrome](https://user-images.githubusercontent.com/4700122/41548656-e61a858a-7323-11e8-9281-e507c5845280.png)

Here you can see the service worker, you can access its source code, its console, you can simulate offline mode, and (most importantly) you can *unregister it* (on the right side). When you are done with the example project in this article, make sure to unregister the service worker for the application. Otherwise, it will keep serving the application even when you are not running the server.

## Service Workers in an Angular application

I have created a simple application for demonstrating the use of service worker. We will enable and configure the service worker for the application and use it to cache the resources. We will also use the service worker to detect when new updates are available for the application.

Start by cloning [the example project](https://github.com/chuckeles/angular-service-worker) and then move to the directory of the application. If you check the Git history of this repository, you can see that there are multiple commits and tags for each step. The `final` tag and the master branch point to the last commit where the complete application is implemented and the service worker is already configured and utilized. If you want to follow along, check out the first tag called `start` using `git checkout start`. Now install Node dependencies by calling `yarn install`.

### The Application

You can serve the application using the standard `ng serve`. It is a static application referencing the Angular logo on a different domain.

![app](https://user-images.githubusercontent.com/4700122/41499390-e297cf30-717f-11e8-997f-c2d149f7238d.png)

There's a button which triggers the app to fetch and show data from an external resource. In this case it just fetches some random numbers from [random.org](https://random.org).

![button](https://user-images.githubusercontent.com/4700122/41499406-20fac444-7180-11e8-8f25-bd933e690bd0.png)
![numbers](https://user-images.githubusercontent.com/4700122/41499407-22db27ae-7180-11e8-9a25-7d16ece41e0c.png)

### Enabling the Service Worker

We will start by enabling the Angular service worker for our application. This can be done easily using the power of the Angular CLI. You can just call `ng add @angular/pwa --project angular-service-worker` and it will do the work for you.

Or not. When I was working on this article and called this command in the console, the CLI added `@angular/pwa` as a dependency of the application but then crashed on `Cannot read property 'options' of undefined`.

![cli error](https://user-images.githubusercontent.com/4700122/41497703-e0f996d8-715a-11e8-896a-9c0db3f5fd91.png)

After I encountered this error, I called `ng g service-worker` and the CLI generated all code modifications for the service worker.

- It added `ngsw-config.json` file. This is the configuration file for the service worker and we will be taking a closer look at it soon.
- It enabled `serviceWorker` flag in `angular.json` file for production.
- It added the service worker module to our application module.

I reformatted these changes and commited them as the next step. You can try running the commands yourself or call `git checkout step1` to move to the next step.

### Service Worker Module

If you open the `app.module.ts` file, you can see that the CLI added the `ServiceWorkerModule` and enabled it for production only. The module also refers to a file called `ngsw-worker.js`. This file is built by the CLI in production mode. Angular uses the configuration file for this process. In development mode, however, this file is not served so you should not enable the service worker for the development mode.

### Service Worker Configuration

The service worker is configured using the `ngsw-config.json` file. Go ahead and open it now. You can see that there is the index HTMl file and 2 asset groups of our application. The first contains the application source files and the second the application assets.

```
{
    "index": "/index.html",
    "assetGroups": [
        {
            "name": "app",
            "installMode": "prefetch",
            "updateMode": "prefetch",
            "resources": {
                "files": ["/index.html", "/favicon.ico", "/*.css", "/*.js"]
            }
        },
        {
            "name": "assets",
            "installMode": "lazy",
            "updateMode": "lazy",
            "resources": {
                "files": ["/assets/**"]
            }
        }
    ]
}
```

As per [the documentation](https://angular.io/guide/service-worker-config#assetgroups), `assetGroups` are *resources that are part of the app version that update along with the app*. There are 2 modes that you can configure – `installMode` and `updateMode` – and they tell the service worker how to cache resources in the group. `installMode` determines how the resources are initially cached, that is, when the user first visits the application and the service worker is registered for the first time. `updateMode` works for resources already in the cache. You can use 2 options – `prefetch` and `lazy`. `prefetch` means that the service worker will go ahead and download all resources in the group as soon as possible and put them into the cache. This uses more data initially but ensures that resources are already in the cache, even when the application goes offline later. `lazy` means that the service worker will only download the resources when they are requested. You can read more in [the documentation for the service worker](https://angular.io/guide/service-worker-config).

In our case, the service worker is configured to `prefetch` the application files (so the user always has the newest version downloaded) and use the `lazy` strategy for application assets. However, our application is not using any assets. We will configure the service worker to cache the Angular logo but first, let's test the application.

### Testing the Service Worker

The service worker is enable only for the production mode of the application so we need to serve it in production mode to see the service worker in action. First, build the application using `ng build --prod`. The result will be placed into `dist/angular-service-worker` (you can also see the `ngsw-worker.js` file there). Then, we need to serve these files. I use [`serve`](https://www.npmjs.com/package/serve) for this, just install it with `yarn global add serve` and call `serve dist/angular-service-worker`. Finally, open the application in your browser (in my case Chrome).

If you open the devtools, you can see that the service worker is running. You can also check the cache storage to see the application files there.

![service worker](https://user-images.githubusercontent.com/4700122/41499605-ee5c167a-7182-11e8-8fe1-8ceff71ca686.png)

If you now kill the `serve` command and reload the page, *the application still loads*! We used the `prefetch` strategy so the service worker has already *placed the whole app into the cache* and can load it even when the server is offline. However, if you disconnect from the internet (I know, just for a few seconds) and then reload the application, you can see that the Angular logo is not cached and does not load. Additionally, the *fetch data button* does not work because the external service is unavailable.

![offline](https://user-images.githubusercontent.com/4700122/41499638-814fd200-7183-11e8-9c69-24b9c7a25e07.png)

### Caching External Resources

You are not limited to caching local files, you can also enter any URL address and the service worker will include that in the `assetGroup`. Go ahead and add the URL of the Angular logo into the *assets* asset group in the `ngsw-config.json` file.

```
{
    "name": "assets",
    "installMode": "lazy",
    "updateMode": "lazy",
    "resources": {
        "files": ["/assets/**"],
        "urls": ["https://angular.io/assets/images/logos/angular/angular.svg"]
    }
}
```

Now rebuild the application (`ng build --prod`) and serve it again. It almost works... Except that I made a mistake which I realized too late.

![cors](https://user-images.githubusercontent.com/4700122/41499725-806f3662-7185-11e8-86fe-6e0ea33b73b6.png)

I don't know why it didn't matter before but now the browser throws an error that the external resource does not have the correct CORS headers. As a quickfix for this particular **example project**, we'll use [this Chrome extension for setting CORS to any request](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en). Please don't use it for real projects, though. I configured the extension to only work for the URL of the Angular logo ([this one]( https://angular.io/assets/images/logos/angular/angular.svg)).

![cors extension](https://user-images.githubusercontent.com/4700122/41499762-6917a688-7186-11e8-8c99-66263dcf6d31.png)

Now the service worker works correctly and caches the Angular logo. It even works when your computer is offline! The only thing that remains is the data from the external service.

![logo caching works](https://user-images.githubusercontent.com/4700122/41499794-cee0565e-7186-11e8-935e-0cd75248b98a.png)

### Caching Data

Besides `assetGroups` there are also `dataGroups`. As per [the documentation](https://angular.io/guide/service-worker-config#datagroups), they *are not versioned along with the app. They're cached according to manually-configured policies that are more useful for situations such as API requests and other data dependencies.* We can use this to cache the responses from the external service in case the application is offline!

If you want to follow along, `git checkout step2`.

Open the service worker configuration file (you know which one it is by now, right?) and add the configuration for `dataGroups`:

```
"dataGroups": [
    {
        "name": "random.org",
        "urls": ["https://www.random.org/**"],
        "cacheConfig": {
            "maxSize": 3,
            "maxAge": "7d",
            "strategy": "freshness"
        }
    }
]
```

You can check the (well-written) documentation for the supported options but the most important one is called `strategy`. This tells the service worker how to cache the data, where `freshness` means that the service worker will always try to request newer data and only use the cached data if the request takes too long (or you are offline). There's also `performance` which means that the service worker will always prefer the cached data over making a request to the service. We always want fresh data and only use the cached data when the application is offline.

Now you can rebuild and application, serve it, load it in the browser, and reload the page to update the service worker. You can see that if you now press the button to fetch the data, the application gets new data every time and there are always different numbers. Now if you offline, load the application, and fetch the data, you will still see a list of numbers but they will always be the same – the ones that are stored in the cache.

### Notification for Updates

So now we cache our whole application using the power of the Angular service worker! As the *last step*, we want to show a notification to the user when there are updates available for the application. The service worker allows us to do exactly that. It detects when there's a newer version available from the network than is in the browser cache. This check happens when the application is loaded or refreshed/reloaded. The service worker then downloads the newer version to the cache and lets our application know that an update is available. We can use this information to show a notification to the user.

You know the drill, `git checkout step4`. This step already contains the updates notification component and I'll just highlight the important parts.

Go ahead and open the `updates-notification.component.ts` file. There are 2 important parts in this file.

```
constructor(private updates: SwUpdate) {
    this.updateAvailable$ = merge(
        of(false),
        this.updates.available.pipe(map(() => true)),
        this.closed$.pipe(map(() => false)),
    );
}
```

First, the component injects the `SwUpdate` service and subscribes to `SwUpdate.available`. This is an [Observable](http://reactivex.io/documentation/observable.html) which emits when the service worker detects and installs a new update to the cache. We construct our own Observable which starts with `false`, emits `true` when `SwUpdate` tells us that there are updates available, and finally emits `false` again when the user closes the notification. This Observable is used for displaying the notification. You can see how it is used in the component template.

The other important part is how we tell the service worker to activate the update.

```
activateUpdate() {
    if (environment.production) {
        this.updates.activateUpdate().then(() => {
            location.reload(true);
        });
    }
}
```

When the user clicks on the *Activate* button, the component calls `SwUpdate.activateUpdate()` function which activates the update. After that we need to reload the app because the currently loaded resources become invalid. We also need to make sure that this code only ever runs in production where the service worker is actually used (the `environment.production` check is for that). That's all! Feel free to further inspect the component if you want.

![notification](https://user-images.githubusercontent.com/4700122/41509515-72d21940-7255-11e8-9023-a9435eb42a89.png)

## Links to more content

- https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- https://angular.io/guide/service-worker-intro
- https://angular.io/guide/service-worker-devops

---

Thank you for reading this long article!
