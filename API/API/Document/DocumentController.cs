using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using System;
using System.Diagnostics;
using System.Net;
using System.Web;

namespace API.Document
{
    [ApiController]
    [Route("[controller]/[action]")]

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
        public Tag[] GetTags()
        {
            Tag[] documents = _documentContext.Tags.ToArray();

            return documents;
        }


        [HttpGet]
        public Document[] Get()
        {
            var documents = _documentContext.Documents.Include(document => document.Tags).ToArray();

            //foreach (var document in documents)
            //{
            //    foreach (var tag in document.Tags)
            //    {
            //        tag.Documents = null;
            //    }
            //}

            return documents;
        }


        [HttpPost]
        public async Task<Guid> Post([FromForm] IFormFile file)
        {
            Document document = new Document();
            document.Guid = Guid.NewGuid();
            document.Path = file.FileName;

            _documentContext.Add(document);
            await _documentContext.SaveChangesAsync();

            string myDocumentsWindowsPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            string documentPath = Path.Combine(myDocumentsWindowsPath, "HTLKnowledgeBase", "Documents", file.FileName);

            _logger.LogDebug(documentPath);

            CreateDirectoryIfNotExistsFromDocumentPath(documentPath);

            using (FileStream fs = new FileStream(documentPath, FileMode.Create))
            {
                await file.CopyToAsync(fs);
            }

            return document.Guid;
        }

        [HttpPost()]
        public async Task<Guid> PostDocumentTags([FromBody] TagWithGuid tagWithGuid)
        {
            var document = _documentContext.Documents.First(document => document.Guid == tagWithGuid.Guid);
           
            foreach(Tag tag in tagWithGuid.Tags)
            {
                Trace.WriteLine(tag.Guid);
                document.Tags.Add(tag);
            }
    
            _documentContext.Documents.Update(document);
            await _documentContext.SaveChangesAsync();

            return document.Guid;
        }

        [HttpPost]
        public async Task<Guid> PostTag([FromBody] Tag tag)
        {
            tag.Guid = Guid.NewGuid();
            _documentContext.Tags.Add(tag);
            await _documentContext.SaveChangesAsync();

            return tag.Guid;
        }

        public class TagWithGuid
        {
            public ICollection<Tag> Tags { get; set; }
            public Guid Guid { get; set; }
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