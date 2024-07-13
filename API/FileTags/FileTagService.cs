
using API.Files;
using API.Tags;
using Microsoft.EntityFrameworkCore;

namespace API.FileTags
{
    public class FileTagService : IFileTagService
    {
        private readonly FileContext _context;

        public FileTagService(FileContext fileContext)
        {
            _context = fileContext;
        }

        public async Task AddFileTag(List<TagModel> tags, FileModel fileModel)
        {
            var tagIds = tags.Select(t => t.Id).ToList();
            var existingTags = await _context.Tags
                .Where(t => tagIds.Contains(t.Id))
                .ToListAsync();

            foreach (var tag in existingTags)
            {
                fileModel.FileTags.Add(new FileTagModel { Tag = tag, File = fileModel });
            }

            _context.Files.Add(fileModel);
            await _context.SaveChangesAsync();
        }
    }
}
