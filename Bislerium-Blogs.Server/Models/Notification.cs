namespace Bislerium_Blogs.Server.Models;

public partial class Notification
{
    public Guid NotificationId { get; set; }
    public Guid TargetUserId { get; set; }
    public Guid TriggerUserId { get; set; }
    public Guid BlogPostId { get; set; }
    public Guid? CommentId { get; set; }
    public virtual User TriggerUser { get; set; } = null!;
    public virtual BlogPost BlogPost { get; set; }
    public virtual Comment? Comment { get; set; }
    public byte NotificationType { get; set; }
    public required string NotificationMessage { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; } = false;
}