# Getting started with Angular and ASP.NET Core step by step

Building distributed systems nowadays is challenging and impacted by a lot of tools and frameowrks you can build your front- and backend with.

In this article I want to describe the first steps to get started with ASP.NET Core, the .NET CLI, Angular and the AngularCLI.

## Outline

What we will cover:

1.  Creating an ASP.NET Core WebAPI with the .NET CLI
2.  Preparations and using the Dependency Injection
3.  Adding a Controller
4.  Implementing CRUD Operations
5.  Adding Swagger to you API
6.  Adding Versioning to your API
7.  Scaffold the client side application with the AngularCLI
8.  Structure your Angular App
9.  Requesting data from the server via http
10. Display data in your HTML-Templates via Databinding
11. Sending data to the server
12. Show success/error messages

That should be it.

Lets get started!

## Creating an ASP.NET Core WebAPI with the .NET CLI

As a first step you can download the .NET CLI on [https://dot.net](https://dot.net).

Typing `dotnet --version` on you commandline shuld give you a version description like

```
C:\Users\Fabian>dotnet --version
2.1.300
```

If you see that the CLI is up, running and ready to be used.

After creating a folder we are working on we can create a folder for the server side and we simply call it `server`. Entering it, starting the commandline there we can scaffold a new webapi from the given templates which come with the .NET CLI.

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

Let us examine what we have got so far:

The `Program.cs` file is the starting point for our application which starts the webserver "Kestrel" so server our application, our WebAPI in this case. It also configures our application with values you can give from the outside. So any configuration via an \*.json, \*.xml or even \*.ini file can be read here.

```
public class Program
{
    public static void Main(string[] args)
    {
        CreateWebHostBuilder(args).Build().Run();
    }

    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .UseStartup<Startup>();
}
```

The `Startup.cs` file is configuring our specific WebAPI with a given configuration we can inject over the build in dependency injection system which gets provided by ASP.NET Core. The method `Configure` and `ConfigureServices` are used to build up a pipeline every request has to pass before getting process by the controller (`Configure`) and to add all the services we need into the dependency injection system `ConfigureServices`.

```
public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseMvc();
    }
}
```

Our `Controllers` folder specifies the point where our WebAPI finally reacts to incomming requests like GET/POST/PUT/DELETE or others.

```
[Route("api/[controller]")]
[ApiController]
public class ValuesController : ControllerBase
{
    // GET api/values
    [HttpGet]
    public ActionResult<IEnumerable<string>> Get()
    {
        return new string[] { "value1", "value2" };
    }

    // GET api/values/5
    [HttpGet("{id}")]
    public ActionResult<string> Get(int id)
    {
        return "value";
    }

    // POST api/values
    [HttpPost]
    public void Post([FromBody] string value)
    {
    }

    // PUT api/values/5
    [HttpPut("{id}")]
    public void Put(int id, [FromBody] string value)
    {
    }

    // DELETE api/values/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
    }
}
```

We can define the endpoint route with an RouteAttribute passed to that class where the `[controller]` stands for the name of the class without the suffix `Controller`. Inheriting from `ControllerBase` takes away the ViewSupport which we would need building an MVC solution where Views get rendered on the server side. For a WebAPI we only have to give back data as JSON. We already added the JSON formatter implicitly by calling `services.AddMvc()` and `app.UseMvc()` in the Startup.cs file.

With attributes above every method we can describe the HTTP method which should get invoked, when a specific request is coming in.

The code example above is what we get scaffolded from the template. We will modify it during this article.

## Preparations and using the Dependency Injection

For gettings things ready we need to install [AutoMapper](https://nuget.org/packages/automapper/), to map from a data transfer object (DTO) to an entity. For the sake of simplicity we will create a DTO which has the same field as our normal entity and register the mapping in our Startup class `Configure` method.

```
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    // ...
    AutoMapper.Mapper.Initialize(mapper =>
    {
        mapper.CreateMap<Customer, CustomerDto>().ReverseMap();
    });

    app.UseMvc();
}
```

Next we have to add a repository which encapsulates the data access and makes reading and writing easier. The repository implements an interface which we can together with the implementation register in our services container to provide it via dependency injection (DI).

```
public interface ICustomerRepository
{
    Customer GetSingle(int id);
    void Add(Customer item);
    void Delete(int id);
    Customer Update(int id, Customer item);
    IQueryable<Customer> GetAll();
    int Count();
    bool Save();
}
```

Startup.cs

```
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<ICustomerRepository, CustomerRepository>();
    services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
}
```

> We are using `AddSingleton` here which we would normally _not_ do when going into production. Better use `AddScoped` whenever you can to prevent the server from holding any state if no request is being worked on. With `AddScoped` you get a new instance per request and its going to be cleaned up when the response was sent out. HTTP is a stateless protocol so we should avoid holding state in any kind of way.

## Adding a Controller

Let us add a new controller which is called `CustomersController` and implement the CRUD operations there.
We a re creating a new class called `CustomersController.cs` which inherits from `ControllerBase` and we are adding the neeeded attributes to it. Beside of that we create a Customers class which has the properties `Name`, `Position` and `Age`.

```
public class Customer
{
    public string Name { get; set; }
    public string Position { get; set; }
    public int Age { get; set; }
}
```
