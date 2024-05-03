using Bislerium_Blogs.Server.Interfaces;
using Bislerium_Blogs.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Bislerium_Blogs.Server.Services
{
    public class BlogService : IBlogService
    {
        private readonly BisleriumBlogsContext _context;

        public BlogService(BisleriumBlogsContext context)
        {
            _context = context;
        }

        public async Task<List<Tag>> GetAllTagsOfABlog(Guid blogPostId)
        {
            var blogPostTags = await _context.Tags
                .Where(tag => tag.BlogPostTags.Any(blogPostTag => blogPostTag.BlogPostId == blogPostId))
                .ToListAsync();

            return blogPostTags;
        }
    }
}
