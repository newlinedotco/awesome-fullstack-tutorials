# How to Integrate Angular with .NET Core Project
In this article, we are going to show you how to integrate a server-side .NET Core project with a client side Angular project. We are going to start with the server side first by creating a layer to fetch data from a database and creating an endpoint that will process the client side request and return the fetched data from the database.

After we are finished with the server side of the application, we are going to continue our work on the client part. We are going to create components to process and display the data fetched from the server with a simple interface. For that purpose, we are going to use a service to create a centralized place to handle our HTTP requests.

To create a server side of our project, we are going to use Visual Studio 2017 and for a client part the Visual Studio Code editor.

To download the complete source code check out [GitHub](https://github.com/MarinkoSpasojevic/awesome-fullstack-tutorials/tree/master/angular/angular-dotnetcore-integration/Code).

So, let's get to the action.

## Project Preparation
Let’s start by creating a new ASP.NET Core Web Application:

![Creating_Project](https://github.com/MarinkoSpasojevic/awesome-fullstack-tutorials/blob/master/angular/angular-dotnetcore-integration/Images/01-Creating_Project.png)

After we click on the OK button, we are going to choose the Web API project:

![WebAPI_Project](https://github.com/MarinkoSpasojevic/awesome-fullstack-tutorials/blob/master/angular/angular-dotnetcore-integration/Images/02-WebAPI_Project.png)

After several seconds, the project is prepared for us.

Now, let’s open the `launchSettings.json` file to modify the endpoint url address and to disable our browser to start as soon as the application starts:

![WebAPI_Project](https://github.com/MarinkoSpasojevic/awesome-fullstack-tutorials/blob/master/angular/angular-dotnetcore-integration/Images/03-LaunchSettings.png)

```
{
  "iisSettings": {
    "windowsAuthentication": false,
    "anonymousAuthentication": true,
    "iisExpress": {
      "applicationUrl": "http://localhost:5000/",
      "sslPort": 0
    }
  },
  "profiles": {
    "IIS Express": {
      "commandName": "IISExpress",
      "launchBrowser": false,
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
    "Server_Side_App": {
      "commandName": "Project",
      "launchBrowser": false,
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      },
      "applicationUrl": "http://localhost:5000/"
    }
  }
}
```

Because the server side and the client side projects will run on different domains we need to enable CORS on the server side project. To do that we need to open the `Startup.cs` class and to modify the `ConfigureServices` and `Configure` methods:

```
public void ConfigureServices(IServiceCollection services)
{
    services.AddCors(options =>
    {
        options.AddPolicy("CorsPolicy",
            builder => builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
    });

    services.AddMvc();
}
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.UseCors("CorsPolicy");

    app.UseMvc();
}
```

To learn more about CORS configuration and the project configuration overall, you can check out the [NET Core Project Configuration article](https://code-maze.com/net-core-web-development-part2/).

## Configuring Entity Framework Core
We are going to use EF Core library to enable access to a database from our server application. It was installed automatically during the application creation process.

So, let’s create a new folder Models and a new class Movie inside it:

```
[Table("Movie")]
public class Movie
{
    [Key]
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Genre { get; set; }
    public string Director { get; set; }
}
```
This class represents our Movie table inside a database.
Now, we need to create a context class `MovieContext.cs` in our project, which will be a middleware for a database communication:

```
public class MovieContext : DbContext
{
    public MovieContext(DbContextOptions options)
        : base(options)
    {
    }

    public DbSet<Movie> Movies { get; set; }
}
```

After that, we need to provide a database connection string inside the appsettings.json file:

```
{
  "Logging": {
    "IncludeScopes": false,
    "Debug": {
      "LogLevel": {
        "Default": "Warning"
      }
    },
    "Console": {
      "LogLevel": {
        "Default": "Warning"
      }
    }
  },
  "ConnectionStrings": {
    "sqlConString": "Server=.;Database=CodeMaze;Trusted_Connection=True;"
  }
}
```

Finally, we need to register our context class in the Startup.cs class:

```
public void ConfigureServices(IServiceCollection services)
{
    services.AddCors(options =>
    {
        options.AddPolicy("CorsPolicy",
            builder => builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
    });

    services.AddDbContext<MovieContext>(options =>
        options.UseSqlServer(Configuration.GetConnectionString("sqlConString")));

    services.AddMvc();
}
```

Excellent.
We have finished with the EF Core configuration in our application. We didn’t dive any deeper than we should into the configuration logic, but if you like to read about it in more detail you can check out this article [.NET Core 2.0, Angular and MySQL. Repository Pattern](https://code-maze.com/net-core-web-development-part4/)

## Creating Controller and the Get Action
Now let’s create our action that will represent an endpoint for the client request. In the `SolutionExplorer` we can find the Controllers folder and one class inside it. We are going to rename that class to `MoviesController` and to remove all the code except the first Get action:

![MovieController](https://github.com/MarinkoSpasojevic/awesome-fullstack-tutorials/blob/master/angular/angular-dotnetcore-integration/Images/04-MoviesController.png)

```
[Route("api/[controller]")]
public class MoviesController : Controller
{
    // GET api/values
    [HttpGet]
    public IEnumerable<string> Get()
    {
        return new string[] { "value1", "value2" };
    }
}
```

Let’s modify our MoviesController class to fetch the data from the database by using our previously created context class:

```
[Route("api/[controller]")]
public class MoviesController : Controller
{
    private readonly MovieContext _context;

    public MoviesController(MovieContext context)
    {
        _context = context;
    }

    // GET api/values
    [HttpGet]
    public IActionResult Get()
    {
        try
        {
            var movies = _context.Movies.ToList();

            return Ok(movies);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Something went wrong: {ex.Message}");
        }
    }
}
```

Awesome. 

With this code in place, we have finished with the server side. Of course, we didn’t haven’t gone too deep inside the action logic due to the sake of simplicity, but to read in more detail about all this stuff you can read [.NET Core 2.0, Angular and MySQL. Get Requests](https://code-maze.com/net-core-web-development-part5/).

Now we can test our Web API by sending a request from Postman or any other tool you like:
![Result Server Side](https://github.com/MarinkoSpasojevic/awesome-fullstack-tutorials/blob/master/angular/angular-dotnetcore-integration/Images/05-ResultServerSide.png)

Now we are ready to move on the Angular part.

## Creating an Angular Project
We are going to use Angular CLI to help us with the project creation and the creation of our components. To learn more about Angular CLI, you can read [Angular CLI Installation and Starting a New Project](https://code-maze.com/net-core-web-development-part7/#installationAngularCLI).

Let’s open the command prompt window, navigate to the location we want our application in and type the command:
```
ng new client-side-app
```
After some time, our project is ready. Let’s open it inside the Visual Studio Code editor and start working on it:

![Client side app](https://github.com/MarinkoSpasojevic/awesome-fullstack-tutorials/blob/master/angular/angular-dotnetcore-integration/Images/06-Client-Side-App.png)

## Modifying the App Component
Let’s modify the `app.component.html` file first:

```
<div class="container">
  <div class="content">
    <h1 class="headerText">Welcome to the movies presentation!!!</h1>
    <p>
      <span>Click this button to see the movie list:</span> 
      <button type="button" name="show" (click)="getMovies()">Show Movies</button>
    </p>
  </div>
</div>
```

Then, the `app.component.css` file as well:

```
.container{
    width: 100%;
}

.content{
    width: 70%;
    margin: 0 auto;
    border:1px solid gray;
    padding: 10px;
    box-shadow: 1px 1px 1px gray;
}

.headerText{
    color: #2795ca;
    text-align: center;
}

p{
    text-align: center;
}
span{
    font-size: 18px;
    margin-right: 15px;
}

button{
    background-color: #2795ca;
    color:white;
    height: 35px;
    border: 1px solid #2795ca;
    border-radius: 3px;
}
button:hover{
    cursor: pointer;
}
```

If we start our application by typing ng serve in the console window of Visual Studio Code, we will get this result:

![App component](https://github.com/MarinkoSpasojevic/awesome-fullstack-tutorials/blob/master/angular/angular-dotnetcore-integration/Images/07-App_Component_Page.png)

When we click on the Show Movies button we should be able to see all of our movie entities on the page. So, let’s start working on that feature.

## Using Services and HttpClientModule
To send a request to our endpoint, we are going to introduce the `HttpClientModule` in our app. So we need to import it inside the `app.module.ts` file and to place it in the `imports` array:

```
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

After the module modification, we are going to create a new folder `_interfaces` and to create one interface file `movie.model.ts` inside that folder:

```
export interface Movie{
    id: string,
    name: string,
    genre: string,
    director: string
}
```

Then, we are going to create a new service file http-service by using the Angular CLI command:

![Created service](https://github.com/MarinkoSpasojevic/awesome-fullstack-tutorials/blob/master/angular/angular-dotnetcore-integration/Images/08-Created-service.png)

That looks great. 

So, let’s modify that service file:

```
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpService: HttpClient) { }

  public getData = (route: string) =>{
    return this.httpService.get(route);
  }
}
```

We have the `getData` function, which we are going to call once we require a data from a certain endpoint from the server. You can read [here](https://code-maze.com/net-core-web-development-part9/) in more detail about services and HTTP calls.

The `getData` function will return an `Observable` as a response, so if we want to fetch that data from a response we need to subscribe on this function. So, let’s do exactly that.

## Fetching and Displaying Data from the Server
Let’s modify the app.component.ts file first:

```
import { Component } from '@angular/core';
import { HttpService } from './services/http.service';
import { Movie } from './_interfaces/movie.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public movies: Movie[];

  constructor(private httpService: HttpService){}

  public getMovies = () => {
    let route: string = 'http://localhost:5000/api/movies';
    this.httpService.getData(route)
    .subscribe((result) => {
      this.movies = result as Movie[];
    },
    (error) => {
      console.error(error);
    });
  }
 }
```

In order to display our data, we need to modify the app.component.html file by adding this code below the p tag:

```
<div *ngIf="movies" class="table-center">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Genre</th>
            <th>Director</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor='let movie of movies'>
            <td>{{movie?.name}}</td>
            <td>{{movie?.genre}}</td>
            <td>{{movie?.director}}</td>
          </tr>
        </tbody>
      </table>
</div>
```
