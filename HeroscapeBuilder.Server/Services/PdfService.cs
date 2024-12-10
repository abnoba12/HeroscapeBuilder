using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Integrations.Interfaces;
using iText.Kernel.Pdf;
using MuPDFCore;
using VectSharp.Raster;

namespace HeroscapeBuilder.Server.Services
{
    public class PdfService
    {
        public byte[] CompressPdf(byte[] inputPdfData)
        {
            // Initialize the writer properties for optimal print compression
            var writerProperties = new WriterProperties()
                .SetCompressionLevel(CompressionConstants.BEST_COMPRESSION);

            // Use memory streams for in-memory processing
            using (var inputStream = new MemoryStream(inputPdfData))
            using (var outputStream = new MemoryStream())
            {
                // Initialize the PdfReader and PdfWriter with memory streams
                using (var pdfReader = new PdfReader(inputStream))
                using (var pdfWriter = new PdfWriter(outputStream, writerProperties))
                using (var pdfDoc = new PdfDocument(pdfReader, pdfWriter))
                {
                    pdfDoc.GetNumberOfPages(); // Forces the document to be fully loaded into memory
                }

                // Return the compressed PDF as a byte array
                return outputStream.ToArray();
            }
        }

        public async Task<byte[]> CreateThumbnailFromPdf(byte[] pdfBytes)
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

        public bool IsPdf(byte[] fileData)
        {
            // PDF files start with the bytes representing "%PDF-"
            var pdfHeader = new byte[] { 0x25, 0x50, 0x44, 0x46, 0x2D }; // Corresponds to "%PDF-"

            // Ensure fileData is at least as long as the PDF header
            if (fileData.Length < pdfHeader.Length)
            {
                return false;
            }

            // Compare the first few bytes of fileData to the PDF header
            for (int i = 0; i < pdfHeader.Length; i++)
            {
                if (fileData[i] != pdfHeader[i])
                {
                    return false;
                }
            }

            return true;
        }        
    }
}
