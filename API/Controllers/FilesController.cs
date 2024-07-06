using API.Data;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
[ApiController]
[Route("api/[controller]")]
public class FilesController : ControllerBase
{
    private readonly AppDbContext _context;

    public FilesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetFiles([FromQuery] string tag)
    {
        if (string.IsNullOrEmpty(tag))
        {
            return Ok(await _context.FileItems.Include(f => f.Tags).ToListAsync());
        }

        var files = await _context.FileItems
            .Include(f => f.Tags)
            .Where(f => f.Tags.Any(t => t.Tag == tag))
            .ToListAsync();

        return Ok(files);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> UploadFile([FromForm] IFormFile file, [FromForm] List<string> tags)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var filePath = Path.Combine("uploads", file.FileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var fileItem = new FileItem
        {
            FileName = file.FileName,
            FilePath = filePath,
            Tags = tags.Select(t => new FileTag { Tag = t }).ToList()
        };

        _context.FileItems.Add(fileItem);
        await _context.SaveChangesAsync();

        return Ok(fileItem);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteFile(int id)
    {
        var fileItem = await _context.FileItems.FindAsync(id);
        if (fileItem == null)
            return NotFound();

        System.IO.File.Delete(fileItem.FilePath);
        _context.FileItems.Remove(fileItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
