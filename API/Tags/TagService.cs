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
            return await _context.Tags
                .Select(tag => tag.TagName)
                .ToListAsync();
        }
    }
}
