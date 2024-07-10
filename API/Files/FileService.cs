
using API.Tags;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Collections.Immutable;
using System.Security.Claims;

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

        public async Task<IEnumerable<FileModel>> GetAllFiles()
        {
            var files = await _context.Files
                .Include(file => file.FileTags)
                .ThenInclude(fileTag => fileTag.Tag)
                .ToListAsync();

            foreach (var file in files)
            {
                file.TagNameList = file.FileTags
                    .Select(fileTag => fileTag.Tag.TagName)
                    .ToList();
            }

            return files;
        }

        public async Task<FileModel> GetFileById(int id)
        {
            var file = await _context.Files
                .Include(file => file.FileTags)
                .ThenInclude(fileTag => fileTag.Tag)
                .FirstAsync(file => file.Id == id);

            file.TagNameList = file.FileTags
                .Select(fileTag => fileTag.Tag.TagName)
                .ToList();

            return file;
        }

        public async Task<List<FileModel>> GetFilesByTags(List<string> tags)
        {
            var filesQuery = _context.Files
                .Include(file => file.FileTags)
                .ThenInclude(fileTag => fileTag.Tag)
                .AsQueryable();

            if (tags != null && tags.Count > 0)
            {
                filesQuery = filesQuery
                    .Where(f => f.FileTags
                        .Any(ft => tags
                            .Contains(ft.Tag.TagName)));
            }

            var files = await filesQuery.ToListAsync();

            foreach (var file in files)
            {
                file.TagNameList = file.FileTags
                    .Select(fileTag => fileTag.Tag.TagName)
                    .ToList();
            }

            _logger.LogInformation("Retrieved {FileCount} files", files.Count);

            return files;
        }

        [Authorize]
        public IQueryable<FileModel> GetFilesFromUser(string userId)
        {
            var files = _context.Files
                .Include(file => file.FileTags)
                .ThenInclude(fileTag => fileTag.Tag)
                .Where(File => File.UserId == userId);

            foreach (var file in files)
            {
                file.TagNameList = file.FileTags
                    .Select(fileTag => fileTag.Tag.TagName)
                    .ToList();
            }

            return files;
        }

        public Task UpdateFile(int id, string[] tags, IFormFile file)
        {
            throw new NotImplementedException();
        }
    }
}
