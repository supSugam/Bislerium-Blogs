using Bislerium_Blogs.Server.DTOs;
using Microsoft.AspNetCore.Identity;

namespace Bislerium_Blogs.Server.Interfaces
{

    public interface IAuthService
    {
        public string GenerateJwtToken(IdentityUser user);
        Task<string> RegisterUserAsync(RegisterUserDto registerUserDto);
        Task<object> LoginUserAsync(LoginUserDto loginUserDto);
        Task<bool> VerifyOTP(VerifyOtpDto verifyOtpDto);

    }
}
