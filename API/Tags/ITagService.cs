namespace API.Tags
{
    public interface ITagService
    {
        public Task<IEnumerable<TagModel>> GetTagsAsync();
        public Task<TagModel?> GetTagAsync(int id);
        public Task<TagModel> AddTagAsync(TagModel tag);
        public Task<bool> UpdateTagAsync(int id, TagModel tag);
        public Task<bool> DeleteTagAsync(int id);
        public Task<int> GetFileCountForTagAsync(int tagId);
    }
}
