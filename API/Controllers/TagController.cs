using API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly FileContext _context;

        public TagController(FileContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTags()
        {
            var tagModels = await _context.Tags.ToListAsync();
            var tags = tagModels.Select(tag => tag.TagName).ToList();

            return Ok(tags);
        }
    }
}
