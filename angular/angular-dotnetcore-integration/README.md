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

