using Bislerium_Blogs.Server.Payload;

namespace Bislerium_Blogs.Server.Interfaces
{
    public interface IUserService
    {
        public Task<string> GetRoleByUserId(Guid userId);
        public
            Task<UserPayload?> GetUserById(Guid userId);

    }
}
