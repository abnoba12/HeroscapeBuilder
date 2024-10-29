using Microsoft.Extensions.Configuration;

namespace HeroscapeBuilder.Server.Common.Helpers
{
    public static class FileHelper
    {
        private static string _blobStoragePath;

        // Method to initialize the blob storage path, called once at startup
        public static void Initialize(IConfiguration configuration)
        {
            _blobStoragePath = configuration["BlobStorage:Path"];
        }

        // Extension method to prepend blob storage path
        public static string PrependFilePath(this string filePath)
        {
            return string.IsNullOrEmpty(filePath) ? null : $"{_blobStoragePath}{filePath}";
        }
    }

}
