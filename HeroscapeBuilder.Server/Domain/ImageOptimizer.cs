using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Diagnostics; // For running external PNG optimizers

namespace HeroscapeBuilder.Server.Domain
{
    public class ImageOptimizer
    {
        public byte[] OptimizeImage(byte[] imageData, string purpose, int? maxWidth, int? maxHeight, bool maintainAspectRatio)
        {
            using var originalImage = Image.FromStream(new MemoryStream(imageData));

            // Ensure we only scale down the image, never up
            var scale = CalculateScaleDown(originalImage.Width, originalImage.Height, maxWidth, maxHeight, maintainAspectRatio);

            // Resize image if needed
            using var resizedImage = ResizeImage(originalImage, scale);

            // Optimize based on purpose and image format (PNG-specific)
            var optimizedImage = purpose.ToUpper() switch
            {
                "PRINT" => OptimizeForPrint(resizedImage, originalImage.RawFormat),
                _ => OptimizeForWeb(resizedImage, originalImage.RawFormat)  // Default is "WEB"
            };

            return optimizedImage;
        }

        private double CalculateScaleDown(int originalWidth, int originalHeight, int? maxWidth, int? maxHeight, bool maintainAspectRatio)
        {
            var widthScale = maxWidth.HasValue ? (double)maxWidth.Value / originalWidth : 1.0;
            var heightScale = maxHeight.HasValue ? (double)maxHeight.Value / originalHeight : 1.0;

            // Ensure we never scale the image larger than its original size
            var scale = maintainAspectRatio ? Math.Min(widthScale, heightScale) : 1.0;

            return Math.Min(1.0, scale); // Ensure we only scale down, never up
        }

        private Image ResizeImage(Image image, double scale)
        {
            if (scale >= 1.0) return image;  // No need to resize if the scale is 1 or higher

            var newWidth = (int)(image.Width * scale);
            var newHeight = (int)(image.Height * scale);
            var resizedImage = new Bitmap(newWidth, newHeight);

            using (var graphics = Graphics.FromImage(resizedImage))
            {
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.DrawImage(image, 0, 0, newWidth, newHeight);
            }

            return resizedImage;
        }

        private byte[] OptimizeForPrint(Image image, ImageFormat originalFormat)
        {
            using var memoryStream = new MemoryStream();

            if (originalFormat.Equals(ImageFormat.Png))
            {
                // Use lossless PNG, but you can run an external optimizer after saving
                image.Save(memoryStream, ImageFormat.Png);
                return memoryStream.ToArray();
            }
            else
            {
                // Save as high-quality JPEG
                var encoderParameters = new EncoderParameters(1);
                encoderParameters.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 85L); // Print quality (high)
                var jpegCodec = GetEncoder(ImageFormat.Jpeg);
                image.Save(memoryStream, jpegCodec, encoderParameters);
            }

            return memoryStream.ToArray();
        }

        private byte[] OptimizeForWeb(Image image, ImageFormat originalFormat)
        {
            using var memoryStream = new MemoryStream();

            if (originalFormat.Equals(ImageFormat.Png))
            {
                image.Save(memoryStream, ImageFormat.Png);
                return OptimizePng(memoryStream.ToArray()); // Run external PNG optimizer
            }
            else
            {
                // Save as compressed JPEG for web
                var encoderParameters = new EncoderParameters(1);
                encoderParameters.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 65L); // Web optimized (compressed)
                var jpegCodec = GetEncoder(ImageFormat.Jpeg);
                image.Save(memoryStream, jpegCodec, encoderParameters);
            }

            return memoryStream.ToArray();
        }

        private byte[] OptimizePng(byte[] pngData)
        {
            // You can run an external optimizer like PNGCrush or OptiPNG here
            // Example (using command line):
            var tempPngPath = Path.GetTempFileName() + ".png";
            File.WriteAllBytes(tempPngPath, pngData);

            var optimizedPngPath = Path.GetTempFileName() + "_optimized.png";

            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "pngcrush", // Or optipng, if available
                    Arguments = $"\"{tempPngPath}\" \"{optimizedPngPath}\"",
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };
            process.Start();
            process.WaitForExit();

            if (File.Exists(optimizedPngPath))
            {
                return File.ReadAllBytes(optimizedPngPath);
            }

            // Fallback to original PNG if optimization fails
            return pngData;
        }

        private ImageCodecInfo GetEncoder(ImageFormat format)
        {
            var codecs = ImageCodecInfo.GetImageDecoders();
            foreach (var codec in codecs)
            {
                if (codec.FormatID == format.Guid)
                {
                    return codec;
                }
            }
            return null;
        }
    }
}
