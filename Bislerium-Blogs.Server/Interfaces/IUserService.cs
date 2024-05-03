namespace Bislerium_Blogs.Server.Interfaces
{
    public interface IUserService
    {
        public Task<string?> GetRoleByUserId(Guid userId);

    }
}
