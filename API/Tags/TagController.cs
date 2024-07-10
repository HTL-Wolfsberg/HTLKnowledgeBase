using API.Files;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Tags
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly FileContext _context;
        private readonly ITagService _tagService;

        public TagController(FileContext context, ITagService tagService)
        {
            _context = context;
            _tagService = tagService;
        }

        [HttpGet]
        public async Task<IActionResult> GetTags()
        {
            return Ok(await _tagService.GetTags());
        }
    }
}
