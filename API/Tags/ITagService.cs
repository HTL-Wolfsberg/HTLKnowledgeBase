namespace API.Tags
{
    public interface ITagService
    {
        public Task<IEnumerable<TagModel>> GetTagsAsync();
        public Task<TagModel?> GetTagAsync(Guid id);
        public Task<TagModel> AddTagAsync(TagModel tag);
        public Task<bool> UpdateTagAsync(Guid id, TagModel tag);
        public Task<bool> DeleteTagAsync(Guid id);
        public Task<int> GetFileCountForTagAsync(Guid tagId);
    }
}
