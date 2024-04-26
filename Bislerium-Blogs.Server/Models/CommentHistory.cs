using System;
using System.Collections.Generic;

namespace Bislerium_Blogs.Server.Models;

public partial class CommentHistory
{
    public Guid CommentHistoryId { get; set; }

    public Guid CommentId { get; set; }

    public string Body { get; set; } = null!;

    public DateTime UpdatedAt { get; set; }

    public virtual Comment Comment { get; set; } = null!;
}
