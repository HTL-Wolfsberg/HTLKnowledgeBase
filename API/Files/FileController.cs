using API.Files;
using API.FileTags;
using API.Tags;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Claims;


[ApiController]
[Route("api/[controller]")]
public class FileController : ControllerBase
{
    private readonly ILogger<FileController> _logger;
    private readonly ITagService _tagService;
    private readonly IFileService _fileService;
    private readonly IFileTagService _fileTagService;

    public FileController(ILogger<FileController> logger,
        ITagService tagService,
        IFileService fileService,
        IFileTagService fileTagService)
    {
        _logger = logger;
        _tagService = tagService;
        _fileService = fileService;
        _fileTagService = fileTagService;
    }

    [RequestSizeLimit(104857600)] // 100 MB 
    [HttpPost]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> UploadFile(IFormFile file, [FromForm] string tags)
    {
        if (file == null || file.Length == 0)
        {
            _logger.LogWarning("No file uploaded.");
            return BadRequest("No file uploaded.");
        }

        var tagList = JsonConvert.DeserializeObject<List<TagModel>>(tags);

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var documentsFolderPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "HTLKnowledgeBase", "Files");

        if (!Directory.Exists(documentsFolderPath))
        {
            Directory.CreateDirectory(documentsFolderPath);
        }

        var uniqueFileName = $"{Path.GetFileNameWithoutExtension(file.FileName)}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(documentsFolderPath, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var fileModel = new FileModel
        {
            Name = file.FileName,
            Path = filePath,
            Size = file.Length,
            Type = file.ContentType,
            UserId = userId,
            FileTags = []
        };

        await _fileTagService.AddFileTag(tagList, fileModel);

        _logger.LogInformation("File uploaded successfully: {FileName}", fileModel.Name);

        return Ok(new { fileModel.Id, fileModel.Name, fileModel.FileTags });
    }

    [HttpGet]
    public async Task<IActionResult> GetFiles([FromQuery] List<string>? tags)
    {
        List<FileModel> files;

        if (tags != null && tags.Count > 0)
            files = await _fileService.GetFilesByTags(tags);
        else
            files = await _fileService.GetAllFiles();

        _logger.LogInformation("Retrieved {FileCount} files", files.Count);

        return Ok(files);
    }

    [RequestSizeLimit(104857600)] // 100 MB
    [HttpGet("{id}")]
    public async Task<IActionResult> DownloadFile(Guid id)
    {
        var file = await _fileService.GetFileById(id);

        if (file == null)
        {
            _logger.LogWarning("File not found: {FileId}", id);
            return NotFound();
        }

        var memory = new MemoryStream();
        using (var stream = new FileStream(file.Path, FileMode.Open))
        {
            await stream.CopyToAsync(memory);
        }
        memory.Position = 0;

        _logger.LogInformation("File downloaded: {FileName}", file.Name);

        return File(memory, file.Type);
    }


    [Authorize(Roles = "Admin,Editor")]
    [HttpGet("GetFilesFromUser")]
    public async Task<List<FileModel>> GetFilesFromUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }

        return await _fileService.GetFilesFromUser(userId);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> RemoveFile(Guid id)
    {
        var file = await _fileService.GetFileById(id);
        if (file == null)
        {
            _logger.LogWarning("File not found: {FileId}", id);
            return NotFound();
        }

        try
        {
            if (System.IO.File.Exists(file.Path))
            {
                System.IO.File.Delete(file.Path);
            }

            await _fileService.DeleteFile(id);

            _logger.LogInformation("File removed: {FileName}", file.Name);

            return Ok(new { Message = "File removed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing file: {FileName}", file.Name);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> UpdateFile(Guid id, [FromBody] FileModel file)
    {
        if (id != file.Id)
        {
            return BadRequest("File ID mismatch.");
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (file.UserId != userId)
        {
            return Forbid();
        }

        bool success = await _fileService.UpdateFile(file);

        if (success)
        {
            _logger.LogInformation("File updated successfully: {FileName}", file.Name);
            return Ok(file);
        }
        else
        {
            return NotFound();
        }
    }
}
