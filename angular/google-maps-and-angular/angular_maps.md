# Interactive Maps with Angular

In this article you will learn how to create interactive [Google Maps](https://developers.google.com/maps/documentation/) powered by [Angular](https://angular.io). 

We will see how to:

* instantiate the map
* perform geocoding by address and location
* work with markers and geocode by the marker's position
* work with circles and programmaticaly adjust their radiuses.

The source code for this article can be found at [GitHub](https://github.com/bodrovis/GoogleMapsAngular).

![Google Map](http://blog.ng-book.com/wp-content/uploads/2018/07/1.png)

<div class="notice excerpt">
  If you'd like to become an Angular expert in a few hours, then checkout <a href="https://ng-book.com/2"><em>ng-book: The Complete Guide to Angular</em></a>. Find out why hundreds of other developers love ng-book.
</div>

## Preparing the App

First things first: let's create a new Angular application by running:

```
ng new InteractiveMap
```

> I am assuming that you are using Angular 6, but most of the described concepts should apply to earlier versions as well.

Next, let's add some libraries:

```
npm install @agm/core @ng-bootstrap/ng-bootstrap --save
```

* [ng-bootstrap](https://ng-bootstrap.github.io/#/home) allows us to employ Bootstrap
* [agm](https://github.com/SebastianM/angular-google-maps) is the main star today — it provides all the necessary component to work with the Google Maps API

Of course, we require a separate component before starting to implement the map functionality, so generate it now:

```
ng generate component Map
```

After that make sure that everything is imported properly in the *app.module.ts* file:

```javascript
// app.module.ts

// other imports...
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { MapComponent } from './map/map.component';
```

Note that I've also imported the `FormsModule` because we'll rely heavily on it.

Next, perform some tweaks to the `@NgModule` in the same file:

```javascript
// app.module.ts

// your imports...

@NgModule({
  declarations: [
    AppComponent,
    MapComponent, // <--- this should be added automatically
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({apiKey: ''}), // <---
    FormsModule, // <---
    NgbModule.forRoot() // <---
  ],
  providers: [
    GoogleMapsAPIWrapper // <---
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Obtaining a Google API Key

Before proceeding, you will require a special Google API key that can be obtained at the [Google API Dashboard](https://console.developers.google.com). Perform the following steps:

* Log in or register if you don't have a Google account yet
* At the top-left corner select an already existing project or press "New Project"
* When creating a new project, give it some name
* Press "Enable APIs and Services" button
* Search for the "Maps" and select the item that says "Maps for your website"
* Then press "Manage" and switch to the "Credentials" section
* Here you should find an API key. Note that by default this key is unrestricted, so you may want to manage it and choose what websites can utilize it

After you are done, paste the obtained key to the *app.module.ts* on this line:

```javascript
AgmCoreModule.forRoot({apiKey: 'YOUR_KEY_HERE'})
```

## Geocoding

### Working With Component

So far so good. What I would like to do next is add an ability for the users to [search for addresses](https://developers.google.com/maps/documentation/geocoding/start) and reflect them on the map. When the address is found, it should be pinpointed with a marker. Also, when the marker is moved to some location, the address of this location should be displayed.

Start by importing all the necessary modules inside the *map.component.ts* file, then define two interfaces and a variable:

```javascript
// map/map.component.ts

import { Component, Input, ViewChild, NgZone, OnInit } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';

declare var google: any;

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

interface Location {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  address_level_1?:string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  marker?: Marker;
}
```

These interfaces will allow us to easily work with the location and the  marker.

Now let's define some default values for the location, and also create a view object for the `AmgMap`:

```javascript
// map/map.component.ts

// ...imports and interfaces
export class MapComponent implements OnInit {
  geocoder:any;
  public location:Location = {
    lat: 51.678418,
    lng: 7.809007,
    marker: {
      lat: 51.678418,
      lng: 7.809007,
      draggable: true
    },
    zoom: 5
  };

  @ViewChild(AgmMap) map: AgmMap;
}
```

Then the constructor. We should wait for the `mapsApiLoader` to load and only after that assign `geocoder` with a new `Geocoder` object:

```javascript
// map/map.component.ts

// ...imports and interfaces
export class MapComponent implements OnInit {
	// ...defaults

  constructor(public mapsApiLoader: MapsAPILoader,
              private zone: NgZone,
              private wrapper: GoogleMapsAPIWrapper) {
    this.mapsApiLoader = mapsApiLoader;
    this.zone = zone;
    this.wrapper = wrapper;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }
}
```

Also, when the component is initialized let's make our marker draggable:

```javascript
// map/map.component.ts

// ...imports and interfaces
export class MapComponent implements OnInit {
	// ...defaults and constructor

  ngOnInit() {
      this.location.marker.draggable = true;
  }
}
```

Great! Let's stop here for a moment and proceed to the view in order to take care of some initial user interface.

### Displaying the Map and the Form

The map itself and the marker can be displayed with special tags in the following way:

```html
<!-- map/map.component.html -->

<agm-map [(latitude)]="location.lat" [(longitude)]="location.lng" [(zoom)]="location.zoom" [disableDefaultUI]="true" [zoomControl]="true" [(fitBounds)]='location.viewport'>
  <agm-marker [(latitude)]="location.marker.lat" [(longitude)]="location.marker.lng" [markerDraggable]="location.marker.draggable" (dragEnd)='markerDragEnd($event)'></agm-marker>
</agm-map>
```

The map has the following main attributes: latitude, longtitude, and zoom. We have already defined their defaults in the *map.component.ts* in the previous section.

Our marker also has latitude and longtitude with the default values, as well as the `markerDraggable` attribute (which we set to `true` as you remember). On top of that, marker has a special `dragEnd` event that we'll flesh out in the next section.

Now let's create the form. It is going to contain a handful of fields to enter the following information about the location to search for:

* Address line 1 and 2
* State, province or region
* Country
* ZIP code

Here is the corresponding markup:

```html
<!-- map/map.component.html -->

<div class="container-fluid">
  <div class='row'>
    <div class="form-group">
      <label class='col-sm-2'>Address Line 1</label>
      <input class='col-sm-10' type='text' [(ngModel)]='location.address_level_1' class="form-control" placeholder='Office, Apt, Home, Street'>
    </div>
    <div class="form-group">
      <label class='col-sm-2'>Address Line 2</label>
      <input class='col-sm-10'  [(ngModel)]='location.address_level_2' class='form-control' placeholder='City'/>
    </div>

    <div class="form-group">
      <label class='col-sm-2'>State / Province / Region</label>
      <input class='col-sm-10'  [(ngModel)]='location.address_state' class='form-control' placeholder='State'>
    </div>

    <div class="form-group">
      <label class='col-sm-2'>Country</label>
      <input class='col-sm-10'  [(ngModel)]='location.address_country' class='form-control' placeholder='State'>
    </div>

    <div class="form-group">
      <label class='col-sm-2'>Postal / Zip code</label>
      <input class='col-sm-10'  [(ngModel)]='location.address_zip' class='form-control' placeholder='Zip'>
    </div>

    <button (click)='updateOnMap()' type="submit" class="btn btn-primary">Search</button>
  </div>
</div>
```

Nothing special here. Each field corresponds to one of the `location` attributes. When the "Search" button is clicked, the `updateOnMap()` method is called.

Also let's define a very simple style for our map so that it has a static height:

```css
// map/map.component.css

.sebm-google-map-container {
   height: 300px;
 }
```

Before we return to the component and code the necessary methods, don't forget to render the map in the *app.component.html*:

```html
<!-- app.component.html -->

<app-map></app-map>
```

### Finding Location by Address

So, the method to perform the actual geocoding is called `updateOnMap()` and it should be called when the "Search" button is clicked. Unfortunately, things start to become a bit messy here because our geocoder object requires a full address to be provided, therefore we must properly construct it:

```javascript
// map/map.component.ts

// ...
export class MapComponent implements OnInit {
	// ...
  updateOnMap() {
    let full_address:string = this.location.address_level_1 || ""
    if (this.location.address_level_2) full_address = full_address + " " + this.location.address_level_2
    if (this.location.address_state) full_address = full_address + " " + this.location.address_state
    if (this.location.address_country) full_address = full_address + " " + this.location.address_country

    this.findLocation(full_address);
  }
}
```

Next code the `findLocation()` method:

```javascript
// map/map.component.ts

// ...
export class MapComponent implements OnInit {
	// ...
  findLocation(address) {
    if (!this.geocoder) this.geocoder = new google.maps.Geocoder()
    this.geocoder.geocode({
      'address': address
    }, (results, status) => {
      console.log(results);
      if (status == google.maps.GeocoderStatus.OK) {
				// decompose the result
      } else {
        alert("Sorry, this search produced no results.");
      }
    })
  }
}
```

We are geocoding by a full address and then if the response is successfull, decompose the result. The result itself, however, [might contain different data](https://developers.google.com/maps/documentation/geocoding/start#geocoding-request-and-response-latitudelongitude-lookup), so we must do all the heavily lifting and process them properly. Here is the final version of the `findLocation()` method:

```javascript
// map/map.component.ts

// ...
export class MapComponent implements OnInit {
	// ...
  findLocation(address) {
    if (!this.geocoder) this.geocoder = new google.maps.Geocoder()
    this.geocoder.geocode({
      'address': address
    }, (results, status) => {
      console.log(results);
      if (status == google.maps.GeocoderStatus.OK) {
        for (var i = 0; i < results[0].address_components.length; i++) {
          let types = results[0].address_components[i].types

          if (types.indexOf('locality') != -1) {
            this.location.address_level_2 = results[0].address_components[i].long_name
          }
          if (types.indexOf('country') != -1) {
            this.location.address_country = results[0].address_components[i].long_name
          }
          if (types.indexOf('postal_code') != -1) {
            this.location.address_zip = results[0].address_components[i].long_name
          }
          if (types.indexOf('administrative_area_level_1') != -1) {
            this.location.address_state = results[0].address_components[i].long_name
          }
        }

        if (results[0].geometry.location) {
          this.location.lat = results[0].geometry.location.lat();
          this.location.lng = results[0].geometry.location.lng();
          this.location.marker.lat = results[0].geometry.location.lat();
          this.location.marker.lng = results[0].geometry.location.lng();
          this.location.marker.draggable = true;
          this.location.viewport = results[0].geometry.viewport;
        }
        
        this.map.triggerResize()
      } else {
        alert("Sorry, this search produced no results.");
      }
    })
  }
}
```

We are checking for various parts of the address and store them accordingly. Then also trying to update the `location` and the marker position. Last but not the least is the `this.map.triggerResize()` line of code that resizes the map as needed. Phew!

### Finding Location by Marker

The next step is to process the `markerDragEnd` event and search for the selected location. The method itself is quite simple:

```javascript
// map/map.component.ts

// ...
export class MapComponent implements OnInit {
	// ...
  markerDragEnd(m: any, $event: any) {
   this.location.marker.lat = m.coords.lat;
   this.location.marker.lng = m.coords.lng;
   this.findAddressByCoordinates();
  }
}
```

We are reading the coordinates of the marker and then call the `findAddressByCoordinates()`. This method should geocode by latitude and longtitude, and then decompose the result:

```javascript
// map/map.component.ts

// ...
export class MapComponent implements OnInit {
	// ...
  findAddressByCoordinates() {
    this.geocoder.geocode({
      'location': {
        lat: this.location.marker.lat,
        lng: this.location.marker.lng
      }
    }, (results, status) => {
      this.decomposeAddressComponents(results);
    })
  }
}
```

Result decomposition resembles the one that we have performed in the previous section:

```javascript
// map/map.component.ts

// ...
export class MapComponent implements OnInit {
	// ...
	decomposeAddressComponents(addressArray) {
    if (addressArray.length == 0) return false;
    let address = addressArray[0].address_components;

    for(let element of address) {
      if (element.length == 0 && !element['types']) continue

      if (element['types'].indexOf('street_number') > -1) {
        this.location.address_level_1 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('route') > -1) {
        this.location.address_level_1 += ', ' + element['long_name'];
        continue;
      }
      if (element['types'].indexOf('locality') > -1) {
        this.location.address_level_2 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('administrative_area_level_1') > -1) {
        this.location.address_state = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('country') > -1) {
        this.location.address_country = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('postal_code') > -1) {
        this.location.address_zip = element['long_name'];
        continue;
      }
    }
  }
}
```

The address may consist of various elements, namely "street_number", "route",  "locality", "administrative_area_level_1", "country", and "postal_code". We are picking all of these values and assign them to the corresponding attributes of our `location`.

This is it! You may now boot the application by running

```
ng serve
```

Try to enter various addresses and make sure they are displayed properly. Also, try to move the marker over the map and check that the address is updated.

## Drawing a Circle on the Map

![Shape on Map](http://blog.ng-book.com/wp-content/uploads/2018/07/2.png)

Before wrapping up, let's also see how we can draw a circle with a given radius on the map. To do that, we'll need to update the view in the following way:

```html
<!-- map/map.component.html -->

<agm-map [(latitude)]="location.lat" [(longitude)]="location.lng" [(zoom)]="location.zoom" [disableDefaultUI]="true" [zoomControl]="true" [(fitBounds)]='location.viewport'>
  <agm-marker [(latitude)]="location.marker.lat" [(longitude)]="location.marker.lng" [markerDraggable]="location.marker.draggable" (dragEnd)='markerDragEnd($event)'></agm-marker>

	<!-- ADD THIS: -->
  <agm-circle [latitude]="location.lat" [longitude]="location.lng"
  [(radius)]="circleRadius"
  [fillColor]="'blue'"
  [circleDraggable]="true"
  [editable]="true"></agm-circle>
</agm-map>
```

This is going to be a blue draggable circle with a predefined radius and location (which equals to the `location`'s latitude and longtitude). We don't have a value for the `radius` yet, so define it now:

```javascript
// map/map.component.ts

// ...
export class MapComponent implements OnInit {
  circleRadius:number = 5000;
	// ...your other code
}
``` 

Why don't we also allow this circle's radius to be customized via the form? This is quite easy to do:

```html
<!-- map/map.component.html -->

<!-- other form controls... -->

<div class="container-fluid">
  <div class='row'>
    <div class="form-group">
      <label class='col-sm-2'>Circle radius in miles</label>
        <input type='text' class='form-control' #miles  [value]='circleRadiusInMiles() | number:"0.0-2"'  (keyup)="milesToRadius(miles.value)"/>
    </div>
  </div>
</div>
```

The entered value is in miles, so we need to format it properly:

```javascript
// map/map.component.ts

// ...
export class MapComponent implements OnInit {
	// ...
  milesToRadius(value) {
     this.circleRadius = value / 0.00062137;
  }

  circleRadiusInMiles() {
    return this.circleRadius * 0.00062137;
  }
}
```

We are done! You may now adjust the circle's radius as needed with the help of the text field.

<div class="notice excerpt">
  If you'd like to become an Angular expert in a few hours, then checkout <a href="https://ng-book.com/2"><em>ng-book: The Complete Guide to Angular</em></a>. Find out why hundreds of other developers love ng-book.
</div>

## Conclusion

In this article we have seen how to create interactive Google Map powered by Angular's magic. You have learned how to geocode by address and coordinates, how to adjust the map's locations, and also how to work with the circles on the map. Of course, there is more to the Google Maps API so I recommend checking the [official docs](https://developers.google.com/maps/documentation/) to learn more.

That's it for today, folks! Thanks for staying with me and happy coding.

## About the Author

Ilya Bodrov is personal IT tutor, author, and lecturer at Moscow Aviations Institute. His primary programming languages are Ruby, Elixir, and JavaScript. He enjoys coding, teaching people and learning new things. In his free time he tweets, participates in OpenSource projects, and plays music. You can read more of his writings [on his website here]( http://bodrovis.tech)
