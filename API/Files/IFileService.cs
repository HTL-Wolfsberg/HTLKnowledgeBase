using API.Tags;
using Microsoft.AspNetCore.Mvc;

namespace API.Files
{
    public interface IFileService
    {
        public Task<List<FileModel>> GetAllFiles();
        public Task<List<FileModel>> GetFilesByTags(List<string> tags);
        public Task<List<FileModel>> GetFilesFromUser(string userId);

        public Task<FileModel> GetFileById(Guid id);

        public Task<bool> UpdateFile(FileModel newFile);
        public Task DeleteFile(Guid id);
    }
}
