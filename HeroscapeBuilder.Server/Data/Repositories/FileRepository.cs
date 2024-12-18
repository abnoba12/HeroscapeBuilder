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

        public async Task<IEnumerable<ArmyCardFile>> GetFiles(string purpose)
        {
            return await _context.ArmyCardFiles.Include(f => f.InverseParentNavigation).Where(x => x.FilePurpose == purpose).ToListAsync();
        }

        public async Task<IEnumerable<ArmyCardFile>> GetFiles(List<int> armyCardIds, string purpose)
        {
            var find = _context.ArmyCardFiles.Include(f => f.InverseParentNavigation).Include(f => f.ParentNavigation);
            if(armyCardIds.Count == 1 && armyCardIds.First() == -1)
            {
                return await find.Where(x => x.FilePurpose == purpose).ToListAsync();
            }
            else
            {
                return await find
                    .Where(x => x.FilePurpose == purpose)
                    .Where(x => armyCardIds.Contains(x.ArmyCardId))
                    .ToListAsync();
            }
                
        }

        /// <summary>
        /// Save a list of files and return the count of how many files were saved
        /// </summary>
        /// <param name="acfs"></param>
        /// <returns></returns>
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

        /// <summary>
        /// Save a single army card file and get its ID back.
        /// </summary>
        /// <param name="acfs"></param>
        /// <returns></returns>
        public async Task<long> AddArmyCardFileAsync(ArmyCardFile acfs)
        {            
            _context.ArmyCardFiles.Add(acfs);
            await _context.SaveChangesAsync();
            return acfs.Id;
        }

        public async Task<ArmyCardFile> UpdateArmyCardFileAsync(ArmyCardFile acfs)
        {
            // Attach the entity to the context if it's not already tracked
            _context.ArmyCardFiles.Attach(acfs);

            // Mark the entity as modified
            _context.Entry(acfs).State = EntityState.Modified;

            // Save changes
            await _context.SaveChangesAsync();
            return acfs;
        }

        public bool FileRecordExists(ArmyCardFile acf)
        {
            return _context.ArmyCardFiles.Any(x => x.ArmyCardId == acf.ArmyCardId && x.FilePurpose == acf.FilePurpose && x.FilePath == acf.FilePath);
        }
    }
}
