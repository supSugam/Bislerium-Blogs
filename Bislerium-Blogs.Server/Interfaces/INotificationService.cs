using Bislerium_Blogs.Server.Payload;namespace Bislerium_Blogs.Server.Interfaces
{
    public interface INotificationService
    {
        public Task<List<NotificationPayload>> GetNotificationsAsync(Guid userId);
        public Task<bool> MarkNotificationAsRead(Guid notificationId);
        public Task<bool> MarkAllNotificationsAsRead(Guid userId);

public Task<bool> SendBlogReactionNotification(Guid blogPostId, Guid triggerUserId, bool IsUpvote);
        public Task<bool> SendCommentReactionNotification(Guid commentId, Guid triggerUserId, bool IsUpvote);
        public Task<bool> SendBlogCommentNotification(Guid blogPostId, Guid triggerUserId);
        public Task<bool> SendCommentReplyNotification(Guid commentId, Guid triggerUserId);

        public Task<bool> SendBookmarkedBlogNotification(Guid blogPostId, Guid triggerUserId);

    }
}
