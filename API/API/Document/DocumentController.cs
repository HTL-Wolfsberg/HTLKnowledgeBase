using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using System;
using System.Net;
using System.Web;

namespace API.Document
{
    [ApiController]
    [Route("[controller]")]

    public class DocumentController : ControllerBase
    {
        DocumentContext _documentContext;

        private readonly ILogger<DocumentController> _logger;

        public DocumentController(ILogger<DocumentController> logger,
            DocumentContext documentContext)
        {
            _logger = logger;
            _documentContext = documentContext;
        }

        [HttpGet("{guid}")]
        public async Task<FileStreamResult> Get(Guid guid)
        {
            Document document = _documentContext.Documents.First(document => document.Guid == guid);

            string myDocumentsWindowsPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            string documentPath = Path.Combine(myDocumentsWindowsPath, "HTLKnowledgeBase", "Documents", document.Path);

            var memory = new MemoryStream();
            await using (var stream = new FileStream(documentPath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;

            Response.Headers.Add("filename", HttpUtility.UrlEncode(document.Path, System.Text.Encoding.UTF8));

            return File(memory, GetContentType(documentPath), documentPath);
        }

        [HttpGet]
        public Document[] Get()
        {
            Document[] documents = _documentContext.Documents.ToArray();

            return documents;
        }


        [HttpPost]
        public async Task<IActionResult> Post([FromForm] IFormFile file)
        {
            Document document = new Document();
            document.Guid = Guid.NewGuid();
            document.Path = file.FileName;

            _documentContext.Add(document);
            _documentContext.SaveChanges();

            string myDocumentsWindowsPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            string documentPath = Path.Combine(myDocumentsWindowsPath, "HTLKnowledgeBase", "Documents", file.FileName);

            _logger.LogDebug(documentPath);

            CreateDirectoryIfNotExistsFromDocumentPath(documentPath);

            using (FileStream fs = new FileStream(documentPath, FileMode.Create))
            {
                file.CopyTo(fs);
            }

            return Ok();
        }

        private void CreateDirectoryIfNotExistsFromDocumentPath(string documentPath)
        {
            string directory = Path.GetDirectoryName(documentPath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }
        }

        private string GetContentType(string path)
        {
            var provider = new FileExtensionContentTypeProvider();
            string contentType;

            if (!provider.TryGetContentType(path, out contentType))
            {
                contentType = "application/octet-stream";
            }

            return contentType;
        }
    }

}