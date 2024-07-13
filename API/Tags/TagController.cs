using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Tags
{
    [ApiController]
    [Route("api/[controller]")]
    public class TagsController : ControllerBase
    {
        private readonly ITagService _tagService;

        public TagsController(ITagService tagService)
        {
            _tagService = tagService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagModel>>> GetTags()
        {
            var tags = await _tagService.GetTagsAsync();
            return Ok(tags);
        }

        [HttpPost]
        public async Task<ActionResult<TagModel>> AddTag(TagModel tag)
        {
            var createdTag = await _tagService.AddTagAsync(tag);
            return CreatedAtAction(nameof(GetTag), new { id = createdTag.Id }, createdTag);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TagModel>> GetTag(int id)
        {
            var tag = await _tagService.GetTagAsync(id);

            if (tag == null)
            {
                return NotFound();
            }

            return Ok(tag);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ModifyTag(int id, TagModel tag)
        {
            var result = await _tagService.UpdateTagAsync(id, tag);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(int id)
        {
            var result = await _tagService.DeleteTagAsync(id);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
