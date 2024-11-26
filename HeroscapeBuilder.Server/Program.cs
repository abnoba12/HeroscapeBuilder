using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Program;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173")
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials();
        });
});

builder.Services.AddDistributedMemoryCache();

var connectionString = builder.Configuration.GetConnectionStringFromEnv("HeroscapeBuilder", "MsSqlDb");
builder.Services.AddDbContext<HsbDbContext>((serviceProvider, options) => {
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.CommandTimeout(180);  // Increase timeout to 180 seconds
        sqlOptions.EnableRetryOnFailure();  // Enable retries for transient errors
    });
    options.AddInterceptors(serviceProvider.GetRequiredService<SecondLevelCacheInterceptor>());
});

//Add JWT auth to the site
builder.InitializeJwtAuthentication<HsbDbContext>();

// Call the extension method to register services for DI
builder.RegisterServices();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => {
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "HeroscapeBuilder", Version = "v1" });
});

var app = builder.Build();

app.UseCors("AllowSpecificOrigins");

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
