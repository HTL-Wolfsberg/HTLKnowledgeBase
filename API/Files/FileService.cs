
using API.Tags;
using Microsoft.EntityFrameworkCore;
using System.Collections.Immutable;

namespace API.Files
{
    public class FileService : IFileService
    {
        private readonly FileContext _context;
        private readonly ITagService _tagService;
        private readonly ILogger<FileController> _logger;

        public FileService(FileContext context,
            ITagService tagService,
            ILogger<FileController> logger)
        {
            _context = context;
            _tagService = tagService;
            _logger = logger;
        }

        public async Task<List<FileModel>> GetAllFiles()
        {
            return await _context.Files.ToListAsync();
        }

        public async Task<FileModel> GetFileById(int id)
        {
            return await _context.Files.FindAsync(id);
        }

        public async Task<List<FileModel>> GetFilesByTags(string[] tags)
        {
            var filesQuery = _context.Files.Include(f => f.FileTags).ThenInclude(ft => ft.Tag).AsQueryable();

            if (tags != null && tags.Length > 0)
            {
                filesQuery = filesQuery.Where(f => f.FileTags.Any(ft => tags.Contains(ft.Tag.TagName)));
            }

            var files = await filesQuery.ToListAsync();

            files.ForEach(async file =>
            {
                file.TagNameList = (await _tagService.GetTagsForFile(file.Id))
                    .Select(tag => tag.TagName)
                    .ToList();
            });

            _logger.LogInformation("Retrieved {FileCount} files", files.Count);

            return files;
        }

        public Task UpdateFile(int id, string[] tags, IFormFile file)
        {
            throw new NotImplementedException();
        }
    }
}
