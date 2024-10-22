using AutoMapper;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Integrations.AzureStorage;

namespace HeroscapeBuilder.Server.Services
{
    public class FileService
    {
        private readonly FileRepository _fileRepository;
        private readonly IMapper _mapper;
        private readonly PdfThumbnailService _pdfThumbnailService;
        private readonly AzureBlobStorage _azureBlobStorage;

        public FileService(FileRepository fileRepository, IMapper mapper, AzureBlobStorage azureBlobStorage, PdfThumbnailService pdfThumbnailService)
        {
            _fileRepository = fileRepository;
            _mapper = mapper;
            _pdfThumbnailService = pdfThumbnailService;
            _azureBlobStorage = azureBlobStorage;
        }

        public async Task<List<UnitFileEntity>> GetFilesByPurpose(string purpose)
        {
            //TODO: this is getting called twice and causing two thumbnails to be created. This needs to be fixed

            var files = (await _fileRepository.GetFilesByPurposeAsync(purpose)).ToList()?.OrderBy(x => x.FilePath).ToList();            

            if (files == null)
                throw new ArgumentException("No files found");

            var unitFiles = _mapper.Map<List<UnitFileEntity>>(files);

            var pdfThumbs = new List<string> { "Standard_Army_Card", "3x5_Army_Card", "4x6_Army_Card" };
            if (pdfThumbs.Contains(purpose))
            {
                //Files missing thumbs
                var filesMissingThumbs = unitFiles.Where(x => string.IsNullOrEmpty(x.Thumb)).ToList();
                List<ArmyCardFile> acfs = [];

                foreach (var pdf in filesMissingThumbs) { 
                    //Generate the Thumb
                    var thumb = await _pdfThumbnailService.CreatePdfThumbnailAsync(pdf.FilePath);
                    string fileNameWithoutExtension = Path.GetFileNameWithoutExtension(pdf.FilePath);

                    //Save the image to supabase
                    _azureBlobStorage.ContainerName = "thumbs";
                    var r = await _azureBlobStorage.UploadAsync(thumb, $"pdf_thumbs/pdf-thumbnail-{fileNameWithoutExtension}.png");
                    if (!string.IsNullOrEmpty(r))
                    {
                        acfs.Add(new ArmyCardFile
                        {
                            ArmyCardId = pdf.ArmyCardId,
                            FilePurpose = $"{purpose}_Thumb",
                            ParentId = pdf.Id,
                            FilePath = r
                        });
                    }
                };

                if (acfs.Count != 0)
                {
                    //Add record of thumb to the DB
                    await _fileRepository.AddArmyCardFilesAsync(acfs);
                }
            }

            return unitFiles;
        }
    }
}
