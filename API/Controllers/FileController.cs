using API.Data;
using API.Models;
using Azure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class FileController : ControllerBase
{
    private readonly FileContext _context;

    public FileController(FileContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> UploadFile([FromQuery] string tags, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

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
            FileTags = tags.Split(',').Select(tagName => new FileTagModel
            {
                Tag = new TagModel { TagName = tagName.Trim() }
            }).ToList()
        };

        _context.Files.Add(fileModel);
        await _context.SaveChangesAsync();

        return Ok(new { fileModel.Id, fileModel.FileName, fileModel.FileTags });
    }

    [HttpGet]
    public async Task<IActionResult> GetFiles([FromQuery] string tags)
    {
        var filesQuery = _context.Files.Include(f => f.FileTags).ThenInclude(ft => ft.Tag).AsQueryable();

        if (!string.IsNullOrEmpty(tags))
        {
            var tagList = tags.Split(',').Select(tag => tag.Trim()).ToList();
            filesQuery = filesQuery.Where(f => f.FileTags.Any(ft => tagList.Contains(ft.Tag.TagName)));
        }

        var files = await filesQuery.ToListAsync();

        return Ok(files);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> DownloadFile(int id)
    {
        var file = await _context.Files.FindAsync(id);
        if (file == null)
            return NotFound();

        var memory = new MemoryStream();
        using (var stream = new FileStream(file.FilePath, FileMode.Open))
        {
            await stream.CopyToAsync(memory);
        }
        memory.Position = 0;

        return File(memory, file.FileType, file.FileName);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFile(int id, [FromQuery] string tags, IFormFile file)
    {
        var fileModel = await _context.Files.Include(f => f.FileTags).ThenInclude(ft => ft.Tag).FirstOrDefaultAsync(f => f.Id == id);
        if (fileModel == null)
            return NotFound();

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

        if (!string.IsNullOrEmpty(tags))
        {
            var tagList = tags.Split(',').Select(tagName => tagName.Trim()).ToList();
            fileModel.FileTags.Clear();
            fileModel.FileTags = tagList.Select(tagName => new FileTagModel
            {
                Tag = new TagModel { TagName = tagName }
            }).ToList();
        }

        _context.Files.Update(fileModel);
        await _context.SaveChangesAsync();

        return Ok(fileModel);
    }
}
