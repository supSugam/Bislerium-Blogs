using Bislerium_Blogs.Server.Models;
using Bislerium_Blogs.Server.Payload;

namespace Bislerium_Blogs.Server.Interfaces
{
    public interface ICommentService
    {
        public Task<List<CommentPayload>> GetCommentsAsync(Guid blogPostId, Guid? userId, bool includeReplies);

        public Task<CommentPayload> GetCommentByIdAsync(Guid commentId,Guid? userId, bool includeReplies);

        public Task<List<CommentPayload>> GetRepliesAsync(Guid commentId,Guid? userId, bool includeReplies);

        public Task<CommentReactionsPayload> ReactToACommentAsync
            (Guid commentId, Guid userId, bool isUpvote);


        public Task<CommentReactionsPayload> GetCommentReactionDetails(Guid commentId, Guid? userId);


        public Task<int> GetPopularityOfComment(Guid commentId);

        public Task<List<CommentHistory>> GetCommentHistoryAsync(Guid commentId);

            public Task<bool> IsCommentEdited(Guid commentId);


    }
}
