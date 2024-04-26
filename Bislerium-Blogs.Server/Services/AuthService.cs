using Bislerium_Blogs.Server.DTOs;
using Bislerium_Blogs.Server.Interfaces;
using Bislerium_Blogs.Server.Models;
using Microsoft.AspNetCore.Identity;
using System.Linq;

namespace Bislerium_Blogs.Server.Services
{
    public class AuthService : IAuthService
    {
        private UserManager<IdentityUser> _userManager;

        public AuthService(UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<string> RegisterUserAsync(RegisterUserDto? registerUserDto)
        {
            ArgumentNullException.ThrowIfNull(registerUserDto, nameof(registerUserDto));

            var user = new IdentityUser
            {
                UserName = registerUserDto.Email,
                Email = registerUserDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerUserDto.Password);

            if (!result.Succeeded)
            {
                throw new Exception(result.Errors.ToArray().Select(x => x.Description).ToString());
            }

            return "User Registered!";

        }

    }
}
