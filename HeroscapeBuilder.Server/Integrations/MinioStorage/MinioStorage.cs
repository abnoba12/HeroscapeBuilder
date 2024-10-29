using HeroscapeBuilder.Server.Integrations.Interfaces;
using Minio.DataModel.Args;
using Minio;
using System.Reactive.Linq;

namespace HeroscapeBuilder.Server.Integrations.MinioStorage
{
    public class MinioStorage : IFileStorage<byte[]>
    {
        private readonly IMinioClient _minioClient;
        private string _bucketName;

        public MinioStorage(string endpoint, string accessKey, string secretKey)
        {
            _minioClient = new MinioClient()
                .WithEndpoint(endpoint)
                .WithCredentials(accessKey, secretKey)
                .Build();
        }

        public string BucketName
        {
            get => _bucketName;
            set => _bucketName = value;
        }

        private void EnsureBucketNameIsSet()
        {
            if (string.IsNullOrWhiteSpace(_bucketName))
                throw new InvalidOperationException("Bucket name is not set. Please set the BucketName property before performing any operations.");
        }

        public async Task<string> UploadAsync(byte[] fileData, string path)
        {
            EnsureBucketNameIsSet();

            using var stream = new MemoryStream(fileData);
            await _minioClient.PutObjectAsync(new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(path)
                .WithStreamData(stream)
                .WithObjectSize(stream.Length)
                .WithContentType("application/octet-stream"));

            // Constructing the URL manually as Endpoint is not directly accessible
            return $"http://{_minioClient.Config.Endpoint}/{_bucketName}/{path}";
        }

        public async Task<byte[]> DownloadAsync(string path)
        {
            EnsureBucketNameIsSet();

            using var memoryStream = new MemoryStream();
            await _minioClient.GetObjectAsync(new GetObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(path)
                .WithCallbackStream(stream => stream.CopyTo(memoryStream)));
            return memoryStream.ToArray();
        }

        public async Task<string> UpdateAsync(byte[] fileData, string path)
        {
            return await UploadAsync(fileData, path);
        }

        public async Task<bool> DeleteAsync(string path)
        {
            EnsureBucketNameIsSet();

            await _minioClient.RemoveObjectAsync(new RemoveObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(path));
            return true;
        }

        public async Task<bool> FileExistsAsync(string path)
        {
            EnsureBucketNameIsSet();

            try
            {
                await _minioClient.StatObjectAsync(new StatObjectArgs()
                    .WithBucket(_bucketName)
                    .WithObject(path));
                return true;
            }
            catch (Minio.Exceptions.ObjectNotFoundException)
            {
                return false;
            }
        }

        public async Task<IEnumerable<IFile>> ListFilesAsync(string directoryPath)
        {
            EnsureBucketNameIsSet();

            var files = new List<IFile>();
            var completionSource = new TaskCompletionSource<bool>();

            var listObjectsArgs = new ListObjectsArgs()
                .WithBucket(_bucketName)
                .WithPrefix(directoryPath)
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
    }
}
