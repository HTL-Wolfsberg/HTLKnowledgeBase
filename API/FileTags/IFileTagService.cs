using API.Files;

namespace API.FileTags
{
    public interface IFileTagService
    {
        public Task AddFileTag(string[] tags, FileModel fileModel);
    }
}
