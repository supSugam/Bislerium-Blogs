using System;
using System.Collections.Generic;

namespace Bislerium_Blogs.Server.Models;

public partial class Image
{
    public Guid ImageId { get; set; }

    public byte[] ImageData { get; set; } = null!;

    public Guid BlogPostId { get; set; }

    public virtual BlogPost BlogPost { get; set; } = null!;
}
