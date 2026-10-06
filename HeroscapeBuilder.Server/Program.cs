using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Program;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using NLog;
using NLog.Config;
using NLog.Web;

// Get the logger
var nLogConfig = HeroscapeBuilder.Server.Common.Helpers.ConfigurationExtensions.GetConfigWithPlaceholders(File.ReadAllText("nlog.config"), "HeroscapeBuilder");
LogManager.Configuration = XmlLoggingConfiguration.CreateFromXmlString(nLogConfig);
var logger = LogManager.GetCurrentClassLogger();
try
{
    var builder = WebApplication.CreateBuilder(args);

    if (DevelopmentDatabase.IsActive)
    {
        Console.WriteLine($"Development environment: using database '{DevelopmentDatabase.DatabaseName}'.");
    }

    // Use NLog for logging
    builder.Logging.ClearProviders();
    builder.Logging.SetMinimumLevel(Microsoft.Extensions.Logging.LogLevel.Trace);
    builder.Host.UseNLog();

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
    builder.Services.AddMemoryCache();

    // The unit catalog is ~2 MB of JSON; compressing it cuts first-load time sharply (and helps rankings).
    builder.Services.AddResponseCompression(options =>
    {
        options.EnableForHttps = true;
        options.Providers.Add<Microsoft.AspNetCore.ResponseCompression.GzipCompressionProvider>();
    });
    builder.Services.Configure<Microsoft.AspNetCore.ResponseCompression.GzipCompressionProviderOptions>(options =>
        options.Level = System.IO.Compression.CompressionLevel.Optimal);

    var connectionString = builder.Configuration.GetConnectionStringFromEnv("HeroscapeBuilder", "MsSqlDb");
    builder.Services.AddDbContext<HsbDbContext>((serviceProvider, options) =>
    {
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
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "HeroscapeBuilder", Version = "v1" });
    });

    var app = builder.Build();

    app.UseResponseCompression();

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

    app.MapSeoEndpoints();

    // Unknown URLs still get the SPA shell (so React can render its not-found page) but with a real 404 status,
    // otherwise search engines treat every made-up URL as a valid page.
    var spaRoots = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
    {
        "army-cards", "data", "units", "power-ranking", "species", "generals", "sets",
        "game-play", "user", "battlegroup", "my-heroscape"
    };
    app.Use(async (context, next) =>
    {
        var segments = context.Request.Path.Value?.Split('/', StringSplitOptions.RemoveEmptyEntries) ?? Array.Empty<string>();
        if (segments.Length > 0 && !spaRoots.Contains(segments[0]) && !segments[0].Contains('.'))
            context.Items["SpaNotFound"] = true;
        await next();
    });
    app.MapFallback(async context =>
    {
        if (context.Items.ContainsKey("SpaNotFound")) context.Response.StatusCode = StatusCodes.Status404NotFound;
        context.Response.ContentType = "text/html; charset=utf-8";
        await context.Response.SendFileAsync(app.Environment.WebRootFileProvider.GetFileInfo("index.html"));
    });

    app.Run();
}
catch (Exception ex)
{
    // NLog: Catch startup errors
    logger.Error(ex, "Stopped program due to an exception.");
    throw;
}
finally
{
    // Ensure to flush and stop internal timers/threads before application-exit (Avoid segmentation fault on Linux)
    LogManager.Shutdown();
}