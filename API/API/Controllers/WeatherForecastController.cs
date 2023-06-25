using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class WeatherForecastController : ControllerBase
    {
        DocumentContext _documentContext;

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger,
            DocumentContext documentContext)
        {
            _logger = logger;
            _documentContext = documentContext;

        }

        [HttpGet(Name = "GetWeatherForecast")]
        public Document[] Get()
        {

            Document[] documents = _documentContext.Documents.ToArray();

            return documents;
        }


        [HttpPost(Name = "PostUpload")]
        public async Task<IActionResult> Upload([FromForm] IFormFile file)
        {
            Document document = new Document();
            document.Guid = Guid.NewGuid();
            document.Path = file.FileName;

            _documentContext.Add(document);
            _documentContext.SaveChanges();

            //using (var bstream = file.OpenReadStream())
            //{
            //    while (bstream.CanRead)
            //    {
            //        bstream.Read(data);
            //    }
            //}

            // etc

            return Ok();
        }
    }
}