using API.Files;
using API.FileTags;
using API.Tags;
using Microsoft.AspNetCore.Mvc;


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
            FileTags = []
        };

        await _fileTagService.AddFileTag(tags, fileModel);

        _logger.LogInformation("File uploaded successfully: {FileName}", fileModel.FileName);

        return Ok(new { fileModel.Id, fileModel.FileName, fileModel.FileTags });
    }

    [HttpGet]
    public async Task<IActionResult> GetFiles([FromQuery] List<string>? tags)
    {
        if (tags != null && tags.Count > 0)
            return Ok(await _fileService.GetFilesByTags(tags.ToArray()));
        else
            return Ok(await _fileService.GetAllFiles());
    }

    //[HttpGet]
    //public async Task<IActionResult> GetAllFiles()
    //{
    //    return Ok(await _fileService.GetAllFiles());
    //}

    [HttpGet("{id}")]
    public async Task<IActionResult> DownloadFile(int id)
    {
        var file = await _fileService.GetFileById(id);
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






    //[HttpPut("{id}")]
    //public async Task<IActionResult> UpdateFile(int id, [FromQuery] string[] tags, IFormFile file)
    //{
    //    var fileModel = await _context.Files.Include(f => f.FileTags).ThenInclude(ft => ft.Tag).FirstOrDefaultAsync(f => f.Id == id);
    //    if (fileModel == null)
    //    {
    //        _logger.LogWarning("File not found: {FileId}", id);
    //        return NotFound();
    //    }

    //    if (file != null)
    //    {
    //        var filePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "HTLKnowledgeBase", "Files", file.FileName);
    //        using (var stream = new FileStream(filePath, FileMode.Create))
    //        {
    //            await file.CopyToAsync(stream);
    //        }

    //        fileModel.FileName = file.FileName;
    //        fileModel.FilePath = filePath;
    //        fileModel.FileSize = file.Length;
    //        fileModel.FileType = file.ContentType;
    //    }

    //    if (tags != null && tags.Length > 0)
    //    {
    //        fileModel.FileTags.Clear();
    //        foreach (var tagName in tags)
    //        {
    //            var tag = await _context.Tags.FirstOrDefaultAsync(t => t.TagName == tagName.Trim());
    //            if (tag == null)
    //            {
    //                tag = new TagModel { TagName = tagName.Trim() };
    //                _context.Tags.Add(tag);
    //            }

    //            fileModel.FileTags.Add(new FileTagModel { Tag = tag, File = fileModel });
    //        }
    //    }

    //    _context.Files.Update(fileModel);
    //    await _context.SaveChangesAsync();

    //    _logger.LogInformation("File updated: {FileName}", fileModel.FileName);

    //    return Ok(fileModel);
    //}
}
