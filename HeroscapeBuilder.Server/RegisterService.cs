﻿using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain;
using HeroscapeBuilder.Server.Integrations.SupabaseIntegration;
using HeroscapeBuilder.Server.Services;

namespace HeroscapeBuilder.Server
{
    public static class RegisterService
    {
        public static IServiceCollection RegisterServices(this IServiceCollection services)
        {
            //Services
            services.AddScoped<UnitService>();
            services.AddScoped<FileService>();
            services.AddScoped<ImageOptimizationService>();

            //Domain
            services.AddScoped<ImageOptimizer>();

            //Integrations
            services.AddScoped<SupabaseStorage>();
            services.AddScoped<SupabaseConfig>();

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
