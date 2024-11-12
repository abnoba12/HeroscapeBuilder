using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;

namespace HeroscapeBuilder.Server.Common.Helpers
{
    public static class ConfigurationExtensions
    {
        /// <summary>
        /// Get a connection string by name
        /// </summary>
        /// <param name="configuration"></param>
        /// <param name="environmentVariableName">What is the name of the environment variable this is stored in</param>
        /// <param name="connectionStringName">Name of the desired connection string</param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException"></exception>
        public static string GetConnectionStringFromEnv(this IConfiguration configuration, string environmentVariableName, string connectionStringName)
        {
            // Fetch the connection string using the built-in GetConnectionString method
            var connectionString = configuration.GetConnectionString(connectionStringName);

            if (string.IsNullOrEmpty(connectionString)) {
                throw new ArgumentNullException(nameof(connectionString));
            }

            // Transform the connection string using ConfigurationHelper's GetConfig method
            return GetConfigWithPlaceholders(connectionString, environmentVariableName);
        }

        /// <summary>
        /// Get a configuration section by name
        /// </summary>
        /// <param name="configuration"></param>
        /// <param name="environmentVariableName">What is the name of the environment variable this is stored in</param>
        /// <param name="sectionName">Name of the desired config section</param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException"></exception>
        public static IConfigurationSection GetSectionWithEnvVariables(this IConfiguration configuration, string environmentVariableName, string sectionName)
        {
            var section = configuration.GetSection(sectionName);
            if (!section.Exists())
            {
                throw new ArgumentNullException($"Configuration section '{sectionName}' not found.");
            }

            // Build a dictionary recursively with all key-value pairs
            var sectionDict = BuildSectionDictionary(section);

            // Serialize to JSON and replace placeholders with env variables
            var sectionJson = JsonConvert.SerializeObject(sectionDict, Formatting.Indented);
            var updatedJson = GetConfigWithPlaceholders(sectionJson, environmentVariableName);

            // Wrap in a root element
            var wrappedJson = $"{{ \"{sectionName}\": {updatedJson} }}";

            // Parse wrapped JSON back into an IConfigurationSection
            var updatedSection = new ConfigurationBuilder()
                .AddJsonStream(new MemoryStream(Encoding.UTF8.GetBytes(wrappedJson)))
                .Build()
                .GetSection(sectionName);

            return updatedSection;
        }

        /// <summary>
        /// Get a single configuration item
        /// </summary>
        /// <param name="configuration"></param>
        /// <param name="environmentVariableName">What is the name of the environment variable this is stored in</param>
        /// <param name="key">Name of the config item desired</param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException"></exception>
        public static string GetConfigValue(this IConfiguration configuration, string environmentVariableName, string key)
        {
            // Retrieve the value from the configuration by key
            var configValue = configuration[key];

            if (string.IsNullOrEmpty(configValue))
            {
                throw new ArgumentNullException($"Configuration key '{key}' not found.");
            }

            // Replace placeholders in the config value using environment variables
            return GetConfigWithPlaceholders(configValue, environmentVariableName);
        }

        private static Dictionary<string, object> BuildSectionDictionary(IConfigurationSection section)
        {
            var dict = new Dictionary<string, object>();

            foreach (var child in section.GetChildren())
            {
                if (child.GetChildren().Any())
                {
                    dict[child.Key] = BuildSectionDictionary(child); // Recursive for nested sections
                }
                else
                {
                    dict[child.Key] = child.Value;
                }
            }

            return dict;
        }

        private static string GetConfigWithPlaceholders(string connectionString, string environmentVariableName)
        {
            var _Configuration = Environment.GetEnvironmentVariable(environmentVariableName);
            if (string.IsNullOrEmpty(_Configuration))
            {
                throw new ArgumentNullException(nameof(_Configuration));
            }

            JObject jsonConfig;
            //Configuration can be either a file path to a JSON file or it can be just the JSON content.
            if (_Configuration.StartsWith('{'))
            {
                //_Configuration is raw JSON
                try
                {
                    jsonConfig = JObject.Parse(_Configuration);
                }
                catch (Exception ex)
                {
                    throw new InvalidDataException("The configuration file is not a valid JSON.", ex);
                }
            }
            else
            {
                //_Configuration is a file path

                // Step 1: Check if the file exists at the given path
                if (!File.Exists(_Configuration))
                {
                    throw new FileNotFoundException("Configuration file not found.");
                }

                if (string.IsNullOrEmpty(connectionString))
                {
                    return null;
                }

                // Step 2: Read the content of the file
                string fileContent = File.ReadAllText(_Configuration);

                // Step 3: Verify the file is a valid JSON file by attempting to parse it

                try
                {
                    jsonConfig = JObject.Parse(fileContent);
                }
                catch (Exception ex)
                {
                    throw new InvalidDataException("The configuration file is not a valid JSON.", ex);
                }
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
