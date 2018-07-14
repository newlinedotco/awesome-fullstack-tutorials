# Getting started with Angular and ASP.NET Core step by step

Building distributed systems nowadays is challenging and impacted by a lot of tools and frameowrks you can build your front- and backend with. 

In this article I want to describe the first steps to get started with ASP.NET Core, the .NET CLI, Angular and the AngularCLI.

## Outline

What we will cover:

1. Creating an ASP.NET Core WebAPI with the .NET CLI
2. Adding a Controller
3. Implementing CRUD Operations
4. Adding Swagger to you API
5. Adding Versioning to your API
6. Scaffold the client side application with the AngularCLI
7. Structure your Angular App
8. Requesting data from the server via http
9. Display data in your HTML-Templates via Databinding
10. Sending data to the server
11. Show success/error messages

That should be it.

Lets get started!

## Creating an ASP.NET Core WebAPI with the .NET CLI

As a first step you can download the .NET CLI on [https://dot.net](https://dot.net).

Typing `dotnet --version` on you commandline shuld give you a version description like

```
C:\Users\Fabian>dotnet --version
2.1.300
```

If you see that the cli is up, running and ready to be used. 

After creating a folder we are working on we can create a folder for the server side and we simply call it `server`. Entering it, starting the commandline there we can scaffold a new webapi from the templates which come with the .NET CLI.

The command `dotnet new webapi` in that folder will run a command to scaffold all the files and will automatically run `dotnet restore` for us. The `restore` command will download all the dependencies we need until here to get everything up and running.

To try out if everything works we can simply run `dotnet run` in the same folder which should start the API for us.

```
C:\Users\Fabian\Desktop\ngBook\server>dotnet run
<a few outputs...>
Now listening on: https://localhost:5001
Now listening on: http://localhost:5000
Application started. Press Ctrl+C to shut down.
```

So simply doing a `dotnet new webapi` and a `dotnet run` brings us a WebAPI up and running in this case including an http and https endpoint. 
