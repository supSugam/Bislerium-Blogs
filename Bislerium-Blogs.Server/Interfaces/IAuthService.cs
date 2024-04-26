using Bislerium_Blogs.Server.DTOs;
using Bislerium_Blogs.Server.Models;

namespace Bislerium_Blogs.Server.Interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterUserAsync(RegisterUserDto registerUserDto);

    }
}
