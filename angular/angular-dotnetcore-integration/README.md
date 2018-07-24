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

