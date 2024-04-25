using System;
using System.Collections.Generic;

namespace Bislerium_Blogs.Server.Models;

public partial class Comment
{
    public Guid CommentId { get; set; }

    public string Body { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Guid AuthorId { get; set; }

    public Guid BlogPostId { get; set; }

    public Guid? ParentCommentId { get; set; }

    public virtual User Author { get; set; } = null!;

    public virtual BlogPost BlogPost { get; set; } = null!;

    public virtual ICollection<CommentHistory> CommentHistories { get; set; } = new List<CommentHistory>();

    public virtual ICollection<Comment> InverseParentComment { get; set; } = new List<Comment>();

    public virtual Comment? ParentComment { get; set; }

    public virtual ICollection<Reaction> Reactions { get; set; } = new List<Reaction>();
}
