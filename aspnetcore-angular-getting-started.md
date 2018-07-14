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

As a class to deal with we create a Customers class which has the properties `Name`, `Position` and `Age`.

```
public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Position { get; set; }
    public int Age { get; set; }
}
```

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
public class CustomerRepository : ICustomerRepository
{
    private readonly ConcurrentDictionary<int, Customer> _storage = new ConcurrentDictionary<int, Customer>();

    public Customer GetSingle(int id)
    {
        Customer item;
        return _storage.TryGetValue(id, out item) ? item : null;
    }

    public void Add(Customer item)
    {
        item.Id = !_storage.Values.Any() ? 1 : _storage.Values.Max(x => x.Id) + 1;

        if (!_storage.TryAdd(item.Id, item))
        {
            throw new Exception("Item could not be added");
        }
    }

    public void Delete(int id)
    {
        Customer item;
        if (!_storage.TryRemove(id, out item))
        {
            throw new Exception("Item could not be removed");
        }
    }

    public Customer Update(int id, Customer item)
    {
        _storage.TryUpdate(id, item, GetSingle(id));
        return item;
    }

    public IQueryable<Customer> GetAll()
    {
        IQueryable<Customer> _allItems = _storage.Values.AsQueryable();
        return _allItems;
    }

    public int Count()
    {
        return _storage.Count;
    }

    public bool Save()
    {
        // To keep interface consistent with Controllers, Tests & EF Interfaces
        return true;
    }
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
We are creating a new class called `CustomersController.cs` which inherits from `ControllerBase` and we are adding the needed attributes to it. As we provided the repository in the DI container, we can simply inject it into the constructor.

```
[Route("api/[controller]")]
[ApiController]
public class CustomersController : ControllerBase
{
    private readonly ICustomerRepository _repository;

    public CustomersController(ICustomerRepository repository)
    {
        _repository = repository;
    }
}
```

## Implementing CRUD Operations

When receiving a GET call we need to send back all customers `api/customers/` or a single customer `api/customers/{id}` e.g. GET `api/customers/5` we can simply do that by defining two methods. One which listens to a get event sending back all the data from the repository and the other one receiving an id, asking for a specific person, returning a NOT FOUND 404 statuscode if not found and in case of a success it returns the found customer with a 200 statuscode

> Always rememeber to send back the correct statuscodes. Frameworks on client side like angular rely on that code to decide wether the request was a success or not!

```
[HttpGet(Name = nameof(GetAll))]
public ActionResult GetAll()
{
    List<Customer> customers = _repository.GetAll().ToList();
    return Ok(customers);
}

[HttpGet]
[Route("{id:int}", Name = nameof(GetSingle))]
public ActionResult GetSingle(int id)
{
    Customer customer = _repository.GetSingle(id);

    if (customer == null)
    {
        return NotFound();
    }

    return Ok(customer);
}
```

We are defining a name to every method to be clean here and are using helper methods like `Ok(...)` or `NotFound()` to see which statuscode is being returned from that method easier. `Ok(...)` results in a 200 - OK statuscode automatically and `NotFound()` is a 404 - Not Found statuscode behind the scenes. This is going to be returned from the function and send to the client as a result then.

We can pass parameters if we define them in the route attribute of the method. The routes on the methods are being concatinated with the route attribute we define on the class. Now we can request data from that API for all customers or for one single customer.

Next, before we can add a customer, we have to define a model the body of the request can get parsed into. We can sepcify the properties on that model which we want the client to allow to be entered. Things like `Id` should not be possible for the client to give. To be secure in that case we just add the properties we allow. In addition to that we are allowed to use [DataAnnotations](<https://msdn.microsoft.com/en-us/library/system.componentmodel.dataannotations(v=vs.110).aspx>) here. They will be automatically validated and return a `BadRequest()` (Statuscode 400) if they are not fulfilled.

```
public class CustomerCreateDto
{
    [Required]
    public string Name { get; set; }
    public string Position { get; set; }
    public int Age { get; set; }
}
```

As we have a new model now which should be mapped we also have to register a mapping for that.

```
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    // ...
    AutoMapper.Mapper.Initialize(mapper =>
    {
        mapper.CreateMap<Customer, CustomerDto>().ReverseMap();
        mapper.CreateMap<Customer, CustomerCreateDto>().ReverseMap();
    });

    app.UseMvc();
}
```

```
[HttpPost(Name = nameof(AddCustomer))]
public ActionResult<CustomerDto> AddCustomer([FromBody] CustomerCreateDto createDto)
{
    if (createDto == null)
    {
        return BadRequest();
    }

    Customer toAdd = Mapper.Map<Customer>(createDto);

    _repository.Add(toAdd);

    if (!_repository.Save())
    {
        throw new Exception("Creating a Customer failed on save.");
    }

    Customer newCustomer = _repository.GetSingle(toAdd.Id);

    return CreatedAtRoute(nameof(GetSingle), new { id = newCustomer.Id }, Mapper.Map<CustomerDto>(newCustomer));
}
```

As you can see we are parsing the body from the request into the `CustomerCreateDto` and working with that in our method. As a result we are returning a `201 - Created` statuscode. The `CreatedAtRoute` helper method again helps us to wrap the statuscode 201 in the reponse and in the body of the response we are returning the new customer we just created. But this method also allows us to add the link to the just created resource to the header of the response which has the advantage, that the client can decide wether he wants to follow the link or work further with the body of the repsonse which is the customer with an id. So the client has the full responsibility there which makes it the most flexible way.

> To avoid magic strings you can see that we are using `nameof(...)` with the name of the method the resource can be reached with antoher request then. To do this, the method needs a `Name` attribute. That is why we add it to every method: To enable this feature and to be consistent and clean here.

To update a customer we need again a seperate model which defines all the properties we want the client to allow to change. Again, for the sake of simplicity this is the same model as before, so we will not mention it here again. (Dont forget the mapping in the AutoMapper) The method itself reacts to a PUT call so its decorated with the `HttpPut` attribute. In addition to that it takes an id as parameter, as the call will go to PUT `/api/customers/{id}` which could be PUT `/api/customers/5`, meaining we want to update the customer with the id `5` with the values provided in the body of the request.

```
[HttpPut]
[Route("{id:int}", Name = nameof(UpdateCustomer))]
public ActionResult<CustomerDto> UpdateCustomer(int id, [FromBody] CustomerUpdateDto updateDto)
{
    if (updateDto == null)
    {
        return BadRequest();
    }

    var existingCustomer = _repository.GetSingle(id);

    if (existingCustomer == null)
    {
        return NotFound();
    }

    Mapper.Map(updateDto, existingCustomer);

    _repository.Update(id, existingCustomer);

    if (!_repository.Save())
    {
        throw new Exception("Updating a Customer failed on save.");
    }

    return Ok(Mapper.Map<CustomerDto>(existingCustomer));
}
```

We are checking again if the customer exists. If not we return a `404 - Not Found`. Otherwise we map and send back a 200 OK statuscode with the updated model in the body. We can simply pass it as a parameter to the `Ok()` method again.

To delete a customer we only take the id as a parameter because the call would be to `/api/customers/{id}` with the DELETE verb.

```
[HttpDelete]
[Route("{id:int}", Name = nameof(RemoveCustomer))]
public ActionResult RemoveCustomer(int id)
{
    Customer Customer = _repository.GetSingle(id);

    if (Customer == null)
    {
        return NotFound();
    }

    _repository.Delete(id);

    if (!_repository.Save())
    {
        throw new Exception("Deleting a Customer failed on save.");
    }

    return NoContent();
}
```

Again we are checking if the customer exists. If not a `NotFound()` is returned. If the resurce exists we delete it and in case of success we deliver a 204 No Content statuscode with the helper method `NoContent()` as it is a 200 statuscode which indicates a successful operation and to be more precise we tell the client that on this link `/api/customers/5` is not content anymore. So `NoContent()` is one of the most precise answer to return.

Creating an ASP.NET Core WebAPI with the .NET CLI
Preparations and using the Dependency Injection

## Adding Swagger to you API

If you want to share your API with a team which should get information about what can be done with your api and which resources to get how you can easily create a documentation of your API using a tool called 'Swagger'. Just install the [Nuget Package](https://www.nuget.org/packages/swashbuckle.aspnetcore/) and modify the following classes as the following.

Startup.cs

```
public void ConfigureServices(IServiceCollection services)
{
    services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new Info { Title = "My First API", Version = "v1" });
    });
}
```

```
public void Configure(IApplicationBuilder app)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My First API");
    });

    app.UseMvc();
}
```

So first we add the swagger generator into the services container. In the `Configure` method we now use the generated \*.json file and create a visual design out of it to display to consumers.

In the `launchSettings.json` we can modify now the `launchUrl` url from `api/values` to `swagger`. If youre working in Visual Studio and press the "Play" button now a browser should open up displaying the swagger page. Using the command `dotnet run` on the command line should start the api as well. Browsing to `https://localhost:5001/swagger/` should now display a complete documentation of your api.

![swagger](.github/swagger.png)

## Adding Versioning to your API

Your API will grow with the time and maybe you need to do another version of one or multiple controllers. You can add versioning very easy into your ASP.NET core application.

> Be aware that there are multiple ways of adding and using verioning in an API in general. We will take a look at the version in the route here So our routes will change. Other methods are to pass the version in a header or to pass it as a query parameter. Both methods are possible but have advantages and disadvantages. We will focus on the version in the route here as it can be seen in other big and common apis as well.

Before we actually code lets take a step back and see what versioning means for our api and for our routes:

1.  The route will change from `/api/customers` to `/api/v1/customers` or to be more general `/api/v{versionNumber}/{controller}`.
2.  Our Swagger page should be handling those different versions that the comsumer can get information about version 1 as well as version 2, 3, ...
3.  We need to pay attention to our `[customer]` wildcard as two controllers having the same name only have the version as a difference in one namespace do not work as the class would have the same name. So we need a solution for that.

So we can start by adding the nuget packages

-   [Microsoft.AspNetCore.Mvc.Versioning/](https://nuget.org/packages/Microsoft.AspNetCore.Mvc.Versioning/)
-   [Microsoft.AspNetCore.Mvc.Versioning.ApiExplorer](https://nuget.org/packages/microsoft.aspnetcore.mvc.versioning.apiexplorer/)

Having done that we can add two folders in our `Controller` folder describing our versions. In this case this is `v1` and `v2`. We can move our `CustomersController.cs` into the folder `v1` for now.

Now we have to specify the version into the route to catch all calls going to `/api/v1/customers`.

```
[Route("api/[controller]")]
[ApiController]
public class CustomersController : ControllerBase
{
    // ...
}
```

can be changed to

```
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class CustomersController : ControllerBase
{
    // ...
}
```

Like in the route attributes of the methds in the controller we can define the version as `{version:apiVersion}` here and give the version explicitly in the attribute above with `[ApiVersion("1.0")]`. We can keep the `[controller]` wildcard in the route because it will be replaced with the classname without the suffix `controller`.

The `v2` namespace can get a class _with the same name_ as it is in a different namespace and it just changes the version attribute.

```
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class CustomersController : ControllerBase
{
    [HttpGet]
    public ActionResult Get()
    {
        return Ok("2.0");
    }
}
```

We still need to tell our application to use versioning in our API and define swagger to display all the versions. In the Startup.cs add

```
public void ConfigureServices(IServiceCollection services)
{
    services.AddMvcCore().AddVersionedApiExplorer(o => o.GroupNameFormat = "'v'VVV");
    services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
    services.AddApiVersioning(config =>
    {
        config.ReportApiVersions = true;
        config.AssumeDefaultVersionWhenUnspecified = true;
        config.DefaultApiVersion = new ApiVersion(1, 0);
        config.ApiVersionReader = new HeaderApiVersionReader("api-version");
    });

    services.AddSwaggerGen(
    options =>
    {
        var provider = services.BuildServiceProvider()
                            .GetRequiredService<IApiVersionDescriptionProvider>();

        foreach (var description in provider.ApiVersionDescriptions)
        {
            options.SwaggerDoc(
                description.GroupName,
                new Info()
                {
                    Title = $"Sample API {description.ApiVersion}",
                    Version = description.ApiVersion.ToString()
                });
        }
    });
}

public void Configure(..., IApiVersionDescriptionProvider provider)
{
    // ...
    app.UseSwagger();
    app.UseSwaggerUI(
        options =>
        {
            foreach (var description in provider.ApiVersionDescriptions)
            {
                options.SwaggerEndpoint(
                    $"/swagger/{description.GroupName}/swagger.json",
                    description.GroupName.ToUpperInvariant());
            }
        });

    app.UseMvc();
}
```

If you now open up swagger like we did before you can see the both versions and can switch with a dropdown. So with this we can fire requests to `/api/v1/customers` and `/api/v2/customers` and maybe improve the results.

Although we can improve much much more on this API (Adding HATEOAS, Datashaping, Queryparameters, ...) we want to take a look now on the clientside and buidla corresponsing app with Angular and the Angular CLI.

## Scaffold the client side application with the AngularCLI

TBD

## Structure your Angular App

TBD

## Requesting data from the server via http

TBD

## Display data in your HTML-Templates via Databinding

TBD

## Sending data to the server

TBD

## Show success/error messages

TBD
