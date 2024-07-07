namespace API.Tags
{
    public interface ITagService
    {
        Task<List<string>> GetTags();
        public Task<List<TagModel>> GetTagsForFile(int fileId);
    }
}
