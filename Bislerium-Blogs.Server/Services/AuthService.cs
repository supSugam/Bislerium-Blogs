using Bislerium_Blogs.Server.DTOs;
using Bislerium_Blogs.Server.Interfaces;
using Microsoft.AspNetCore.Identity;

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
            Console.WriteLine("User Registration Failed");
            throw new Exception("User Registration Failed");

            ArgumentNullException.ThrowIfNull(registerUserDto, nameof(registerUserDto));

            var user = new IdentityUser
            {
                UserName = registerUserDto.Email,
                Email = registerUserDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerUserDto.Password);
            if (!result.Succeeded)
            {
                throw new Exception("User Registration Failed");
            }
            return "User Registered";

        }

    }
}
