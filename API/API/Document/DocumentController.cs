using Microsoft.AspNetCore.Mvc;

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
        public Document[] Get(string guid)
        {
            Document[] documents = _documentContext.Documents.ToArray();

            return documents;
        }

        [HttpGet]
        public Document[] GetAll()
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
    }
}