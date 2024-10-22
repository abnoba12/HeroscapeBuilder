using HeroscapeBuilder.Server.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Data.Repositories
{
    public class FileRepository
    {
        private readonly HsbDbContext _context;

        public FileRepository(HsbDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ArmyCardFile>> GetFilesByPurposeAsync(string purpose)
        {
            return await _context.ArmyCardFiles.Include(f => f.Children).Where(x => x.FilePurpose == purpose).ToListAsync();
        }

        public async Task<int> AddArmyCardFilesAsync(List<ArmyCardFile> acfs)
        {
            _context.Database.AutoTransactionsEnabled = false;
            int saved = 0;
            foreach (var armyCardFile in acfs)
            {
                _context.ArmyCardFiles.Add(armyCardFile);
                saved += await _context.SaveChangesAsync();
            }
            return saved;
        }

    }
}
