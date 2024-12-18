using HeroscapeBuilder.Server.Domain;
using HeroscapeBuilder.Server.Integrations.Interfaces;

namespace HeroscapeBuilder.Server.Services
{
    public class ImageService
    {
        private readonly IFileStorage<byte[]> _blobStorage;
        private readonly ImageOptimizer _imageOptimizer;

        public ImageService(IFileStorage<byte[]> blobStorage, ImageOptimizer imageOptimizer)
        {
            _blobStorage = blobStorage;
            _imageOptimizer = imageOptimizer;
        }

        public async Task<List<string>> OptimizeImagesInStorageAsync(string folderPath, string purpose, int? maxWidth, int? maxHeight)
        {
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
                        var fullPath = Path.Combine(folderPath, file.Name);
                        optimized.Add($"File already optimized, no changes made. {fullPath}");
                    }
                }
            }

            return optimized;
        }

        public byte[] OptimizeImage(byte[] image, string purpose = "PRINT", int? maxWidth = null, int? maxHeight = null, bool maintainAspectRatio = true)
        {
            return _imageOptimizer.OptimizeImage(image, "PRINT", maxWidth, maxHeight, maintainAspectRatio);
        }

        // Helper method to check for JPG
        public bool IsJpg(byte[] fileData)
        {
            return fileData.Length > 2 &&
                   fileData[0] == 0xFF && fileData[1] == 0xD8 && // Start of JPG file
                   fileData[^2] == 0xFF && fileData[^1] == 0xD9; // End of JPG file
        }

        // Helper method to check for PNG
        public bool IsPng(byte[] fileData)
        {
            return fileData.Length > 8 &&
                   fileData[0] == 0x89 && fileData[1] == 0x50 &&
                   fileData[2] == 0x4E && fileData[3] == 0x47 &&
                   fileData[4] == 0x0D && fileData[5] == 0x0A &&
                   fileData[6] == 0x1A && fileData[7] == 0x0A;
        }
    }
}
