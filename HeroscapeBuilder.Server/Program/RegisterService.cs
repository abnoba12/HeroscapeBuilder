using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain;
using HeroscapeBuilder.Server.Integrations.Interfaces;
using HeroscapeBuilder.Server.Integrations.MinioStorage;
using HeroscapeBuilder.Server.Services;
using System.Reflection;

namespace HeroscapeBuilder.Server.Program
{
    public static class RegisterService
    {
        public static WebApplicationBuilder RegisterServices(this WebApplicationBuilder builder)
        {
            //IMapper
            var assembliesToScan = AppDomain.CurrentDomain.GetAssemblies()
            .Where(a => a.FullName != null && a.FullName.StartsWith("HeroscapeBuilder"))
            .ToArray();

            builder.Services.AddAutoMapper(assembliesToScan);

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
