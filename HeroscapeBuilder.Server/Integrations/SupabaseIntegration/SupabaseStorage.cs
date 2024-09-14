using AutoMapper;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Integrations.SupabaseIntegration.DTO;
using Microsoft.Extensions.Options;

namespace HeroscapeBuilder.Server.Integrations.SupabaseIntegration
{
    public class SupabaseStorage
    {
        private readonly HttpClient _client;
        private readonly SupabaseConfig _supabaseConfig;
        private readonly Supabase.Client _supabaseClient;
        private readonly IMapper _mapper;

        public SupabaseStorage(HttpClient client, IOptions<SupabaseConfig> supabaseConfig, IMapper mapper)
        {
            _client = client;
            _supabaseConfig = supabaseConfig.Value;
            _mapper = mapper;

            _supabaseClient = new Supabase.Client(_supabaseConfig.Url, _supabaseConfig.ServiceKey, new Supabase.SupabaseOptions
            {
                AutoConnectRealtime = true
            });
            _supabaseClient.InitializeAsync().GetAwaiter().GetResult();
        }

        public async Task ListBuckets()
        {
            // Access storage functionality
            var storage = _supabaseClient.Storage;

            // List buckets
            var response = await storage.ListBuckets();

            if (response != null)
            {
                foreach (var bucket in response)
                {
                    Console.WriteLine($"Bucket Name: {bucket.Name}");
                }
            }
            else
            {
                Console.WriteLine("No buckets found or there was an error retrieving the list.");
            }
        }

        // Use the injected Supabase URL in your requests
        public async Task<List<SupabaseFileDTO>> GetFilesFromFolderAsync(string bucketId, string folderPath)
        {
            List<Supabase.Storage.FileObject> files = await _supabaseClient.Storage.From(bucketId).List(folderPath);
            return _mapper.Map<List<SupabaseFileDTO>>(files);
        }

        public async Task<byte[]> DownloadFileAsync(string bucketId, string folderPath, string fileName)
        {
            return await _supabaseClient.Storage.From(bucketId).Download($"{folderPath}/{fileName}", null);
        }

        public async Task<string> UploadFileAsync(string bucketId, string folderPath, string fileName, byte[] fileData)
        {
            var imagePath = Path.Combine(folderPath, fileName);
            var r = await _supabaseClient.Storage
              .From(bucketId)
              .Upload(fileData, imagePath, new Supabase.Storage.FileOptions { CacheControl = "604800", Upsert = true }, null);

            return r;
        }
    }
}
