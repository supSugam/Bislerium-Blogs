using System;
using System.Collections.Generic;

namespace Bislerium_Blogs.Server.Models;

public partial class Reaction
{
    public Guid ReactionId { get; set; }

    public Guid UserId { get; set; }

    public Guid? BlogPostId { get; set; }

    public Guid? CommentId { get; set; }

    public bool IsUpvote { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual BlogPost? BlogPost { get; set; }

    public virtual Comment? Comment { get; set; }

    public virtual User User { get; set; } = null!;
}
