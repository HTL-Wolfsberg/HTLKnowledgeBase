namespace API.Tags
{
    public interface ITagService
    {
        Task<List<string>> GetTags();
    }
}
