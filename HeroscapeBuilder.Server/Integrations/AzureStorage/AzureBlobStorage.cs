using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs;
using HeroscapeBuilder.Server.Integrations.Interfaces;
using Microsoft.Extensions.Options;

namespace HeroscapeBuilder.Server.Integrations.AzureStorage
{
    public class AzureBlobStorage : IFileStorage<byte[]>
    {
        private readonly BlobServiceClient _blobServiceClient;
        private string _containerName;

        // Constructor that accepts the connection string and a default container name
        public AzureBlobStorage(string connectionString)
        {
            _blobServiceClient = new BlobServiceClient(connectionString);
        }

        // Property to set or get the container name dynamically
        public string ContainerName
        {
            get => _containerName;
            set => _containerName = value;
        }

        // Check if container name is set before each operation
        private void EnsureContainerNameIsSet()
        {
            if (string.IsNullOrWhiteSpace(_containerName))
            {
                throw new InvalidOperationException("Container name is not set. Please set the ContainerName property before performing any operations.");
            }
        }

        public async Task<string> UploadAsync(byte[] fileData, string path)
        {
            EnsureContainerNameIsSet(); // Check container name

            BlobContainerClient containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
            await containerClient.CreateIfNotExistsAsync();

            BlobClient blobClient = containerClient.GetBlobClient(path);

            using var stream = new System.IO.MemoryStream(fileData);
            await blobClient.UploadAsync(stream, true);

            return blobClient.Uri.AbsoluteUri;
        }

        public async Task<byte[]> DownloadAsync(string path)
        {
            EnsureContainerNameIsSet(); // Check container name

            BlobContainerClient containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
            BlobClient blobClient = containerClient.GetBlobClient(path);

            BlobDownloadInfo download = await blobClient.DownloadAsync();
            using var memoryStream = new System.IO.MemoryStream();
            await download.Content.CopyToAsync(memoryStream);
            return memoryStream.ToArray();
        }

        public async Task<string> UpdateAsync(byte[] fileData, string path)
        {
            EnsureContainerNameIsSet(); // Check container name
            return await UploadAsync(fileData, path);
        }

        public async Task<bool> DeleteAsync(string path)
        {
            EnsureContainerNameIsSet(); // Check container name

            BlobContainerClient containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
            BlobClient blobClient = containerClient.GetBlobClient(path);

            var response = await blobClient.DeleteIfExistsAsync();
            return response.Value;
        }

        public async Task<bool> FileExistsAsync(string path)
        {
            EnsureContainerNameIsSet(); // Check container name

            BlobContainerClient containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
            BlobClient blobClient = containerClient.GetBlobClient(path);

            return await blobClient.ExistsAsync();
        }

        public async Task<IEnumerable<IFile>> ListFilesAsync(string directoryPath)
        {
            EnsureContainerNameIsSet(); // Check container name

            var files = new List<IFile>();

            BlobContainerClient containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);

            await foreach (BlobItem blobItem in containerClient.GetBlobsAsync(prefix: directoryPath))
            {
                files.Add(new AzureFile
                {
                    Name = blobItem.Name,
                    MetaData = blobItem.Metadata.ToDictionary(k => k.Key, v => (object)v.Value), // Explicit conversion
                    UpdatedAt = blobItem.Properties.LastModified?.UtcDateTime,
                    CreatedAt = blobItem.Properties.CreatedOn?.UtcDateTime
                });
            }

            return files;
        }
    }
}
