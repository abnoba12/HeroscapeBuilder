using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Services;

namespace HeroscapeBuilder.Server
{
    public static class RegisterService
    {
        public static IServiceCollection RegisterServices(this IServiceCollection services)
        {
            services.AddScoped<UnitService>();
            services.AddScoped<ArmyCardRepository>();

            return services;
        }
    }
}
