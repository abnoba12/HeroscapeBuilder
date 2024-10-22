using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain;
using HeroscapeBuilder.Server.Integrations.AzureStorage;
using HeroscapeBuilder.Server.Integrations.Interfaces;
using HeroscapeBuilder.Server.Services;

namespace HeroscapeBuilder.Server
{
    public static class RegisterService
    {
        public static IServiceCollection RegisterServices(this IServiceCollection services)
        {
            //IMapper
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            //Services
            services.AddScoped<UnitService>();
            services.AddScoped<FileService>();
            services.AddScoped<ImageOptimizationService>();
            services.AddScoped<PdfThumbnailService>();
            services.AddHttpClient<PdfThumbnailService>();

            //Domain
            services.AddScoped<ImageOptimizer>();

            //Integrations                    
            // Register AzureBlobStorage directly for DI to inject it as AzureBlobStorage
            services.AddScoped<AzureBlobStorage>(provider =>
            {
                var configuration = provider.GetRequiredService<IConfiguration>();
                string azureBlobConnectionString = configuration.GetConnectionStringFromEnv("HerscapeBuilder", "AzureBlobStorage");
                return new AzureBlobStorage(azureBlobConnectionString);
            });

            // Also register it as the implementation of IFileStorage<byte[]>
            services.AddScoped<IFileStorage<byte[]>>(provider =>
            {
                var configuration = provider.GetRequiredService<IConfiguration>();
                string azureBlobConnectionString = configuration.GetConnectionStringFromEnv("HerscapeBuilder", "AzureBlobStorage");
                return new AzureBlobStorage(azureBlobConnectionString);
            });

            //Repos
            services.AddScoped<ArmyCardRepository>();
            services.AddScoped<FileRepository>();

            //EF Cache
            services.AddEFSecondLevelCache(options =>
                options.UseMemoryCacheProvider()
               .CacheAllQueries(CacheExpirationMode.Absolute, TimeSpan.FromMinutes(240))
               .UseCacheKeyPrefix("EF_"));

            return services;
        }
    }
}
