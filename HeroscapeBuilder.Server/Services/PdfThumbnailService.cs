using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using MuPDFCore;
using VectSharp.Raster;

namespace HeroscapeBuilder.Server.Services
{
    public class PdfThumbnailService
    {
        private readonly HttpClient _httpClient;

        public PdfThumbnailService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<byte[]> CreatePdfThumbnailAsync(string pdfUrl)
        {
            // Download the PDF from the URL
            byte[] pdfBytes = await DownloadPdfAsync(pdfUrl);

            // Create the thumbnail from the downloaded PDF
            return await CreateThumbnailFromPdf(pdfBytes);
        }

        private async Task<byte[]> DownloadPdfAsync(string pdfUrl)
        {
            var response = await _httpClient.GetAsync(pdfUrl);
            response.EnsureSuccessStatusCode();  // Ensures the request was successful

            return await response.Content.ReadAsByteArrayAsync();
        }

        private async Task<byte[]> CreateThumbnailFromPdf(byte[] pdfBytes)
        {
            string tempFilePath = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.pdf");

            try
            {
                // Write the PDF bytes to a temporary file
                await File.WriteAllBytesAsync(tempFilePath, pdfBytes);

                MuPDFContext context = new MuPDFContext();
                MuPDFDocument document = new MuPDFDocument(context, tempFilePath);

                if (document.Pages.Count < 1)
                    throw new Exception("The PDF has no pages.");

                // Render the first page
                int pageIndex = 0;
                var renderer = document.GetMultiThreadedRenderer(pageIndex, 2);  // Using 2 threads
                RoundedRectangle roundedBounds = document.Pages[pageIndex].Bounds.Round(2); // Adjust zoom factor as needed

                RoundedSize renderedPageSize = new RoundedSize(roundedBounds.Width, roundedBounds.Height);
                RoundedRectangle[] tileBounds = renderedPageSize.Split(renderer.ThreadCount);
                IntPtr[] destinations = new IntPtr[renderer.ThreadCount];

                for (int j = 0; j < renderer.ThreadCount; j++)
                {
                    // Allocate memory for the tile
                    destinations[j] = System.Runtime.InteropServices.Marshal.AllocHGlobal(tileBounds[j].Height * tileBounds[j].Width * 3);
                }

                // Render the page
                renderer.Render(renderedPageSize, document.Pages[pageIndex].Bounds, destinations, PixelFormats.RGB);

                // Create the full page image using VectSharp
                VectSharp.Page renderedPage = new VectSharp.Page(renderedPageSize.Width, renderedPageSize.Height);

                for (int j = 0; j < renderer.ThreadCount; j++)
                {
                    VectSharp.RasterImage tile = new VectSharp.RasterImage(destinations[j], tileBounds[j].Width, tileBounds[j].Height, false, false);
                    renderedPage.Graphics.DrawRasterImage(tileBounds[j].X0, tileBounds[j].Y0, tile);
                }

                // Save the page to a MemoryStream as PNG
                using (var memoryStream = new MemoryStream())
                {
                    renderedPage.SaveAsPNG(memoryStream);

                    // Clean-up
                    for (int j = 0; j < renderer.ThreadCount; j++)
                    {
                        System.Runtime.InteropServices.Marshal.FreeHGlobal(destinations[j]);
                    }

                    renderer.Dispose();
                    document.Dispose();
                    context.Dispose();

                    // Return the PNG as a byte array
                    return memoryStream.ToArray();
                }
            }
            finally
            {
                // Ensure the temporary file is deleted
                if (File.Exists(tempFilePath))
                {
                    File.Delete(tempFilePath);
                }
            }
        }
    }
}
