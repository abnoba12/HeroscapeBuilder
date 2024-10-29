using HeroscapeBuilder.Server.Domain;
using HeroscapeBuilder.Server.Integrations.Interfaces;

namespace HeroscapeBuilder.Server.Services
{
    public class ImageOptimizationService
    {
        private readonly IFileStorage<byte[]> _blobStorage;
        private readonly ImageOptimizer _imageOptimizer;

        public ImageOptimizationService(IFileStorage<byte[]> blobStorage, ImageOptimizer imageOptimizer)
        {
            _blobStorage = blobStorage;
            _imageOptimizer = imageOptimizer;
        }

        public async Task<List<string>> OptimizeImagesAsync(string bucketId, string folderPath, string purpose, int? maxWidth, int? maxHeight)
        {
            _blobStorage.BucketName = bucketId;
            var files = await _blobStorage.ListFilesAsync(folderPath);
            List<string> optimized = new List<string>(); 

            foreach (var file in files)
            {
                // Only process image files (e.g., .jpg, .png)
                if (file.Name.EndsWith(".jpg") || file.Name.EndsWith(".png"))
                {                    
                    var fileData = await _blobStorage.DownloadAsync(Path.Combine(folderPath, file.Name));

                    //Optimize the image
                    var optimizedImage = _imageOptimizer.OptimizeImage(fileData, purpose, maxWidth, maxHeight, true);

                    //Save the file if the optimized file is smaller than the new file.
                    if(fileData.Length > optimizedImage.Length)
                    {
                        // Upload the optimized image back to Supabase
                        optimized.Add(await _blobStorage.UploadAsync(optimizedImage, Path.Combine(folderPath, file.Name)));
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
