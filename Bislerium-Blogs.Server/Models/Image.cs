using System;
using System.Collections.Generic;

namespace Bislerium_Blogs.Server.Models;

public partial class Image
{
    public Guid ImageId { get; set; }

    public required string ImageUrl { get; set; }

    public Guid BlogPostId { get; set; }

    public virtual BlogPost BlogPost { get; set; } = null!;
}
