namespace HeroscapeBuilder.Server.Domain.Entities
{
    public class UnitFileEntity
    {
        public long Id { get; set; }

        //public int ArmyCardId { get; set; }

        public string FilePurpose { get; set; } = null!;

        public string FilePath { get; set; } = null!;

        public DateTime CreatedAt { get; set; }
    }
}
