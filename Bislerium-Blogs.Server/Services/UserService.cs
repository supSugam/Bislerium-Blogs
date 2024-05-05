using Bislerium_Blogs.Server.Configs;
using Bislerium_Blogs.Server.Enums;
using Bislerium_Blogs.Server.Interfaces;
using Bislerium_Blogs.Server.Models;
using Bislerium_Blogs.Server.Payload;
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

        public async Task<string> GetRoleByUserId(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return null;
            }
            var identityUser = await _userManager.FindByIdAsync(userId.ToString());
            if (identityUser == null)
            {
                return null;
            }
            var role = (await _userManager.GetRolesAsync(identityUser))[0] ?? Constants.EnumToString(UserRole.USER);
            return role;
        }


        public async Task<UserPayload?> GetUserById(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return null;
            }

            var role = await GetRoleByUserId(userId);
            return new UserPayload
            {
                UserId = user.UserId,
                Email = user.Email,
                Username = user.Username,
                AvatarUrl = user.AvatarUrl,
                Role = role,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                FullName = user.FullName
            };
        }
    }

}
