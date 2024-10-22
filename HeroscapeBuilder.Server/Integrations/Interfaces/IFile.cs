using Supabase.Storage;

namespace HeroscapeBuilder.Server.Integrations.Interfaces
{
    public interface IFile
    {
        public string? Name { get; set; }

        public string? Owner { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? LastAccessedAt { get; set; }

        public Dictionary<string, object> MetaData { get; set; }
    }
}
