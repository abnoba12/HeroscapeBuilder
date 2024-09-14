using HeroscapeBuilder.Server.Domain;
using HeroscapeBuilder.Server.Integrations.SupabaseIntegration;

namespace HeroscapeBuilder.Server.Services
{
    public class ImageOptimizationService
    {
        private readonly SupabaseStorage _supabaseClient;
        private readonly ImageOptimizer _imageOptimizer;

        public ImageOptimizationService(SupabaseStorage supabaseClient, ImageOptimizer imageOptimizer)
        {
            _supabaseClient = supabaseClient;
            _imageOptimizer = imageOptimizer;
        }

        public async Task<List<string>> OptimizeImagesAsync(string bucketId, string folderPath, string purpose, int? maxWidth, int? maxHeight)
        {
            var b = _supabaseClient.ListBuckets();
            var files = await _supabaseClient.GetFilesFromFolderAsync(bucketId, folderPath);
            List<string> optimized = new List<string>(); 

            foreach (var file in files)
            {
                // Only process image files (e.g., .jpg, .png)
                if (file.Name.EndsWith(".jpg") || file.Name.EndsWith(".png"))
                {
                    var fileData = await _supabaseClient.DownloadFileAsync(bucketId, folderPath, file.Name);

                    //Optimize the image
                    var optimizedImage = _imageOptimizer.OptimizeImage(fileData, purpose, maxWidth, maxHeight, true);

                    //Save the file if the optimized file is smaller than the new file.
                    if(fileData.Length > optimizedImage.Length)
                    {
                        // Upload the optimized image back to Supabase
                        optimized.Add(await _supabaseClient.UploadFileAsync(bucketId, folderPath, file.Name, optimizedImage));
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
