using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Integrations.Interfaces;
using HeroscapeBuilder.Server.Integrations.MinioStorage;
using HeroscapeBuilder.Server.Integrations.StripePayments;
using HeroscapeBuilder.Server.Domain.Shop;
using System.Reflection;

namespace HeroscapeBuilder.Server.Program
{
    public static class RegisterService
    {
        public static WebApplicationBuilder RegisterServices(this WebApplicationBuilder builder)
        {
            //builder.Services
            // Automatically register all services in the HeroscapeBuilder.Server.Services namespace
            RegisterAllServices(builder.Services, "HeroscapeBuilder.Server.Services");

            //Domain
            // Automatically register all Domains in the HeroscapeBuilder.Server.Domain namespace
            RegisterAllServices(builder.Services, "HeroscapeBuilder.Server.Domain");

            //Integrations
            // Register the implementation of IFileStorage<byte[]>
            builder.Services.AddScoped<IFileStorage<byte[]>>(provider =>
            {
                var blobStorageConfig = builder.Configuration.GetSectionWithEnvVariables("HeroscapeBuilder", "BlobStorage");
                return new MinioStorage(blobStorageConfig["API"], blobStorageConfig["User"], blobStorageConfig["Password"]);
            });

            // Card shop: Stripe keys come from user-secrets locally and the HeroscapeBuilder environment config in production.
            builder.Services.AddSingleton(provider =>
            {
                var stripeConfig = builder.Configuration.GetSectionWithEnvVariables("HeroscapeBuilder", "Stripe");
                var shopConfig = builder.Configuration.GetSection("Shop");
                var countries = shopConfig.GetSection("ShippingCountries").Get<List<string>>();
                var settings = new ShopSettings
                {
                    // Trimmed: keys pasted into secrets/config often pick up a stray space or line break.
                    StripeSecretKey = stripeConfig["SecretKey"]?.Trim(),
                    StripeWebhookSecret = stripeConfig["WebhookSecret"]?.Trim(),
                    SiteUrl = (shopConfig["SiteUrl"] ?? "https://heroscapebuilder.com").TrimEnd('/'),
                    Currency = shopConfig["Currency"] ?? "usd",
                    ShippingCountries = countries is { Count: > 0 } ? countries : new List<string> { "US" },
                    AutomaticTax = shopConfig.GetValue<bool>("AutomaticTax"),
                };

                // Says where checkout stands without ever printing a key. Goes to the console and the ErrorLogs table.
                var mode = settings.StripeSecretKey?.StartsWith("sk_live_") == true ? "LIVE" : "test";
                var rawKey = builder.Configuration["Stripe:SecretKey"];
                var keySource = (builder.Configuration as IConfigurationRoot)?.Providers
                    .LastOrDefault(p => p.TryGet("Stripe:SecretKey", out _))?.ToString() ?? "none";
                var status = settings.StripeConfigured
                    ? $"Card shop: Stripe {mode} key loaded from {keySource}. Webhook secret {(settings.WebhookConfigured ? "loaded" : "not set")}. Checkout redirects to {settings.SiteUrl}."
                    : $"Card shop: NO Stripe secret key found. Stripe:SecretKey is {(string.IsNullOrEmpty(rawKey) ? "empty" : rawKey.StartsWith('%') ? "an unresolved placeholder" : "unrecognized")} (last set by {keySource}) in environment '{builder.Environment.EnvironmentName}'. Checkout is disabled.";
                Console.WriteLine(status);
                NLog.LogManager.GetLogger("HeroscapeBuilder.Shop").Info(status);
                return settings;
            });
            builder.Services.AddSingleton<StripeClientProvider>();

            //Repositories
            // Automatically register all Repositories in the HeroscapeBuilder.Server.Data.Repositories namespace
            RegisterAllServices(builder.Services, "HeroscapeBuilder.Server.Data.Repositories");

            //EF Cache
            builder.Services.AddEFSecondLevelCache(options =>
                options.UseMemoryCacheProvider()
               .CacheAllQueries(CacheExpirationMode.Absolute, TimeSpan.FromMinutes(240))
               .UseCacheKeyPrefix("EF_"));

            //tool to prepend the file path to any string
            FileHelper.Initialize(builder.Configuration);

            return builder;
        }

        private static void RegisterAllServices(IServiceCollection services, string targetNamespace)
        {
            var assembly = Assembly.Load("HeroscapeBuilder.Server");

            var types = assembly.GetTypes()
                .Where(t => t.Namespace == targetNamespace && t.IsClass && !t.IsAbstract);

            foreach (var type in types)
            {
                var interfaces = type.GetInterfaces();
                if (interfaces.Length > 0)
                {
                    foreach (var @interface in interfaces)
                    {
                        services.AddScoped(@interface, type);
                    }
                }
                else
                {
                    services.AddScoped(type);
                }
            }
        }

    }
}
