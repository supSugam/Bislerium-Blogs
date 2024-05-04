using Bislerium_Blogs.Server.Configs;
using Bislerium_Blogs.Server.DTOs;
using Bislerium_Blogs.Server.Enums;
using Bislerium_Blogs.Server.Helpers;
using Bislerium_Blogs.Server.Interfaces;
using Bislerium_Blogs.Server.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
        private readonly IS3Service _s3Service;



        public AuthService(UserManager<IdentityUser> userManager,
            IEmailService emailService,
            IS3Service firebaseService,
            IConfiguration configuration,
            BisleriumBlogsContext context
            )
        {
            _userManager = userManager;
            _emailService = emailService;
            _s3Service = firebaseService;
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

            // Check if Avatar is larger than 3MB
            if (registerUserDto.Avatar is not null && registerUserDto.Avatar.Length > 3 * 1024 * 1024)
            {
                throw new Exception("Avatar size should not exceed 3MB");
            }

            // check if user with same email or username exists

            var existingUserWithSameEmail = await _userManager.FindByEmailAsync(registerUserDto.Email);
            if (existingUserWithSameEmail != null)
            {
                throw new Exception("User with this email already exists");
            }

            var existingUserWithSameUsername = await _context.Users.FirstOrDefaultAsync(x => x.Username == registerUserDto.Username);

            if (existingUserWithSameUsername != null)
            {
                throw new Exception("User with this username already exists");
            }

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
            string? imageUrl = null;
            if (registerUserDto.Avatar is not null)
            {
                imageUrl = await _s3Service.UploadFileToS3(registerUserDto.Avatar, Constants.USER_AVATARS_DIRECTORY, existingUser.Id);
            }

            _context.Users.Add(new User
            {
                UserId = new Guid(existingUser.Id),
                Email = existingUser.Email,
                Username = existingUser.UserName,
                FullName = registerUserDto.FullName,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                AvatarUrl = imageUrl
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
            }
            else
            {
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

        public async Task ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            ArgumentNullException.ThrowIfNull(resetPasswordDto, nameof(resetPasswordDto));
            var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
            if (user == null)
            {
                throw new Exception("User with this email does not exist");
            }

            var IsCorrect = await _emailService.VerifyOTP(resetPasswordDto.Email, resetPasswordDto.Otp);
            if (!IsCorrect)
            {
                throw new Exception("Invalid OTP");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, resetPasswordDto.Password);

            if (!result.Succeeded)
            {
                throw new Exception("Password Reset Failed");
            }

        }

    }
}
