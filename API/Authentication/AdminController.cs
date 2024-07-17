using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Authentication
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<ApplicationUser.ApplicationUser> _userManager;

        public AdminController(UserManager<ApplicationUser.ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("assign-roles")]
        public async Task<IActionResult> AssignRoles([FromBody] AssignRolesRequest request)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            foreach (var role in request.Roles)
            {
                if (!await _userManager.IsInRoleAsync(user, role))
                {
                    var result = await _userManager.AddToRoleAsync(user, role);
                    if (!result.Succeeded)
                    {
                        return BadRequest(result.Errors);
                    }
                }
            }

            return Ok();
        }
    }

    public class AssignRolesRequest
    {
        public string UserId { get; set; }
        public List<string> Roles { get; set; }
    }
}
