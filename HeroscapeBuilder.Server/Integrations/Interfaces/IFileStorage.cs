namespace HeroscapeBuilder.Server.Integrations.Interfaces
{
    public interface IFileStorage<TFile>
    {
        // Create or upload a file
        Task<string> UploadAsync(TFile file, string path);

        // Read or download a file
        Task<TFile> DownloadAsync(string path);

        // Update or replace an existing file
        Task<string> UpdateAsync(TFile file, string path);

        // Delete a file
        Task<bool> DeleteAsync(string path);

        // Check if a file exists
        Task<bool> FileExistsAsync(string path);

        // Optionally, you can include a method for listing files in a directory
        Task<IEnumerable<IFile>> ListFilesAsync(string directoryPath);
    }
}
