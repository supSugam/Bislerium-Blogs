using Bislerium_Blogs.Server.Models;
using Bislerium_Blogs.Server.Payload;

namespace Bislerium_Blogs.Server.Interfaces
{
    public interface IBlogService
    {
        public Task<List<Tag>> GetAllTagsOfABlog(Guid blogPostId);

        public Task<bool> CreateBlogHistoryAsync(BlogPostHistory blogPostHistory);
        public Task<IEnumerable<BlogPostHistory>> GetHistoryByBlogIdAsync(Guid blogPostId);

        public Task<VotePayload> ReactToBlogPostAsync(Guid blogPostId, Guid userId, bool isUpvote);

        //public Task<VotePayload> ReactToCommentAsync(Guid commentId, Guid userId, bool isUpvote);

        public Task<int> UpdatePopularityOfABlog(Guid blogPostId);

        public Task<VotePayload> GetBlogReactionDetails(Guid blogPostId, Guid? userId);
    }
}
