namespace Bislerium_Blogs.Server.DTOs
{
    public class PostACommentDto
    {
        public Guid BlogPostId { get; set; }
        public string Body { get; set; }
        public string? ParentCommentId { get; set; }
    }

    public class UpdateACommentDto
    {
        public string Body { get; set; }
    }
}
