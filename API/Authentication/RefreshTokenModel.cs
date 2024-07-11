using Microsoft.AspNetCore.Identity;

namespace API.Authentication
{
    public class RefreshTokenModel
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public DateTime Expires { get; set; }
        public bool IsExpired => DateTime.UtcNow >= Expires;
        public DateTime Created { get; set; }
        public string UserId { get; set; }
        public ApplicationUser.ApplicationUser User { get; set; }
    }
}
