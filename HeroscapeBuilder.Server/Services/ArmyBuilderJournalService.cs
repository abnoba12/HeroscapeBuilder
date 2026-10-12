using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Domain.Exceptions;

namespace HeroscapeBuilder.Server.Services
{
    /// <summary>
    /// The owner's private play journal for an army: dated notes on what went well and what went poorly.
    /// </summary>
    public class ArmyBuilderJournalService
    {
        private const int MaxFieldLength = 4000;
        private const int MaxEntriesPerArmy = 500;

        private readonly ArmyBuilderRepository _armyBuilderRepository;

        public ArmyBuilderJournalService(ArmyBuilderRepository armyBuilderRepository)
        {
            _armyBuilderRepository = armyBuilderRepository;
        }

        public async Task<List<JournalEntryEntity>> GetJournal(Guid userId, int armyBuilderId)
        {
            await EnsureOwner(userId, armyBuilderId);

            return (await _armyBuilderRepository.GetJournal(armyBuilderId))
                .Select(ToEntity)
                .ToList();
        }

        public async Task<JournalEntryEntity> AddEntry(Guid userId, int armyBuilderId, JournalEntryRequest request)
        {
            await EnsureOwner(userId, armyBuilderId);

            var (wentWell, wentPoorly, notes) = Validate(request);
            if ((await _armyBuilderRepository.GetJournal(armyBuilderId)).Count >= MaxEntriesPerArmy)
            {
                throw new ArmyBuilderException(ArmyBuilderErrorKind.Validation, $"An army can have at most {MaxEntriesPerArmy} journal entries.");
            }

            var now = DateTime.UtcNow;
            var entry = new ArmyBuilderJournalEntry
            {
                ArmyBuilderId = armyBuilderId,
                EntryDate = request.EntryDate ?? DateOnly.FromDateTime(now),
                WentWell = wentWell,
                WentPoorly = wentPoorly,
                Notes = notes,
                CreatedAt = now,
                UpdatedAt = now,
            };

            _armyBuilderRepository.AddJournalEntry(entry);
            await _armyBuilderRepository.SaveChanges();

            return ToEntity(entry);
        }

        public async Task<JournalEntryEntity> UpdateEntry(Guid userId, int entryId, JournalEntryRequest request)
        {
            var entry = await _armyBuilderRepository.GetJournalEntry(userId.ToString(), entryId) ?? throw EntryNotFound();

            var (wentWell, wentPoorly, notes) = Validate(request);

            entry.EntryDate = request.EntryDate ?? entry.EntryDate;
            entry.WentWell = wentWell;
            entry.WentPoorly = wentPoorly;
            entry.Notes = notes;
            entry.UpdatedAt = DateTime.UtcNow;

            await _armyBuilderRepository.SaveChanges();
            return ToEntity(entry);
        }

        public async Task DeleteEntry(Guid userId, int entryId)
        {
            var entry = await _armyBuilderRepository.GetJournalEntry(userId.ToString(), entryId) ?? throw EntryNotFound();

            _armyBuilderRepository.RemoveJournalEntry(entry);
            await _armyBuilderRepository.SaveChanges();
        }

        private async Task EnsureOwner(Guid userId, int armyBuilderId)
        {
            if (!await _armyBuilderRepository.OwnsArmyBuilder(userId.ToString(), armyBuilderId))
            {
                throw new ArmyBuilderException(ArmyBuilderErrorKind.NotFound, "Army not found.");
            }
        }

        // A tuple, not a nested type: everything in this namespace is auto-registered with DI (see RegisterService).
        private static (string? WentWell, string? WentPoorly, string? Notes) Validate(JournalEntryRequest request)
        {
            var wentWell = Clean(request.WentWell);
            var wentPoorly = Clean(request.WentPoorly);
            var notes = Clean(request.Notes);

            var errors = new List<string>();
            if (wentWell == null && wentPoorly == null && notes == null)
            {
                errors.Add("Write something in at least one of the journal fields.");
            }

            foreach (var (label, value) in new[] { ("What went well", wentWell), ("What went poorly", wentPoorly), ("Notes", notes) })
            {
                if (value?.Length > MaxFieldLength)
                {
                    errors.Add($"{label} can be at most {MaxFieldLength} characters (currently {value.Length}).");
                }
            }

            if (request.EntryDate > DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)))
            {
                errors.Add("A journal entry cannot be dated in the future.");
            }

            if (errors.Count > 0)
            {
                throw new ArmyBuilderException(ArmyBuilderErrorKind.Validation, errors.ToArray());
            }

            return (wentWell, wentPoorly, notes);
        }

        private static string? Clean(string? value)
        {
            return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
        }

        private static JournalEntryEntity ToEntity(ArmyBuilderJournalEntry entry)
        {
            return new JournalEntryEntity
            {
                Id = entry.Id,
                EntryDate = entry.EntryDate,
                WentWell = entry.WentWell,
                WentPoorly = entry.WentPoorly,
                Notes = entry.Notes,
                UpdatedAt = entry.UpdatedAt,
            };
        }

        private static ArmyBuilderException EntryNotFound()
        {
            return new ArmyBuilderException(ArmyBuilderErrorKind.NotFound, "Journal entry not found.");
        }
    }
}
