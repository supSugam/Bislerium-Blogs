using System;
using System.Collections.Generic;

namespace Bislerium_Blogs.Server.Models;

public partial class BlogPostHistory
{
    public Guid BlogPostHistoryId { get; set; }

    public Guid BlogPostId { get; set; }

    public string Title { get; set; } = null!;

    public string Body { get; set; } = null!;

    public DateTime UpdatedAt { get; set; }

    public virtual BlogPost BlogPost { get; set; } = null!;
}
