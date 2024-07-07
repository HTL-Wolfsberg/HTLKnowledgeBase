using API.Files;
using Microsoft.EntityFrameworkCore;

namespace API.Tags
{
    public class TagService : ITagService
    {
        private readonly FileContext _context;

        public TagService(FileContext context)
        {
            _context = context;
        }

        public async Task<List<string>> GetTags()
        {
            var tagModels = await _context.Tags.ToListAsync();
            var tags = tagModels.Select(tag => tag.TagName).ToList();

            return tags;
        }

        public async Task<List<TagModel>> GetTagsForFile(int fileId)
        {
            return await _context.FileTags
                           .Where(ft => ft.FileId == fileId)
                           .Select(ft => ft.Tag)
                           .ToListAsync();
        }
    }

}
