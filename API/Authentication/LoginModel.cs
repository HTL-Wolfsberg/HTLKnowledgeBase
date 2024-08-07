﻿using System.ComponentModel.DataAnnotations;

namespace API.Authentication
{
    public class LoginModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [MinLength(6)]
        public string Password { get; set; }

    }
}
