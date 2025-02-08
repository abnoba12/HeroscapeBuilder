using HeroscapeBuilder.Server.Integrations.Interfaces;
using Minio.DataModel.Args;
using Minio;
using System.Reactive.Linq;

namespace HeroscapeBuilder.Server.Integrations.MinioStorage
{
    public class MinioStorage : IFileStorage<byte[]>
    {
        private readonly IMinioClient _minioClient;

        public MinioStorage(string endpoint, string accessKey, string secretKey)
        {
            _minioClient = new MinioClient()
                .WithEndpoint(endpoint)
                .WithCredentials(accessKey, secretKey)
                .Build()
                .WithSSL(true);
        }

        public async Task<string> UploadAsync(byte[] fileData, string path)
        {
            var bucketName = GetBucketName(path);
            path = path.Replace($"/{bucketName}/", "");

            using var stream = new MemoryStream(fileData);
            await _minioClient.PutObjectAsync(new PutObjectArgs()
                .WithBucket(bucketName)
                .WithObject(path)
                .WithStreamData(stream)
                .WithObjectSize(stream.Length)
                .WithContentType("application/octet-stream"));

            // Constructing the URL manually as Endpoint is not directly accessible
            return $"/{bucketName}{path}";
        }

        public async Task<byte[]> DownloadAsync(string path)
        {
            var bucketName = GetBucketName(path);
            path = path.Replace($"/{bucketName}/", "");

            using var memoryStream = new MemoryStream();
            await _minioClient.GetObjectAsync(new GetObjectArgs()
                .WithBucket(bucketName)
                .WithObject(path)
                .WithCallbackStream(stream => stream.CopyTo(memoryStream)));
            return memoryStream.ToArray();
        }

        public async Task<string> UpdateAsync(byte[] fileData, string path)
        {
            return await UploadAsync(fileData, path);
        }

        public async Task<bool> DeleteAsync(string oPath)
        {
            // Extract the bucket name
            var bucketName = GetBucketName(oPath);

            // Remove the bucket name from the path
            var path = oPath.Replace($"/{bucketName}/", "");

            if (await FileExistsAsync(oPath))
            {
                // Ensure the path is not empty
                if (string.IsNullOrWhiteSpace(path))
                    throw new ArgumentException("Invalid path: Path must specify an object to delete.", nameof(path));

                // Delete the object from the bucket
                await _minioClient.RemoveObjectAsync(new RemoveObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject(path));
                return true;
            }
            return false;
        }


        public async Task<bool> FileExistsAsync(string path)
        {
            var bucketName = GetBucketName(path);
            path = path.Replace($"/{bucketName}/", "");

            try
            {
                var file = await _minioClient.StatObjectAsync(new StatObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject(path));
                return file.Size > 0;
            }
            catch (Minio.Exceptions.ObjectNotFoundException)
            {
                return false;
            }
        }

        public async Task<IEnumerable<IFile>> ListFilesAsync(string path)
        {
            var bucketName = GetBucketName(path);
            path = path.Replace($"/{bucketName}/", "");

            var files = new List<IFile>();
            var completionSource = new TaskCompletionSource<bool>();

            var listObjectsArgs = new ListObjectsArgs()
                .WithBucket(bucketName)
                .WithPrefix(path)
                .WithRecursive(false);

            var observable = _minioClient.ListObjectsAsync(listObjectsArgs);

            observable.Subscribe(
                item =>
                {
                    files.Add(new MinioFile
                    {
                        Name = item.Key,
                        MetaData = new Dictionary<string, object> { { "Size", item.Size } },
                        UpdatedAt = item.LastModifiedDateTime
                    });
                },
                ex =>
                {
                    completionSource.TrySetException(ex); // Signal completion with an error
                },
                () =>
                {
                    completionSource.TrySetResult(true); // Signal successful completion
                }
            );

            await completionSource.Task; // Wait until the subscription is complete
            return files;
        }

        public string PathCombine(IEnumerable<string> pathParts)
        {

            return string.Join("/", pathParts.Select(p => p.Replace("\\", "/").Trim('/')));
        }

        private string GetBucketName(string path)
        {
            var parts = path.Split('/').Where(x => !string.IsNullOrEmpty(x)).ToList();
            if (parts.Count > 0)
            {
                return parts.First();
            }
            else
            {
                throw new ArgumentException("Unable to determine file path");
            }
        }
    }
}
