namespace Bislerium_Blogs.Server.Payload
{
    public class CommentPayload
    {
        public Guid CommentId { get; set; }
        public required string Body { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public required UserPayload Author { get; set; }
        public Guid BlogPostId { get; set; }

        public bool? IsEdited { get; set; } = false;

        public List<CommentPayload> Replies { get; set; } = new();
        public Guid? ParentCommentId { get; set; }

        public CommentReactionsPayload Reactions { get; set; } = new();
    }
}
