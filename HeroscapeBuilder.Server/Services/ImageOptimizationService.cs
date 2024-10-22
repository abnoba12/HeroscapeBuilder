using HeroscapeBuilder.Server.Domain;
using HeroscapeBuilder.Server.Integrations.AzureStorage;

namespace HeroscapeBuilder.Server.Services
{
    public class ImageOptimizationService
    {
        private readonly AzureBlobStorage _azureBlobStorage;
        private readonly ImageOptimizer _imageOptimizer;

        public ImageOptimizationService(AzureBlobStorage azureBlobStorage, ImageOptimizer imageOptimizer)
        {
            _azureBlobStorage = azureBlobStorage;
            _imageOptimizer = imageOptimizer;
        }

        public async Task<List<string>> OptimizeImagesAsync(string bucketId, string folderPath, string purpose, int? maxWidth, int? maxHeight)
        {
            _azureBlobStorage.ContainerName = bucketId;
            var files = await _azureBlobStorage.ListFilesAsync(folderPath);
            List<string> optimized = new List<string>(); 

            foreach (var file in files)
            {
                // Only process image files (e.g., .jpg, .png)
                if (file.Name.EndsWith(".jpg") || file.Name.EndsWith(".png"))
                {                    
                    var fileData = await _azureBlobStorage.DownloadAsync(Path.Combine(folderPath, file.Name));

                    //Optimize the image
                    var optimizedImage = _imageOptimizer.OptimizeImage(fileData, purpose, maxWidth, maxHeight, true);

                    //Save the file if the optimized file is smaller than the new file.
                    if(fileData.Length > optimizedImage.Length)
                    {
                        // Upload the optimized image back to Supabase
                        optimized.Add(await _azureBlobStorage.UploadAsync(optimizedImage, Path.Combine(folderPath, file.Name)));
                    }
                    else
                    {
                        var fullPath = Path.Combine(bucketId, folderPath, file.Name);
                        optimized.Add($"File already optimized, no changes made. {fullPath}");
                    }
                }
            }

            return optimized;
        }
    }
}
