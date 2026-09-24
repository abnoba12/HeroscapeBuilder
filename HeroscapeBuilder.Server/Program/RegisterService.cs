using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Integrations.Interfaces;
using HeroscapeBuilder.Server.Integrations.MinioStorage;
using HeroscapeBuilder.Server.Integrations.StripePayments;
using HeroscapeBuilder.Server.Domain.Shop;
using HeroscapeBuilder.Server.Services.Background;
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

            // Card shop. The Stripe keys are read ONLY from the HeroscapeBuilder environment config (the same JSON that
            // holds the database and JWT secrets), keys StripeSecretKey and StripeWebhookSecret. They are deliberately
            // not in appsettings (and the project no longer uses user-secrets), so nothing else can override them.
            builder.Services.AddSingleton(provider =>
            {
                var shopConfig = builder.Configuration.GetSection("Shop");
                var countries = shopConfig.GetSection("ShippingCountries").Get<List<string>>();
                var settings = new ShopSettings
                {
                    // Trimmed: keys pasted into config often pick up a stray space or line break.
                    StripeSecretKey = Common.Helpers.ConfigurationExtensions.GetConfigWithPlaceholders("%StripeSecretKey%", "HeroscapeBuilder")?.Trim(),
                    StripeWebhookSecret = Common.Helpers.ConfigurationExtensions.GetConfigWithPlaceholders("%StripeWebhookSecret%", "HeroscapeBuilder")?.Trim(),
                    SiteUrl = (shopConfig["SiteUrl"] ?? "https://heroscapebuilder.com").TrimEnd('/'),
                    Currency = shopConfig["Currency"] ?? "usd",
                    ShippingCountries = countries is { Count: > 0 } ? countries : new List<string> { "US" },
                    AutomaticTax = shopConfig.GetValue<bool>("AutomaticTax"),
                };

                // Says where checkout stands without ever printing a key. Goes to the console and the ErrorLogs table.
                var mode = settings.StripeSecretKey?.StartsWith("sk_live_") == true ? "LIVE" : "test";
                var status = settings.StripeConfigured
                    ? $"Card shop: Stripe {mode} key loaded from the HeroscapeBuilder environment config. Webhook secret {(settings.WebhookConfigured ? "loaded" : "not set (StripeWebhookSecret)")}. Checkout redirects to {settings.SiteUrl}."
                    : "Card shop: NO Stripe secret key found. Add \"StripeSecretKey\" to the HeroscapeBuilder environment config (then restart Visual Studio so it sees the change). Checkout is disabled.";
                Console.WriteLine(status);
                NLog.LogManager.GetLogger("HeroscapeBuilder.Shop").Info(status);
                return settings;
            });
            builder.Services.AddSingleton<StripeClientProvider>();

            // Shop emails (new order alerts to the owner).
            builder.Services.AddSingleton(provider =>
            {
                // Host/port are not secret and live in appsettings.json; the account and addresses come only from the
                // HeroscapeBuilder environment config, like the Stripe keys.
                var emailConfig = builder.Configuration.GetSection("Email");
                string? FromEnv(string key) => Common.Helpers.ConfigurationExtensions.GetConfigWithPlaceholders($"%{key}%", "HeroscapeBuilder")?.Trim();
                var settings = new EmailSettings
                {
                    Host = emailConfig["Host"]?.Trim(),
                    Port = int.TryParse(emailConfig["Port"], out var port) ? port : 587,
                    Username = FromEnv("EmailUsername"),
                    // App passwords are often shown with spaces between groups; SMTP needs them without.
                    Password = FromEnv("EmailPassword")?.Replace(" ", string.Empty),
                    From = FromEnv("EmailFrom"),
                    NotifyTo = FromEnv("ShopNotifyEmail"),
                };

                var status = settings.IsConfigured
                    ? $"Card shop: order emails go to {settings.NotifyTo} via {settings.Host}:{settings.Port}."
                    : "Card shop: email is NOT configured. Add EmailUsername, EmailPassword and ShopNotifyEmail to the HeroscapeBuilder environment config. New orders will not be emailed.";
                Console.WriteLine(status);
                NLog.LogManager.GetLogger("HeroscapeBuilder.Shop").Info(status);
                return settings;
            });

            // Checks Stripe every few minutes for payments the site missed and retries unsent order emails.
            builder.Services.AddHostedService<ShopReconciliationWorker>();

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
