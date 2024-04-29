using Bislerium_Blogs.Server.DTOs;

namespace Bislerium_Blogs.Server.Interfaces
{

    public interface IAuthService
    {
        Task<string> RegisterUserAsync(RegisterUserDto registerUserDto);
        Task<object> LoginUserAsync(LoginUserDto loginUserDto);

        Task<bool> VerifyOtpAsync(VerifyOtpDto verifyOtpDto);


    }
}
