using System.ComponentModel.DataAnnotations;

namespace API.Authentication
{
    public class RefreshTokenRequest
    {
        [Required]
        public string RefreshToken { get; set; }

    }
}
