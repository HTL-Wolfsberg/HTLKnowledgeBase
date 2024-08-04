using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Authentication
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<ApplicationUser.ApplicationUser> _userManager;

        public AdminController(UserManager<ApplicationUser.ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost("assign-roles")]
        public async Task<IActionResult> AssignRoles([FromBody] AssignRolesRequest request)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var currentRoles = await _userManager.GetRolesAsync(user);
            var rolesToRemove = currentRoles.Except(request.Roles).ToList();
            var rolesToAdd = request.Roles.Except(currentRoles).ToList();

            var removeResult = await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
            if (!removeResult.Succeeded)
            {
                return BadRequest(removeResult.Errors);
            }

            var addResult = await _userManager.AddToRolesAsync(user, rolesToAdd);
            if (!addResult.Succeeded)
            {
                return BadRequest(addResult.Errors);
            }

            return Ok();
        }

        [HttpGet("get-roles/{userId}")]
        public async Task<IActionResult> GetUserRoles(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(roles.ToList());
        }

        [HttpDelete("delete-user/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok("User deleted successfully");
        }
    }

    public class AssignRolesRequest
    {
        public string UserId { get; set; }
        public List<string> Roles { get; set; }
    }
}
