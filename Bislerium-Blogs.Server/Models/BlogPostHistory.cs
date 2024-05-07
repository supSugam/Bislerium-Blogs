
namespace Bislerium_Blogs.Server.Models;

public partial class BlogPostHistory
{
    public Guid BlogPostHistoryId { get; set; }

    public Guid BlogPostId { get; set; }

    public string Title { get; set; } = null!;

    public string Body { get; set; } = null!;
    public virtual ICollection<BlogPostHistoryTag> BlogPostHistoryTags { get; set; } = new List<BlogPostHistoryTag>();

    public required string Thumbnail { get; set; }
    public string ChangesSummary { get; set; } = null!;

    public DateTime UpdatedAt { get; set; }

    public virtual BlogPost BlogPost { get; set; } = null!;
}
