using HeroscapeBuilder.Server.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Data.Repositories
{
    public class FileRepository
    {
        private readonly SupabaseDbContext _context;

        public FileRepository(SupabaseDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ArmyCardFile>> GetFilesByPurposeAsync(string purpose)
        {
            return await _context.ArmyCardFiles.Include(f => f.Children).Where(x => x.FilePurpose == purpose).ToListAsync();
        }
    }
}
