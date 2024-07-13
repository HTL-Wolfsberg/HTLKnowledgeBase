using Microsoft.AspNetCore.Mvc;

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
        public async Task<ActionResult<TagModel>> GetTag(Guid id)
        {
            var tag = await _tagService.GetTagAsync(id);

            if (tag == null)
            {
                return NotFound();
            }

            return Ok(tag);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ModifyTag(Guid id, TagModel tag)
        {
            var result = await _tagService.UpdateTagAsync(id, tag);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(Guid id)
        {
            var result = await _tagService.DeleteTagAsync(id);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("{id}/fileCount")]
        public async Task<ActionResult<int>> GetFileCountForTag(Guid id)
        {
            var count = await _tagService.GetFileCountForTagAsync(id);
            return Ok(count);
        }
    }
}
