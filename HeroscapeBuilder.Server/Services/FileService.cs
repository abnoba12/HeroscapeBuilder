using AutoMapper;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;
using System.Transactions;

namespace HeroscapeBuilder.Server.Services
{
    public class FileService
    {
        private readonly FileRepository _fileRepository;
        private readonly IMapper _mapper;

        public FileService(FileRepository fileRepository, IMapper mapper)
        {
            _fileRepository = fileRepository;
            _mapper = mapper;
        }

        public async Task<List<UnitFileEntity>> GetFilesByPurpose(string purpose)
        {
            var files = (await _fileRepository.GetFilesByPurposeAsync(purpose)).ToList()?.OrderBy(x => x.FilePath).ToList();

            if (files == null)
                throw new ArgumentException("No files found");

            return _mapper.Map<List<UnitFileEntity>>(files);
        }
    }
}
