namespace HeroscapeBuilder.Server.Domain.Entities
{
    public class SetEntity
    {
        public long Id { get; set; }

        public string Creator { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string? Wave { get; set; }

        public DateOnly? ReleaseDate { get; set; }

        public DateTime CreatedAt { get; set; }

        public string? Type { get; set; }

        public long? UnitsInSet { get; set; }
    }
}
