
using API.Tags;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

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
            var files = _context.Files
                .Include(file => file.FileTags)
                .ThenInclude(fileTag => fileTag.Tag);

            foreach (var file in files)
            {
                file.TagList = file.FileTags
                    .Select(fileTag => fileTag.Tag)
                    .ToList();
            }

            return await files.ToListAsync();
        }

        public async Task<FileModel> GetFileById(int id)
        {
            var file = await _context.Files
                .Include(file => file.FileTags)
                .ThenInclude(fileTag => fileTag.Tag)
                .SingleAsync(file => file.Id == id);


            file.TagList = file.FileTags
                .Select(fileTag => fileTag.Tag)
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
                            .Contains(ft.Tag.Name)));
            }

            foreach (var file in filesQuery)
            {
                file.TagList = file.FileTags
                    .Select(fileTag => fileTag.Tag)
                    .ToList();
            }

            return await filesQuery.ToListAsync();
        }

        public async Task<List<FileModel>> GetFilesFromUser(string userId)
        {
            var files = _context.Files
                .Include(file => file.FileTags)
                .ThenInclude(fileTag => fileTag.Tag)
                .Where(File => File.UserId == userId);

            foreach (var file in files)
            {
                file.TagList = file.FileTags
                    .Select(fileTag => fileTag.Tag)
                    .ToList();
            }

            return await files.ToListAsync();
        }

        public Task UpdateFile(int id, string[] tags, IFormFile file)
        {
            throw new NotImplementedException();
        }

        public async Task DeleteFile(int id)
        {
            var file = await _context.Files.FindAsync(id);
            if (file != null)
            {
                _context.Files.Remove(file);
                await _context.SaveChangesAsync();
            }
        }
    }
}
