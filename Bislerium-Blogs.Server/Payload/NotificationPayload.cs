namespace Bislerium_Blogs.Server.Payload
{
    public class NotificationPayload
    {
        public Guid NotificationId { get; set; }
        public required UserPayload TriggerUser { get; set; }
        public Guid BlogPostId { get; set; }
        public Guid? CommentId { get; set; }
        public byte NotificationType { get; set; }
        public required string NotificationMessage { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; }
    }
}
