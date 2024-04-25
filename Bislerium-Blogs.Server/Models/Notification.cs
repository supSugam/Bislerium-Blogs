using System;
using System.Collections.Generic;

namespace Bislerium_Blogs.Server.Models;

public partial class Notification
{
    public Guid NotificationId { get; set; }

    public Guid UserId { get; set; }

    public Guid BlogPostId { get; set; }

    public byte NotificationType { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual BlogPost BlogPost { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
