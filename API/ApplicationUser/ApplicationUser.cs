using API.Authentication;
using Microsoft.AspNetCore.Identity;

namespace API.ApplicationUser
{
    public class ApplicationUser : IdentityUser
    {
        public List<RefreshTokenModel> RefreshTokens { get; set; } = new List<RefreshTokenModel>();
    }
}
