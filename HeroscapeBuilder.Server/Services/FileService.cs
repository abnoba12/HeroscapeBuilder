using AutoMapper;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Integrations.Interfaces;

namespace HeroscapeBuilder.Server.Services
{
    public class FileService
    {
        private readonly FileRepository _fileRepository;
        private readonly IMapper _mapper;
        private readonly PdfService _pdfService;
        private readonly IFileStorage<byte[]> _blobStorage;
        private readonly ImageService _imageService;

        public FileService(FileRepository fileRepository, IMapper mapper, IFileStorage<byte[]> blobStorage, PdfService pdfThumbnailService, ImageService imageService)
        {
            _fileRepository = fileRepository;
            _mapper = mapper;
            _pdfService = pdfThumbnailService;
            _blobStorage = blobStorage;
            _imageService = imageService;
        }

        public async Task<List<UnitFileEntity>> GetFilesByPurpose(string purpose)
        {
            var files = (await _fileRepository.GetFiles(purpose)).ToList()?.OrderBy(x => x.FilePath).ToList();            

            if (files == null)
                throw new ArgumentException("No files found");

            var unitFiles = _mapper.Map<List<UnitFileEntity>>(files);

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
            if (_pdfService.IsPdf(fileData))
            {
                var newFileData = _pdfService.CompressPdf(fileData);
                //Only take the optimized image if it is smaller
                if (newFileData.Length < fileData.Length)
                {
                    fileData = newFileData;
                }

                thumbImage = await _pdfService.CreateThumbnailFromPdf(fileData);
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
            var acf = new ArmyCardFile
            {
                ArmyCardId = armyCardId,
                FilePurpose = filePurpose,
                Parent = parentFileId,
                FilePath = filePath
            };

            if (!(await _blobStorage.FileExistsAsync(filePath))) 
            {

                //Upload the file to file storage
                var r = await _blobStorage.UploadAsync(fileData, filePath);
                if (string.IsNullOrEmpty(r))
                {
                    throw new Exception("Unable to upload file.");
                }

                if (!_fileRepository.FileRecordExists(acf))
                {
                    //Save it in the DB
                    var id = await _fileRepository.AddArmyCardFileAsync(acf);

                    if (thumbImage != null)
                    {
                        string fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
                        await AddFileToUnit(armyCardId, $"{filePurpose}_Thumb", $"pdf-thumbnail-{fileNameWithoutExtension}.png", thumbImage, id);
                    }
                }
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

        public async Task<int> RegenerateThumbnailsAsync(List<int> armyCardIds, string filePurpose)
        {
            int updated = 0;

            //Get a list of PDF files
            var files = await _fileRepository.GetFiles(armyCardIds, filePurpose);
            foreach (var file in files)
            {
                //Download the PDF from file storage
                var pdf = file.ParentNavigation;
                var pdfData = await _blobStorage.DownloadAsync(pdf.FilePath);
                if (pdfData != null)
                {
                    //make a new thumbnail from the PDF
                    byte[] thumbImage = await _pdfService.CreateThumbnailFromPdf(pdfData);

                    if (thumbImage != null && thumbImage.Length > 0)
                    {
                        switch (filePurpose)
                        {
                            case "3x5_Army_Card_Thumb":
                            case "Standard_Army_Card_Thumb":
                                thumbImage = _imageService.OptimizeImage(thumbImage, "WEB", null, 300);
                                break;
                            case "4x6_Army_Card_Thumb":
                                thumbImage = _imageService.OptimizeImage(thumbImage, "WEB", 350);
                                break;
                        }

                        
                        string fileNameWithoutExtension = Path.GetFileNameWithoutExtension(pdf.FilePath);
                        var filePath = Path.Combine(GetPathByFilePurpose(filePurpose), $"pdf-thumbnail-{fileNameWithoutExtension}.png");
                        if (await UpdateFileForUnitAsync(file.ArmyCardId, filePurpose, filePath, thumbImage))
                        {
                            if (file.FilePath != filePath)
                            {
                                await _blobStorage.DeleteAsync(file.FilePath);
                                file.FilePath = filePath;
                                await _fileRepository.UpdateArmyCardFileAsync(file);
                            }

                            updated++;
                        }
                    }
                }
            }

            return updated;
        }

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
                case "Card_4x6_Advanced_Image":
                    return "/card-assets/4x6/";
                case "Card_Basic_Image":
                    return "/card-assets/Basic/";
                case "3x5_Army_Card":
                    return "/pdfs/3x5/";
                case "4x6_Army_Card":
                    return "/pdfs/4x6/";
                case "Standard_Army_Card":
                    return "/pdfs/standard/";
                case "Standard_Army_Card_Thumb":
                    return "/thumbs/pdf_thumbs/Standard/";
                case "3x5_Army_Card_Thumb":
                    return "/thumbs/pdf_thumbs/3x5/";
                case "4x6_Army_Card_Thumb":
                    return "/thumbs/pdf_thumbs/4x6/";
                default:
                    return null;
            }
        }
    }
}
