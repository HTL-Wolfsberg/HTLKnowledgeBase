using API.Data;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
    public async Task<IActionResult> UploadFile(IFormFile file, [FromForm] string tags)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var documentsFolderPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "HTLKnowledgeBase", "Files");

        // Create the directory if it doesn't exist
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
            Tags = tags
        };

        _context.Files.Add(fileModel);
        await _context.SaveChangesAsync();

        return Ok(new { fileModel.Id, fileModel.FileName, fileModel.Tags });
    }


    [HttpGet]
    public async Task<IActionResult> GetFiles([FromQuery] string tags)
    {
        var files = string.IsNullOrEmpty(tags) ?
            await _context.Files.ToListAsync() :
            await _context.Files.Where(f => f.Tags.Contains(tags)).ToListAsync();

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

        return File(memory, "application/octet-stream", file.FileName);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFile(int id, IFormFile file, [FromForm] string tags)
    {
        var fileModel = await _context.Files.FindAsync(id);
        if (fileModel == null)
            return NotFound();

        if (file != null)
        {
            var filePath = Path.Combine("Uploads", file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            fileModel.FileName = file.FileName;
            fileModel.FilePath = filePath;
        }

        if (!string.IsNullOrEmpty(tags))
        {
            fileModel.Tags = tags;
        }

        _context.Files.Update(fileModel);
        await _context.SaveChangesAsync();

        return Ok(fileModel);
    }
}
