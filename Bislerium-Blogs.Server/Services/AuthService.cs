using Bislerium_Blogs.Server.Configs;
using Bislerium_Blogs.Server.DTOs;
using Bislerium_Blogs.Server.Enums;
using Bislerium_Blogs.Server.Interfaces;
using Bislerium_Blogs.Server.Models;
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
        private readonly IEmailService _emailService;
        private readonly BisleriumBlogsContext _context;


        public AuthService(UserManager<IdentityUser> userManager,
            IEmailService emailService,
            IConfiguration configuration,
            BisleriumBlogsContext context
            )
        {
            _userManager = userManager;
            _emailService = emailService;
            _configuration = configuration;
            _context = context;
        }


        public string GenerateJwtToken(IdentityUser user)
        {
            ArgumentNullException.ThrowIfNull(user, nameof(user));
            var role = _userManager.GetRolesAsync(user).Result.FirstOrDefault();
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Role, role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                               _configuration["Jwt:Issuer"],
                                              _configuration["Jwt:Issuer"],
                                                             claims,
                                                                            expires: DateTime
                                                                            .UtcNow
                                                                            .AddDays(7),
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
            await _userManager.AddToRoleAsync(user, Constants.EnumToString(UserRole.USER));

            if (!result.Succeeded)
            {
                throw new Exception("User Registration Failed");
            }

            var existingUser = await _userManager.FindByEmailAsync(registerUserDto.Email);

            _context.Users.Add(new User
            {
                UserId = new Guid(existingUser.Id),
                Email = existingUser.Email,
                Username = existingUser.UserName,
                Avatar=registerUserDto.Avatar,
                FullName = registerUserDto.FullName,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            });

            await _context.SaveChangesAsync();


            await _emailService.SendOTP(registerUserDto.Email, registerUserDto.FullName);

            return "Signed Up, Check your email and enter the code to verify.";

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

            var IsEmailConfirmed = await _userManager.IsEmailConfirmedAsync(user);
            string? accessToken = null;
            if (IsEmailConfirmed)
            {
            accessToken = GenerateJwtToken(user);
            await _emailService.SendOTP(user.Email, user.UserName);
            }


            return new
            {
                accessToken,
                isEmailConfirmed = IsEmailConfirmed,
                email = user.Email,
                username = user.UserName
            };

        }

        public async Task<bool> VerifyOTP(VerifyOtpDto verifyOtpDto)
        {
            ArgumentNullException.ThrowIfNull(verifyOtpDto, nameof(verifyOtpDto));
            bool IsCorrect = await _emailService.VerifyOTP(verifyOtpDto.Email, verifyOtpDto.Otp);
            if (IsCorrect)
            {
                var existingUser = await _userManager.FindByEmailAsync(verifyOtpDto.Email);

                if(existingUser != null)
                {
                    var emailConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(existingUser);

                    await _userManager.ConfirmEmailAsync(existingUser, emailConfirmationToken);

                }
                ;
            }
            return IsCorrect;

        }

    }
}
