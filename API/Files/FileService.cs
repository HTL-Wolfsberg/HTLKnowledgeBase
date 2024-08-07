﻿using API.FileTags;
using API.Tags;
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

        public async Task<FileModel> GetFileById(Guid id)
        {
            var file = await _context.Files
                .Include(file => file.FileTags)
                .ThenInclude(fileTag => fileTag.Tag)
                .SingleOrDefaultAsync(file => file.Id == id);

            if (file != null)
            {
                file.TagList = file.FileTags
                    .Select(fileTag => fileTag.Tag)
                    .ToList();
            }

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

            var files = await filesQuery.ToListAsync();

            foreach (var file in files)
            {
                file.TagList = file.FileTags
                    .Select(fileTag => fileTag.Tag)
                    .ToList();
            }

            return files;
        }


        public async Task<List<FileModel>> GetFilesFromUser(string userId)
        {
            var files = await _context.Files
                .Include(file => file.FileTags)
                .ThenInclude(fileTag => fileTag.Tag)
                .Where(File => File.AuthorId == userId)
                .ToListAsync();

            foreach (var file in files)
            {
                file.TagList = file.FileTags
                    .Select(fileTag => fileTag.Tag)
                    .ToList();
            }

            return files;
        }


        public async Task DeleteFile(Guid id)
        {
            var file = await _context.Files.FindAsync(id);
            if (file != null)
            {
                _context.Files.Remove(file);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> UpdateFile(FileModel newFile)
        {
            var existingFile = await _context.Files
                .Include(f => f.FileTags)
                .ThenInclude(ft => ft.Tag)
                .FirstOrDefaultAsync(f => f.Id == newFile.Id);

            if (existingFile == null)
            {
                return false;
            }

            existingFile.Name = newFile.Name;
            existingFile.LastChanged = DateTime.UtcNow;

            // Clear existing tags
            _context.FileTags.RemoveRange(existingFile.FileTags);

            // Add new tags
            foreach (var tag in newFile.TagList)
            {
                existingFile.FileTags.Add(new FileTagModel { FileId = existingFile.Id, TagId = tag.Id });
            }

            await _context.SaveChangesAsync();

            return true;
        }

    }
}
