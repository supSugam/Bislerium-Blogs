using Bislerium_Blogs.Server.DTOs;
using Bislerium_Blogs.Server.Models;
using Bislerium_Blogs.Server.Payload;

namespace Bislerium_Blogs.Server.Interfaces
{
    public interface IBlogService
    {
        public Task<List<Tag>> GetAllTagsOfABlog(Guid blogPostId);

        public Task<bool> CreateBlogHistoryAsync(BlogPostHistory blogPostHistory);
        public Task<List<BlogHistoryPreviewPayload>> GetHistoryPreviewByBlogIdAsync(Guid blogPostId);
       public Task<BlogHistoryPayload> GetBlogHistoryByIdAsync(Guid blogPostHistoryId);

        public Task<VotePayload> ReactToBlogPostAsync(Guid blogPostId, Guid userId, bool isUpvote);

        //public Task<VotePayload> ReactToCommentAsync(Guid commentId, Guid userId, bool isUpvote);

        public Task<int> UpdatePopularityOfABlog(Guid blogPostId);

        public Task<VotePayload> GetBlogReactionDetails(Guid blogPostId, Guid? userId);

        public Task<List<BlogPayload>> GetAllBookmarksOfAUser(string userIdorUsername);
        public Task<List<BlogPayload>> GetAllBlogsOfAUser(string userIdorUsername);
        public Task<List<BlogPayload>> GetAllBlogsOfAUser(Guid userId);

        public Task<bool> BookmarkBlogPostAsync(Guid blogPostId, Guid userId);

        public Task<bool> RemoveBookmarkAsync(Guid blogPostId, Guid userId);

        public Task<bool> IsBlogBookmarked(Guid blogPostId, Guid userId);

        public Task<BlogPaginationPayload> GetBlogPaginationPayload(BlogPaginationDto blogPaginationDto, Guid? userId);
        public string BlogUpdateSummaryBuilder(bool titleUpdates, bool tagsUpdated, bool thumbnailUpdated, bool bodyUpdated);

    }
}
