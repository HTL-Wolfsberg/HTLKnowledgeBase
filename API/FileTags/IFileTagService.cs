using API.Files;
using API.Tags;

namespace API.FileTags
{
    public interface IFileTagService
    {
        public Task AddFileTag(List<TagModel> tags, FileModel fileModel);
    }
}
