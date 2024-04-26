using System;
using System.Collections.Generic;

namespace Bislerium_Blogs.Server.Models;

public partial class Tag
{
    public Guid TagId { get; set; }

    public string TagName { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
