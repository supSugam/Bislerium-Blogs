using Bislerium_Blogs.Server.Payload;

namespace Bislerium_Blogs.Server.Interfaces
{
    public interface ICommentService
    {
        public Task<List<CommentPayload>> GetCommentsAsync(Guid blogPostId);

        public Task<CommentPayload> GetCommentByIdAsync(Guid commentId, bool includeReplies);

        public Task<List<CommentPayload>> GetRepliesAsync(Guid commentId, bool includeReplies);


    }
}
