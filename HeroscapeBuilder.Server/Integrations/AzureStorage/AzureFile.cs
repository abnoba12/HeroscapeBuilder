using HeroscapeBuilder.Server.Integrations.Interfaces;

namespace HeroscapeBuilder.Server.Integrations.AzureStorage
{
    public class AzureFile : IFile
    {
        public string? Name { get; set; }
        public string? Owner { get; set; } // Not directly available from Azure
        public DateTime? UpdatedAt { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? LastAccessedAt { get; set; }
        public Dictionary<string, object> MetaData { get; set; } = new Dictionary<string, object>();
    }
}
