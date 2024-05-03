using System.ComponentModel.DataAnnotations.Schema;

namespace Bislerium_Blogs.Server.Models;

public partial class BlogPost
{
    public Guid BlogPostId { get; set; }

    public string Title { get; set; } = null!;

    [Column(TypeName = "VARCHAR(MAX)")]
    public required string Body { get; set; } = null!;

    public required string Thumbnail { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Guid AuthorId { get; set; }

    public int Popularity { get; set; }

    public virtual User Author { get; set; } = null!;

    public virtual ICollection<BlogPostHistory> BlogPostHistories { get; set; } = new List<BlogPostHistory>();

    public virtual ICollection<Bookmark> Bookmarks { get; set; } = new List<Bookmark>();

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Reaction> Reactions { get; set; } = new List<Reaction>();
    public virtual ICollection<BlogPostTag> BlogPostTags { get; set; } = new List<BlogPostTag>();
}
