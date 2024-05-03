namespace Bislerium_Blogs.Server.Models;

public class BlogPostTag
{
    public Guid BlogPostId { get; set; }
    public BlogPost BlogPost { get; set; }

    public Guid TagId { get; set; }
    public Tag Tag { get; set; }
}
