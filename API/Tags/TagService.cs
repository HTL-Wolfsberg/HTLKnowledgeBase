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

        public async Task<IEnumerable<TagModel>> GetTagsAsync()
        {
            return await _context.Tags.ToListAsync();
        }

        public async Task<TagModel> AddTagAsync(TagModel tag)
        {
            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();

            return tag;
        }

        public async Task<TagModel?> GetTagAsync(int id)
        {
            return await _context.Tags.FindAsync(id);
        }

        public async Task<bool> UpdateTagAsync(int id, TagModel tag)
        {
            if (id != tag.Id)
            {
                return false;
            }

            _context.Entry(tag).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TagExists(id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }
        }

        public async Task<bool> DeleteTagAsync(int id)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null)
            {
                return false;
            }

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<int> GetFileCountForTagAsync(int tagId)
        {
            return await _context.FileTags.CountAsync(ft => ft.TagId == tagId);
        }

        private bool TagExists(int id)
        {
            return _context.Tags.Any(e => e.Id == id);
        }
    }
}
