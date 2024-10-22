using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server;
using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Data;
using HeroscapeBuilder.Server.Integrations.AzureStorage;
using HeroscapeBuilder.Server.Integrations.Interfaces;
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

// Call the extension method to register services for DI
builder.Services.RegisterServices();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => {
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "HeroscapeBuilder", Version = "v1" });
});

builder.Services.AddDistributedMemoryCache();

var connectionString = builder.Configuration.GetConnectionStringFromEnv("HerscapeBuilder", "AzureSqlDb");
builder.Services.AddDbContext<HsbDbContext>((serviceProvider, options) => {
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.CommandTimeout(180);  // Increase timeout to 180 seconds
        sqlOptions.EnableRetryOnFailure();  // Enable retries for transient errors
    });
    options.AddInterceptors(serviceProvider.GetRequiredService<SecondLevelCacheInterceptor>());
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

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
