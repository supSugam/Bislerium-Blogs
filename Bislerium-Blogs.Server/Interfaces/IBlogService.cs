using Bislerium_Blogs.Server.Models;

namespace Bislerium_Blogs.Server.Interfaces
{
    public interface IBlogService
    {
        public Task<List<Tag>> GetAllTagsOfABlog(Guid blogPostId);
    }
}
