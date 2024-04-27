using Bislerium_Blogs.Server.DTOs;

namespace Bislerium_Blogs.Server.Interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterUserAsync(RegisterUserDto registerUserDto);

    }
}
