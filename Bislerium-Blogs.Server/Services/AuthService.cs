using Bislerium_Blogs.Server.DTOs;
using Bislerium_Blogs.Server.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Bislerium_Blogs.Server.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _configuration;

        public AuthService(UserManager<IdentityUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }


        private string GenerateJwtToken(IdentityUser user)
        {
            ArgumentNullException.ThrowIfNull(user, nameof(user));

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id),
                new(ClaimTypes.Email, user.Email)
                //new(ClaimTypes.Role,user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                               _configuration["Jwt:Issuer"],
                                              _configuration["Jwt:Issuer"],
                                                             claims,
                                                                            expires: DateTime.Now.AddDays(30),
                                                                                           signingCredentials: creds
                                                                                                      );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<string> RegisterUserAsync(RegisterUserDto? registerUserDto)
        {
            ArgumentNullException.ThrowIfNull(registerUserDto, nameof(registerUserDto));

            var user = new IdentityUser
            {
                UserName = registerUserDto.Email,
                Email = registerUserDto.Email,
            };

            var result = await _userManager.CreateAsync(user, registerUserDto.Password);
            if (!result.Succeeded)
            {
                throw new Exception("User Registration Failed");
            }

            return $"User {registerUserDto.Email} registered successfully";

        }


        public async Task<object> LoginUserAsync(LoginUserDto loginUserDto)
        {
            ArgumentNullException.ThrowIfNull(loginUserDto, nameof(loginUserDto));

            var user = await _userManager.FindByEmailAsync(loginUserDto.Email);
            if (user == null)
            {
                throw new Exception("User with this email does not exist");
            }

            var result = await _userManager.CheckPasswordAsync(user, loginUserDto.Password);
            if (!result)
            {
                throw new Exception("Invalid Password");
            }

            string accessToken = GenerateJwtToken(user);

            return new
            {
                accessToken
            };

        }

    }
}
