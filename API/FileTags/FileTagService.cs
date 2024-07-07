
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

        public async Task AddFileTag(string[] tags, FileModel fileModel)
        {
            foreach (var tagName in tags)
            {
                var tag = await _context.Tags.FirstOrDefaultAsync(t => t.TagName == tagName.Trim());
                if (tag == null)
                {
                    tag = new TagModel { TagName = tagName.Trim() };
                    _context.Tags.Add(tag);
                }

                fileModel.FileTags.Add(new FileTagModel { Tag = tag, File = fileModel });
            }

            _context.Files.Add(fileModel);
            await _context.SaveChangesAsync();
        }
    }
}
