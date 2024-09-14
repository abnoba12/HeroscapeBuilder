using Newtonsoft.Json;
using Supabase.Storage;

namespace HeroscapeBuilder.Server.Integrations.SupabaseIntegration.DTO
{
    public class SupabaseFileDTO
    {
        public string? Name { get; set; }

        public string? BucketId { get; set; }

        public string? Owner { get; set; }

        public string? Id { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? LastAccessedAt { get; set; }

        public Dictionary<string, object> MetaData = new Dictionary<string, object>();

        public Bucket? Buckets { get; set; }
    }
}
