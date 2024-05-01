using Bislerium_Blogs.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace Bislerium_Blogs.Server.DTOs
{
    public class RegisterUserDto
    {
        [Required]
        [MinLength(3)]
        
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(8)]
        public string Password { get; set; }

        [Required]
        public string FullName { get; set; }

        public IFormFile? Avatar { get; set; }

        public string? Role { get; set; } = Enum.GetName(typeof(UserRole), UserRole.USER);

    }
}
