using Microsoft.Data.SqlClient;
using Newtonsoft.Json.Linq;

namespace HeroscapeBuilder.Server.Common.Helpers
{
    /// <summary>
    /// Keeps local development off the production database.
    /// The connection string always comes from the HeroscapeBuilder environment variable (the same one the
    /// deployed container gets), but when ASPNETCORE_ENVIRONMENT is Development - which is what Visual Studio's
    /// launch profiles set - only the database name is swapped for the dev database. Server and credentials
    /// are kept. In Production (the docker container) or when no environment is set, nothing changes.
    /// </summary>
    public static class DevelopmentDatabase
    {
        public const string ConfigKey = "ProjectMasterDb";
        public const string DatabaseName = "HeroscapeBuilder_dev";

        public static bool IsActive
        {
            get
            {
                var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")
                    ?? Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT");
                return string.Equals(environment, "Development", StringComparison.OrdinalIgnoreCase);
            }
        }

        /// <summary>
        /// Rewrites the database in the master connection string in place. Called wherever the config is loaded,
        /// so every consumer (Entity Framework, NLog's database target) ends up on the same database.
        /// </summary>
        public static void Apply(JObject config)
        {
            if (!IsActive || config[ConfigKey] is not JValue { Value: string connectionString })
            {
                return;
            }

            config[ConfigKey] = new SqlConnectionStringBuilder(connectionString) { InitialCatalog = DatabaseName }.ConnectionString;
        }
    }
}
