using HeroscapeBuilder.Server.Common.Helpers;

namespace HeroscapeBuilder.Server.Domain.Entities
{
    public class UnitEntity
    {
        [TransformCase(Case = "Upper")]
        public string Creator { get; set; } = null!;

        [TransformCase(Case = "Capitalize")]
        public string? General { get; set; }

        [TransformCase(Case = "Title")]
        public string? Name { get; set; }

        [TransformCase(Case = "Capitalize")]
        public string? Race { get; set; }

        [TransformCase(Case = "Capitalize")]
        public string? Role { get; set; }

        [TransformCase(Case = "Capitalize")]
        public string? Personality { get; set; }

        [TransformCase(Case = "Capitalize")]
        public string? Rarity { get; set; }

        [TransformCase(Case = "Capitalize")]
        public string? Type { get; set; }

        [TransformCase(Case = "Capitalize")]
        public string? SizeCategory { get; set; }

        public long? Size { get; set; }

        public long? Life { get; set; }

        public long? AdvMove { get; set; }

        public long? AdvRange { get; set; }

        public long? AdvAttack { get; set; }

        public long? AdvDefense { get; set; }

        public long? Points { get; set; }

        public long? BasicMove { get; set; }

        public long? BasicRange { get; set; }

        public long? BasicAttack { get; set; }

        public long? BasicDefense { get; set; }

        [TransformCase(Case = "Title")]
        public string? Planet { get; set; }

        public string? UnitNumbers { get; set; }

        public int Id { get; set; }

        public SetEntity? Set { get; set; }

        public string? Note { get; set; }

        public List<AbilityEntity> Abilities { get; set; } = new List<AbilityEntity>();

        public virtual ICollection<UnitFileEntity> Files { get; set; } = new List<UnitFileEntity>();
    }
}
