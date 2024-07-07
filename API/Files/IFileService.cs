using API.Tags;
using Microsoft.AspNetCore.Mvc;

namespace API.Files
{
    public interface IFileService
    {
        public Task<List<FileModel>> GetFilesByTags(string[] tags);
        public Task<List<FileModel>> GetAllFiles();
        public Task<FileModel> GetFileById(int id);

        public Task UpdateFile(int id, string[] tags, IFormFile file);

    }
}
