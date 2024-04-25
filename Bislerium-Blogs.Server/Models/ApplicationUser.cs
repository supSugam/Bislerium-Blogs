using Microsoft.AspNetCore.Identity;

namespace Bislerium_Blogs.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
    }
}
