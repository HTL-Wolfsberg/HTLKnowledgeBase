using System.ComponentModel.DataAnnotations;

namespace API.Authentication
{
    public class RegisterModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [MinLength(6)]
        public string Password { get; set; }
        [Required]
        [StringLength(50)]
        public string Name { get; set; }
    }
}
