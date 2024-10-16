using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server;
using HeroscapeBuilder.Server.Data;
using HeroscapeBuilder.Server.Integrations.SupabaseIntegration;
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

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => {
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "HeroscapeBuilder", Version = "v1" });
});

builder.Services.AddDistributedMemoryCache();

var connectionString = builder.Configuration.GetConnectionString("SupabaseDb");
if (!string.IsNullOrEmpty(connectionString))
{
    connectionString = connectionString.Replace("%SUPABASE_HOST%", Environment.GetEnvironmentVariable("SUPABASE_HOST"))
        .Replace("%SUPABASE_PORT%", Environment.GetEnvironmentVariable("SUPABASE_PORT"))
        .Replace("%SUPABASE_DB%", Environment.GetEnvironmentVariable("SUPABASE_DB"))
        .Replace("%SUPABASE_USER%", Environment.GetEnvironmentVariable("SUPABASE_USER"))
        .Replace("%SUPABASE_PASSWORD%", Environment.GetEnvironmentVariable("SUPABASE_PASSWORD"));
}
builder.Services.AddDbContext<SupabaseDbContext>((serviceProvider, options) => {
    options.UseNpgsql(connectionString);
    options.AddInterceptors(serviceProvider.GetRequiredService<SecondLevelCacheInterceptor>());
});

builder.Services.Configure<SupabaseConfig>(builder.Configuration.GetSection("Supabase"));
builder.Services.AddHttpClient<SupabaseStorage>();

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
