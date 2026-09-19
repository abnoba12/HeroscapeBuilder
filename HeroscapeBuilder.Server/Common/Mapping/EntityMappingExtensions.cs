using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Domain.Entities;

namespace HeroscapeBuilder.Server.Common.Mapping
{
    /// <summary>
    /// Maps EF Core entities to the domain entities returned by the API.
    /// </summary>
    public static class EntityMappingExtensions
    {
        public static UnitEntity ToUnitEntity(this ArmyCard source)
        {
            var dest = new UnitEntity
            {
                Id = source.Id,
                Creator = source.Creator,
                General = source.General,
                Name = source.Name,
                Race = source.Race,
                Role = source.Role,
                Personality = source.Personality,
                Rarity = source.Rarity,
                Type = source.Type,
                SizeCategory = source.SizeCategory,
                Size = source.Size,
                Life = source.Life,
                AdvMove = source.AdvMove,
                AdvRange = source.AdvRange,
                AdvAttack = source.AdvAttack,
                AdvDefense = source.AdvDefense,
                Points = source.Points,
                BasicMove = source.BasicMove,
                BasicRange = source.BasicRange,
                BasicAttack = source.BasicAttack,
                BasicDefense = source.BasicDefense,
                Planet = source.Planet,
                UnitNumbers = source.UnitNumbers,
                Note = source.Note,
                Set = source.SetNavigation?.ToSetEntity(),
                Abilities = source.ArmyCardAbilities.Select(ability => ability.ToAbilityEntity()).ToList(),
                Files = source.ArmyCardFiles.Select(file => file.ToUnitFileEntity()).ToList(),
                StlUrls = source.ArmyCardStls
                    .OrderBy(stl => stl.StlUrl)
                    .Select(stl => stl.StlUrl)
                    .ToList(),
            };

            TransformCaseHelper.ApplyTransformations(dest);
            return dest;
        }

        public static AbilityEntity ToAbilityEntity(this ArmyCardAbility source)
        {
            var dest = new AbilityEntity
            {
                Id = source.Id,
                ArmyCardId = source.ArmyCardId,
                AbilityName = source.AbilityName,
                Ability = source.Ability,
            };

            TransformCaseHelper.ApplyTransformations(dest);
            return dest;
        }

        public static UnitFileEntity ToUnitFileEntity(this ArmyCardFile source)
        {
            var dest = new UnitFileEntity
            {
                Id = source.Id,
                ArmyCardId = source.ArmyCardId,
                UnitName = source.ArmyCard?.Name,
                Creator = source.ArmyCard?.Creator,
                FilePurpose = source.FilePurpose,
                FilePath = source.FilePath,
                Thumb = source.InverseParentNavigation
                    .FirstOrDefault(x => x.FilePurpose.Contains("Thumb"))?.FilePath,
                CreatedAt = source.CreatedAt,
            };

            TransformCaseHelper.ApplyTransformations(dest);
            return dest;
        }

        public static SetEntity ToSetEntity(this Set source)
        {
            return new SetEntity
            {
                Id = source.Id,
                Creator = source.Creator,
                Name = source.Name,
                Wave = source.Wave,
                ReleaseDate = source.ReleaseDate,
                CreatedAt = source.CreatedAt,
                Type = source.Type,
                UnitsInSet = source.UnitsInSet,
            };
        }
    }
}
