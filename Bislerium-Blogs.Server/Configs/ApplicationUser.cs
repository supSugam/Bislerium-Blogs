using Bislerium_Blogs.Server.Enums;
using Microsoft.AspNetCore.Identity;
using System.Data;

namespace Bislerium_Blogs.Server.Configs
{
    public class ApplicationUser:IdentityUser
    {
        public string Role { get; set; } = Enum.GetName(typeof(UserRole), UserRole.ADMIN);
    }
}
