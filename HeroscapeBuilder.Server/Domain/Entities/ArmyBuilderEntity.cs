namespace HeroscapeBuilder.Server.Domain.Entities
{
    public class ArmyBuilderEntity
    {
        /// <summary>The id of this point variation. Results and the journal belong to it.</summary>
        public int Id { get; set; }

        /// <summary>The id of the army's primary version; equal to Id on the primary. Sharing and retiring act on it.</summary>
        public int ArmyId { get; set; }

        /// <summary>Every point variation of this army (this one included), lowest point limit first.</summary>
        public List<ArmyBuilderVariationEntity> Variations { get; set; } = new List<ArmyBuilderVariationEntity>();

        public string Name { get; set; } = null!;

        /// <summary>This variation's own name, if the owner gave it one.</summary>
        public string? VariationLabel { get; set; }

        public int PointLimit { get; set; }

        /// <summary>
        /// The point values this army builder is built with. TotalPoints is measured in it.
        /// </summary>
        public PointSystem PointSystem { get; set; }

        /// <summary>
        /// Null when the army builder can use units from any creator.
        /// </summary>
        public string? Creator { get; set; }

        /// <summary>
        /// Owner's plain-text notes on how to play this army builder. Shown on the public page too.
        /// </summary>
        public string? Notes { get; set; }

        public bool IsShared { get; set; }

        /// <summary>
        /// Only populated for the owner; it is the key of the public link.
        /// </summary>
        public Guid? ShareId { get; set; }

        public int TotalPoints { get; set; }

        public bool IsOwner { get; set; }

        /// <summary>Hidden from the owner's active list; shown in the collapsed Retired section instead.</summary>
        public bool IsRetired { get; set; }

        public DateTime? RetiredAt { get; set; }

        /// <summary>
        /// True when My Army no longer covers the army builder (or a point total no longer fits).
        /// Only evaluated for the owner.
        /// </summary>
        public bool NeedsReview { get; set; }

        public List<string> ReviewReasons { get; set; } = new List<string>();

        public DateTime UpdatedAt { get; set; }

        /// <summary>The owner's logged results with this army. Zero for everyone else.</summary>
        public int Wins { get; set; }

        public int Losses { get; set; }

        public List<ArmyBuilderUnitEntity> Units { get; set; } = new List<ArmyBuilderUnitEntity>();
    }

    /// <summary>A short summary of one point variation, for switching between an army's versions.</summary>
    public class ArmyBuilderVariationEntity
    {
        public int Id { get; set; }

        public string? Label { get; set; }

        public int PointLimit { get; set; }

        public PointSystem PointSystem { get; set; }

        public string? Creator { get; set; }

        public int TotalPoints { get; set; }

        public int UnitCount { get; set; }

        public int Wins { get; set; }

        public int Losses { get; set; }

        public bool NeedsReview { get; set; }
    }

    public class ArmyBuilderUnitEntity
    {
        public UnitEntity Unit { get; set; } = null!;

        public int Quantity { get; set; }

        /// <summary>
        /// How many copies the owner currently has in My Army. Only populated for the owner.
        /// </summary>
        public int OwnedQuantity { get; set; }

        /// <summary>
        /// True when the army builder uses more copies than the owner has in My Army.
        /// </summary>
        public bool OverAllocated { get; set; }
    }
}
