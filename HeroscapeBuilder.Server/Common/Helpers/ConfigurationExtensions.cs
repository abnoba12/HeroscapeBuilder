using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;

namespace HeroscapeBuilder.Server.Common.Helpers
{
    public static class ConfigurationExtensions
    {
        // Extension method on IConfiguration to get and transform a connection string
        public static string GetConnectionStringFromEnv(this IConfiguration configuration, string environmentVariableName, string connectionStringName)
        {
            // Fetch the connection string using the built-in GetConnectionString method
            var connectionString = configuration.GetConnectionString(connectionStringName);

            if (string.IsNullOrEmpty(connectionString)) {
                throw new ArgumentNullException(nameof(connectionString));
            }

            // Transform the connection string using ConfigurationHelper's GetConfig method
            return GetConfig(connectionString, environmentVariableName);
        }

        private static string GetConfig(string connectionString, string environmentVariableName)
        {
            var _ConfigurationPath = Environment.GetEnvironmentVariable(environmentVariableName);
            if (string.IsNullOrEmpty(_ConfigurationPath))
            {
                throw new ArgumentNullException(nameof(_ConfigurationPath));
            }

            // Step 1: Check if the file exists at the given path
            if (!File.Exists(_ConfigurationPath))
            {
                throw new FileNotFoundException("Configuration file not found.");
            }

            // Step 2: Read the content of the file
            string fileContent = File.ReadAllText(_ConfigurationPath);

            // Step 3: Verify the file is a valid JSON file by attempting to parse it
            JObject jsonConfig;
            try
            {
                jsonConfig = JObject.Parse(fileContent);
            }
            catch (Exception ex)
            {
                throw new InvalidDataException("The configuration file is not a valid JSON.", ex);
            }

            // Step 4: Replace placeholders in the input "config" string using keys from the JSON file
            foreach (var property in jsonConfig.Properties())
            {
                string placeholder = $"%{property.Name}%";
                string value = property.Value.ToString();

                // Replace the placeholder in the "config" string with the value from the JSON file
                connectionString = connectionString.Replace(placeholder, value);
            }

            // Step 5: Return the updated config string
            return connectionString;
        }
    }
}
