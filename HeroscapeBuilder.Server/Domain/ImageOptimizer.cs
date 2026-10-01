using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Webp;

namespace HeroscapeBuilder.Server.Domain
{
    public class ImageOptimizer
    {
        public byte[] OptimizeImage(byte[] imageData, string purpose, int? maxWidth, int? maxHeight, bool maintainAspectRatio)
        {
            using var image = Image.Load(imageData);
            var format = Image.DetectFormat(imageData);

            // Ensure we only scale down the image, never up
            var scale = CalculateScaleDown(image.Width, image.Height, maxWidth, maxHeight, maintainAspectRatio);

            // Resize image if needed
            if (scale < 1.0)
            {
                image.Mutate(x => x.Resize(
                    (int)(image.Width * scale),
                    (int)(image.Height * scale),
                    KnownResamplers.Bicubic));
            }

            // Optimize based on purpose
            return purpose.ToUpper() switch
            {
                "PRINT" => OptimizeForPrint(image, format),
                "WEB" => OptimizeForWeb(image, format),
                _ => throw new ArgumentException("Invalid purpose specified."),
            };
        }

        /// <summary>
        /// Downscales (never upscales) an image to fit the given bounds and re-encodes it as lossy WebP.
        /// Used for gallery thumbnails, where WebP is typically several times smaller than PNG.
        /// </summary>
        public byte[] EncodeWebp(byte[] imageData, int? maxWidth, int? maxHeight, int quality = 80)
        {
            using var image = Image.Load(imageData);

            var scale = CalculateScaleDown(image.Width, image.Height, maxWidth, maxHeight, true);
            if (scale < 1.0)
            {
                image.Mutate(x => x.Resize(
                    Math.Max(1, (int)(image.Width * scale)),
                    Math.Max(1, (int)(image.Height * scale)),
                    KnownResamplers.Lanczos3));
            }

            using var memoryStream = new MemoryStream();
            image.Save(memoryStream, new WebpEncoder { Quality = quality, FileFormat = WebpFileFormatType.Lossy });
            return memoryStream.ToArray();
        }

        private double CalculateScaleDown(int originalWidth, int originalHeight, int? maxWidth, int? maxHeight, bool maintainAspectRatio)
        {
            var widthScale = maxWidth.HasValue ? (double)maxWidth.Value / originalWidth : 1.0;
            var heightScale = maxHeight.HasValue ? (double)maxHeight.Value / originalHeight : 1.0;

            // Ensure we never scale the image larger than its original size
            var scale = maintainAspectRatio ? Math.Min(widthScale, heightScale) : 1.0;

            return Math.Min(1.0, scale); // Ensure we only scale down, never up
        }

        private byte[] OptimizeForPrint(Image image, IImageFormat format)
        {
            using var memoryStream = new MemoryStream();

            if (format is PngFormat)
            {
                // Use PNG format for high-quality print
                image.Save(memoryStream, new PngEncoder { CompressionLevel = PngCompressionLevel.BestCompression });
            }
            else
            {
                // Use high-quality JPEG for print
                image.Save(memoryStream, new JpegEncoder { Quality = 85 });
            }

            return memoryStream.ToArray();
        }

        private byte[] OptimizeForWeb(Image image, IImageFormat format)
        {
            using var memoryStream = new MemoryStream();

            if (format is PngFormat)
            {
                // Use PNG with medium compression for web
                image.Save(memoryStream, new PngEncoder { CompressionLevel = PngCompressionLevel.DefaultCompression });
            }
            else
            {
                // Use compressed JPEG for web
                image.Save(memoryStream, new JpegEncoder { Quality = 65 });
            }

            return memoryStream.ToArray();
        }
    }
}
