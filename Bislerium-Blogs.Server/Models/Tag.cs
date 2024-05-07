namespace Bislerium_Blogs.Server.Models;

public partial class Tag
{
    public Guid TagId { get; set; }

    public string TagName { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
    public virtual ICollection<BlogPostTag> BlogPostTags { get; set; } = new List<BlogPostTag>();

    public virtual ICollection<BlogPostHistoryTag> BlogPostHistoryTags { get; set; } = new List<BlogPostHistoryTag>();
}
