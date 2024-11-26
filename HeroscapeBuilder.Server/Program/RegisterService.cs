using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain;
using HeroscapeBuilder.Server.Integrations.Interfaces;
using HeroscapeBuilder.Server.Integrations.MinioStorage;
using HeroscapeBuilder.Server.Services;

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
            builder.Services.AddScoped<UnitService>();
            builder.Services.AddScoped<FileService>();
            builder.Services.AddScoped<ImageService>();
            builder.Services.AddScoped<PdfService>();
            builder.Services.AddHttpClient<PdfService>();

            //Domain
            builder.Services.AddScoped<ImageOptimizer>();

            //Integrations
            // Register the implementation of IFileStorage<byte[]>
            builder.Services.AddScoped<IFileStorage<byte[]>>(provider =>
            {
                var blobStorageConfig = builder.Configuration.GetSectionWithEnvVariables("HeroscapeBuilder", "BlobStorage");
                return new MinioStorage(blobStorageConfig["API"], blobStorageConfig["User"], blobStorageConfig["Password"]);
            });

            //Repos
            builder.Services.AddScoped<ArmyCardRepository>();
            builder.Services.AddScoped<FileRepository>();

            //EF Cache
            builder.Services.AddEFSecondLevelCache(options =>
                options.UseMemoryCacheProvider()
               .CacheAllQueries(CacheExpirationMode.Absolute, TimeSpan.FromMinutes(240))
               .UseCacheKeyPrefix("EF_"));

            //tool to prepend the file path to any string
            FileHelper.Initialize(builder.Configuration);

            return builder;
        }
    }
}
