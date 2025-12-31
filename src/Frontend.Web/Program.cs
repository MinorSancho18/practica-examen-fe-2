using Frontend.Application.Interfaces;
using Frontend.Infrastructure.Configuration;
using Frontend.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Configure API Settings
var apiSettings = builder.Configuration.GetSection("ApiSettings").Get<ApiSettings>();
if (apiSettings == null)
{
    throw new InvalidOperationException("ApiSettings configuration is missing");
}

// Configure HttpClient
builder.Services.AddHttpClient<IEstadoReservaService, EstadoReservaService>(client =>
{
    client.BaseAddress = new Uri(apiSettings.BaseUrl);
    client.Timeout = TimeSpan.FromSeconds(apiSettings.Timeout);
});

builder.Services.AddHttpClient<ITipoHabitacionService, TipoHabitacionService>(client =>
{
    client.BaseAddress = new Uri(apiSettings.BaseUrl);
    client.Timeout = TimeSpan.FromSeconds(apiSettings.Timeout);
});

builder.Services.AddHttpClient<IHabitacionService, HabitacionService>(client =>
{
    client.BaseAddress = new Uri(apiSettings.BaseUrl);
    client.Timeout = TimeSpan.FromSeconds(apiSettings.Timeout);
});

builder.Services.AddHttpClient<IHuespedService, HuespedService>(client =>
{
    client.BaseAddress = new Uri(apiSettings.BaseUrl);
    client.Timeout = TimeSpan.FromSeconds(apiSettings.Timeout);
});

builder.Services.AddHttpClient<IReservaService, ReservaService>(client =>
{
    client.BaseAddress = new Uri(apiSettings.BaseUrl);
    client.Timeout = TimeSpan.FromSeconds(apiSettings.Timeout);
});

builder.Services.AddHttpClient<IReservaHabitacionService, ReservaHabitacionService>(client =>
{
    client.BaseAddress = new Uri(apiSettings.BaseUrl);
    client.Timeout = TimeSpan.FromSeconds(apiSettings.Timeout);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
