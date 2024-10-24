﻿using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Data.Repositories
{
    public class ArmyCardRepository
    {
        private readonly HsbDbContext _context;

        public ArmyCardRepository(HsbDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ArmyCard>> GetAllArmyCards()
        {
            return await _context.ArmyCards
                .Include(x => x.SetNavigation)
                .Include(x => x.ArmyCardAbilities)
                .Include(x => x.ArmyCardFiles)
                .ToListAsync();
        }
    }
}
