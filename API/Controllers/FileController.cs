using API.Data;
using API.Models;
using Azure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class FileController : ControllerBase
{
    private readonly FileContext _context;
    private readonly ILogger<FileController> _logger;

    public FileController(FileContext context, ILogger<FileController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> UploadFile([FromQuery] string[] tags, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            _logger.LogWarning("No file uploaded.");
            return BadRequest("No file uploaded.");
        }

        var documentsFolderPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "HTLKnowledgeBase", "Files");

        if (!Directory.Exists(documentsFolderPath))
        {
            Directory.CreateDirectory(documentsFolderPath);
        }

        var filePath = Path.Combine(documentsFolderPath, file.FileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var fileModel = new FileModel
        {
            FileName = file.FileName,
            FilePath = filePath,
            FileSize = file.Length,
            FileType = file.ContentType,
            FileTags = new List<FileTagModel>()
        };

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

        _logger.LogInformation("File uploaded successfully: {FileName}", fileModel.FileName);

        return Ok(new { fileModel.Id, fileModel.FileName, fileModel.FileTags });
    }

    [HttpGet]
    public async Task<IActionResult> GetFiles([FromQuery] string[] tags)
    {
        var filesQuery = _context.Files.Include(f => f.FileTags).ThenInclude(ft => ft.Tag).AsQueryable();

        if (tags != null && tags.Length > 0)
        {
            filesQuery = filesQuery.Where(f => f.FileTags.Any(ft => tags.Contains(ft.Tag.TagName)));
        }

        var files = await filesQuery.ToListAsync();

        _logger.LogInformation("Retrieved {FileCount} files", files.Count);

        return Ok(files);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> DownloadFile(int id)
    {
        var file = await _context.Files.FindAsync(id);
        if (file == null)
        {
            _logger.LogWarning("File not found: {FileId}", id);
            return NotFound();
        }

        var memory = new MemoryStream();
        using (var stream = new FileStream(file.FilePath, FileMode.Open))
        {
            await stream.CopyToAsync(memory);
        }
        memory.Position = 0;

        _logger.LogInformation("File downloaded: {FileName}", file.FileName);

        return File(memory, file.FileType);
    }






    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFile(int id, [FromQuery] string[] tags, IFormFile file)
    {
        var fileModel = await _context.Files.Include(f => f.FileTags).ThenInclude(ft => ft.Tag).FirstOrDefaultAsync(f => f.Id == id);
        if (fileModel == null)
        {
            _logger.LogWarning("File not found: {FileId}", id);
            return NotFound();
        }

        if (file != null)
        {
            var filePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "HTLKnowledgeBase", "Files", file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            fileModel.FileName = file.FileName;
            fileModel.FilePath = filePath;
            fileModel.FileSize = file.Length;
            fileModel.FileType = file.ContentType;
        }

        if (tags != null && tags.Length > 0)
        {
            fileModel.FileTags.Clear();
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
        }

        _context.Files.Update(fileModel);
        await _context.SaveChangesAsync();

        _logger.LogInformation("File updated: {FileName}", fileModel.FileName);

        return Ok(fileModel);
    }
}
