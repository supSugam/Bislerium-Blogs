using Bislerium_Blogs.Server.Interfaces;
using Bislerium_Blogs.Server.Models;
using Microsoft.AspNetCore.Identity;

namespace Bislerium_Blogs.Server.Services
{
    public class UserService: IUserService
    {
        private readonly BisleriumBlogsContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public UserService(BisleriumBlogsContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<string?> GetRoleByUserId(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return null;
            }
            var roles = await _userManager.GetRolesAsync(await _userManager.FindByIdAsync(user.UserId.ToString()));
            return roles[0];
        }
    }

}
