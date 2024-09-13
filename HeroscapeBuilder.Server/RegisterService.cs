using HeroscapeBuilder.Server.Data.Repositories;
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

            //Repos
            services.AddScoped<ArmyCardRepository>();
            services.AddScoped<FileRepository>();

            return services;
        }
    }
}
