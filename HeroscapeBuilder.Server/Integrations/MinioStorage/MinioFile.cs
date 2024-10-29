using HeroscapeBuilder.Server.Integrations.Interfaces;

namespace HeroscapeBuilder.Server.Integrations.MinioStorage
{
    public class MinioFile : IFile
    {
        public string? Name { get; set; }
        public string? Owner { get; set; } // Minio does not provide direct owner metadata by default
        public DateTime? UpdatedAt { get; set; }
        public DateTime? CreatedAt { get; set; }  // Minio doesn't support this natively
        public DateTime? LastAccessedAt { get; set; }
        public Dictionary<string, object> MetaData { get; set; } = new Dictionary<string, object>();
    }
}
