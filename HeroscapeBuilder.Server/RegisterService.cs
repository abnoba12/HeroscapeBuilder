using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain;
using HeroscapeBuilder.Server.Integrations.Interfaces;
using HeroscapeBuilder.Server.Integrations.MinioStorage;
using HeroscapeBuilder.Server.Services;

namespace HeroscapeBuilder.Server
{
    public static class RegisterService
    {
        public static IServiceCollection RegisterServices(this IServiceCollection services, IConfiguration configuration)
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
            // Register the implementation of IFileStorage<byte[]>
            services.AddScoped<IFileStorage<byte[]>>(provider =>
            {
                var blobStorageConfig = configuration.GetSectionWithEnvVariables("HeroscapeBuilder", "BlobStorage");
                return new MinioStorage(blobStorageConfig["API"], blobStorageConfig["User"], blobStorageConfig["Password"]);
            });

            //Repos
            services.AddScoped<ArmyCardRepository>();
            services.AddScoped<FileRepository>();

            //EF Cache
            services.AddEFSecondLevelCache(options =>
                options.UseMemoryCacheProvider()
               .CacheAllQueries(CacheExpirationMode.Absolute, TimeSpan.FromMinutes(240))
               .UseCacheKeyPrefix("EF_"));

            //tool to prepend the file path to any string
            FileHelper.Initialize(configuration);

            return services;
        }
    }
}
