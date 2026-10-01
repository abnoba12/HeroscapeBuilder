using HeroscapeBuilder.Server.Common.Mapping;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Integrations.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace HeroscapeBuilder.Server.Services
{
    public class FileService
    {
        private readonly FileRepository _fileRepository;
        private readonly PdfService _pdfService;
        private readonly IFileStorage<byte[]> _blobStorage;
        private readonly ImageService _imageService;

        public FileService(FileRepository fileRepository, IFileStorage<byte[]> blobStorage, PdfService pdfThumbnailService, ImageService imageService)
        {
            _fileRepository = fileRepository;
            _pdfService = pdfThumbnailService;
            _blobStorage = blobStorage;
            _imageService = imageService;
        }

        public async Task<List<UnitFileEntity>> GetFilesByPurpose(string purpose)
        {
            var files = (await _fileRepository.GetFiles(purpose))
                .OrderBy(x => x.ArmyCard.Name ?? Path.GetFileName(x.FilePath), StringComparer.OrdinalIgnoreCase)
                .ToList();

            if (files == null)
                throw new ArgumentException("No files found");

            var unitFiles = files.Select(file => file.ToUnitFileEntity()).ToList();

            return unitFiles;
        }

        public async Task<bool> AddFileToUnit(int armyCardId, string filePurpose, string fileName, byte[] fileData, long? parentFileId)
        {
            var fullPath = GetPathByFilePurpose(filePurpose);
            if (string.IsNullOrEmpty(fullPath))
            {
                throw new Exception("Unable to determine file destination.");
            }

            //If the file is a PDF then compress it
            byte[] thumbImage = null;
            string? thumbFileName = null;
            if (_pdfService.IsPdf(fileData))
            {
                var newFileData = _pdfService.CompressPdf(fileData);
                //Only take the optimized image if it is smaller
                if (newFileData.Length < fileData.Length)
                {
                    fileData = newFileData;
                }

                (thumbImage, thumbFileName) = await CreateWebThumbnailAsync(fileData, $"{filePurpose}_Thumb", Path.GetFileNameWithoutExtension(fileName));
            }

            //If the file is an image then optimize it
            if(_imageService.IsPng(fileData) || _imageService.IsJpg(fileData))
            {
                var newFileData = _imageService.OptimizeImage(fileData);
                //Only take the optimized image if it is smaller
                if(newFileData.Length < fileData.Length)
                {
                    fileData = newFileData;
                }
            }

            var filePath = Path.Combine(fullPath, fileName);
            var existingFile = await _fileRepository.GetArmyCardFileAsync(armyCardId, filePurpose);

            if (existingFile != null && existingFile.FilePath != filePath)
            {
                await _blobStorage.DeleteAsync(existingFile.FilePath);
            }

            var uploadResult = await _blobStorage.UploadAsync(fileData, filePath);
            if (string.IsNullOrEmpty(uploadResult))
            {
                throw new Exception("Unable to upload file.");
            }

            long fileId;
            if (existingFile != null)
            {
                existingFile.FilePath = filePath;
                existingFile.Parent = parentFileId;
                await _fileRepository.UpdateArmyCardFileAsync(existingFile);
                fileId = existingFile.Id;
            }
            else
            {
                var acf = new ArmyCardFile
                {
                    ArmyCardId = armyCardId,
                    FilePurpose = filePurpose,
                    Parent = parentFileId,
                    FilePath = filePath
                };

                fileId = await _fileRepository.AddArmyCardFileAsync(acf);
            }

            if (thumbImage != null && thumbFileName != null)
            {
                await AddFileToUnit(armyCardId, $"{filePurpose}_Thumb", thumbFileName, thumbImage, fileId);
            }

            return true;
        }

        public async Task<bool> UpdateFileForUnitAsync(int armyCardId, string filePurpose, string filePath, byte[] fileData)
        {
            //Upload the file to file storage
            var r = await _blobStorage.UploadAsync(fileData, filePath);
            if (string.IsNullOrEmpty(r))
            {
                throw new Exception("Unable to upload file.");
            }
            return true;
        }

        public async Task RegenerateThumbnailAsync(int armyCardId, string armyCardType)
        {
            var (pdfPurpose, thumbnailPurpose) = GetFilePurposesForArmyCardType(armyCardType);

            if (armyCardId == -1)
            {
                var pdfFiles = (await _fileRepository.GetFiles(new List<int> { -1 }, pdfPurpose)).ToList();
                if (pdfFiles.Count == 0)
                {
                    throw new InvalidOperationException($"No {armyCardType} PDFs found to regenerate thumbnails for.");
                }

                var errors = new List<Exception>();
                foreach (var pdfFile in pdfFiles)
                {
                    try
                    {
                        await RegenerateThumbnailForPdfAsync(pdfFile, thumbnailPurpose);
                    }
                    catch (Exception ex)
                    {
                        errors.Add(new InvalidOperationException($"ArmyCardId {pdfFile.ArmyCardId}: {ex.Message}", ex));
                    }
                }

                if (errors.Count > 0)
                {
                    throw new AggregateException("Failed to regenerate one or more thumbnails.", errors);
                }

                return;
            }

            await RegenerateThumbnailForArmyCardAsync(armyCardId, armyCardType, pdfPurpose, thumbnailPurpose);
        }

        private async Task RegenerateThumbnailForArmyCardAsync(int armyCardId, string armyCardType, string pdfPurpose, string thumbnailPurpose)
        {
            var pdfFile = await _fileRepository.GetArmyCardFileAsync(armyCardId, pdfPurpose);
            if (pdfFile == null)
            {
                throw new InvalidOperationException($"Unable to find a {armyCardType} PDF for army card {armyCardId}.");
            }

            await RegenerateThumbnailForPdfAsync(pdfFile, thumbnailPurpose);
        }

        private async Task RegenerateThumbnailForPdfAsync(ArmyCardFile pdfFile, string thumbnailPurpose)
        {
            byte[] pdfData;
            try
            {
                pdfData = await _blobStorage.DownloadAsync(pdfFile.FilePath)
                    ?? throw new InvalidOperationException($"Unable to download PDF from storage at '{pdfFile.FilePath}'.");
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Unable to download PDF from storage at '{pdfFile.FilePath}'.", ex);
            }

            if (pdfData.Length == 0)
            {
                throw new InvalidOperationException($"The PDF retrieved from '{pdfFile.FilePath}' is empty.");
            }

            byte[] thumbImage;
            string thumbnailFileName;
            try
            {
                (thumbImage, thumbnailFileName) = await CreateWebThumbnailAsync(pdfData, thumbnailPurpose, Path.GetFileNameWithoutExtension(pdfFile.FilePath));
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Failed to create thumbnail from PDF.", ex);
            }

            var thumbnailDirectory = GetPathByFilePurpose(thumbnailPurpose);
            if (string.IsNullOrWhiteSpace(thumbnailDirectory))
            {
                throw new InvalidOperationException($"Unable to determine storage location for purpose '{thumbnailPurpose}'.");
            }

            var thumbnailFilePath = Path.Combine(thumbnailDirectory, thumbnailFileName);

            var existingThumbnail = await _fileRepository.GetArmyCardFileAsync(pdfFile.ArmyCardId, thumbnailPurpose);
            if (existingThumbnail != null && existingThumbnail.Parent.HasValue && existingThumbnail.Parent.Value != pdfFile.Id)
            {
                throw new InvalidOperationException("Existing thumbnail is associated with a different parent PDF.");
            }

            string uploadResult;
            try
            {
                uploadResult = await _blobStorage.UploadAsync(thumbImage, thumbnailFilePath);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to upload thumbnail to '{thumbnailFilePath}'.", ex);
            }

            if (string.IsNullOrEmpty(uploadResult))
            {
                throw new InvalidOperationException($"Failed to upload thumbnail to '{thumbnailFilePath}'.");
            }

            // Only remove the previous thumbnail once the new one is safely stored
            if (existingThumbnail != null && !string.IsNullOrWhiteSpace(existingThumbnail.FilePath) && existingThumbnail.FilePath != thumbnailFilePath)
            {
                await _blobStorage.DeleteAsync(existingThumbnail.FilePath);
            }

            if (existingThumbnail != null)
            {
                existingThumbnail.FilePath = thumbnailFilePath;
                existingThumbnail.Parent = pdfFile.Id;
                await _fileRepository.UpdateArmyCardFileAsync(existingThumbnail);
            }
            else
            {
                var thumbnailRecord = new ArmyCardFile
                {
                    ArmyCardId = pdfFile.ArmyCardId,
                    FilePurpose = thumbnailPurpose,
                    FilePath = thumbnailFilePath,
                    Parent = pdfFile.Id,
                    CreatedAt = DateTime.UtcNow
                };

                await _fileRepository.AddArmyCardFileAsync(thumbnailRecord);
            }
        }

        private static (string pdfPurpose, string thumbnailPurpose) GetFilePurposesForArmyCardType(string armyCardType)
        {
            if (string.IsNullOrWhiteSpace(armyCardType))
            {
                throw new ArgumentException("Army card type must be provided.", nameof(armyCardType));
            }

            switch (armyCardType.Trim().ToLowerInvariant())
            {
                case "3x5":
                    return ("3x5_Army_Card", "3x5_Army_Card_Thumb");
                case "pc":
                    return ("PC_Army_Card", "PC_Army_Card_Thumb");
                case "standard":
                    return ("Standard_Army_Card", "Standard_Army_Card_Thumb");
                default:
                    throw new ArgumentException($"Unsupported army card type '{armyCardType}'.", nameof(armyCardType));
            }
        }

        /// <summary>
        /// Renders the first page of a PDF and returns it as a small WebP plus its file name. The name carries a short
        /// content hash so a changed thumbnail always gets a new URL, which lets browsers cache each URL forever.
        /// </summary>
        private async Task<(byte[] Data, string FileName)> CreateWebThumbnailAsync(byte[] pdfData, string thumbnailPurpose, string pdfFileNameWithoutExtension)
        {
            var png = await _pdfService.CreateThumbnailFromPdf(pdfData);
            if (png == null || png.Length == 0)
            {
                throw new InvalidOperationException("Failed to create thumbnail from PDF.");
            }

            var (maxWidth, maxHeight) = GetThumbnailBounds(thumbnailPurpose);
            var webp = _imageService.EncodeWebp(png, maxWidth, maxHeight);

            var hash = Convert.ToHexString(System.Security.Cryptography.SHA256.HashData(webp))[..8].ToLowerInvariant();
            return (webp, $"pdf-thumbnail-{pdfFileNameWithoutExtension}-{hash}.webp");
        }

        private static (int? MaxWidth, int? MaxHeight) GetThumbnailBounds(string thumbnailPurpose)
        {
            return thumbnailPurpose switch
            {
                "3x5_Army_Card_Thumb" or "Standard_Army_Card_Thumb" => (null, 300),
                "PC_Army_Card_Thumb" => (350, null),
                _ => (null, 300),
            };
        }

        /// <summary>Ids of every army card PDF (all card types) that should have a thumbnail.</summary>
        public async Task<List<(string ArmyCardType, long PdfFileId)>> GetAllPdfFilesForThumbnailsAsync()
        {
            var result = new List<(string, long)>();
            foreach (var armyCardType in ArmyCardTypes)
            {
                var (pdfPurpose, _) = GetFilePurposesForArmyCardType(armyCardType);
                var pdfFiles = await _fileRepository.GetFiles(new List<int> { -1 }, pdfPurpose);
                result.AddRange(pdfFiles.Select(f => (armyCardType, f.Id)));
            }
            return result;
        }

        public async Task RegenerateThumbnailForPdfIdAsync(string armyCardType, long pdfFileId)
        {
            var (_, thumbnailPurpose) = GetFilePurposesForArmyCardType(armyCardType);
            var pdfFile = await _fileRepository.GetArmyCardFileByIdAsync(pdfFileId)
                ?? throw new InvalidOperationException($"PDF file {pdfFileId} no longer exists.");
            await RegenerateThumbnailForPdfAsync(pdfFile, thumbnailPurpose);
        }

        private static readonly string[] ArmyCardTypes = { "standard", "3x5", "pc" };

        private string? GetPathByFilePurpose(string filePurpose)
        {
            switch (filePurpose)
            {
                case "Card_Hitbox_Image":
                    return "/card-assets/Hitbox/";
                case "Card_3x5_Advanced_Image":
                    return "/card-assets/3x5/";
                case "Card_Advanced_Image_Standard":
                    return "/card-assets/Standard/";
                case "Card_PC_Advanced_Image":
                    return "/card-assets/PC/";
                case "Card_Basic_Image":
                    return "/card-assets/Basic/";
                case "3x5_Army_Card":
                    return "/pdfs/3x5/";
                case "PC_Army_Card":
                    return "/pdfs/PC/";
                case "Standard_Army_Card":
                    return "/pdfs/standard/";
                case "Standard_Army_Card_Thumb":
                    return "/thumbs/pdf_thumbs/Standard/";
                case "3x5_Army_Card_Thumb":
                    return "/thumbs/pdf_thumbs/3x5/";
                case "PC_Army_Card_Thumb":
                    return "/thumbs/pdf_thumbs/PC/";
                default:
                    return null;
            }
        }
    }
}
