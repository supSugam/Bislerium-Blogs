using System.ComponentModel.DataAnnotations;

namespace Bislerium_Blogs.Server.DTOs
{
    public class LoginUserDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }

    }
}
