using Bislerium_Blogs.Server.Models;

namespace Bislerium_Blogs.Server.Payload
{
    public class BlogHistoryPayload
    {
        public Guid BlogPostHistoryId { get; set; }
        public Guid BlogPostId { get; set; }
        public string Title { get; set; } = null!;
        public string Body { get; set; } = null!;
        public string Thumbnail { get; set; } = null!;
        public string ChangesSummary { get; set; } = null!;
        public DateTime UpdatedAt { get; set; }

        public List<Tag> Tags { get; set; } = new List<Tag>();

        public UserPayload Author { get; set; } = null!;

    }

    public class BlogHistoryPreviewPayload
    {
        public Guid BlogPostHistoryId { get; set; }
        public Guid BlogPostId { get; set; }

        public string Title { get; set; } = null!;
        public string Thumbnail { get; set; } = null!;
        public string ChangesSummary { get; set; } = null!;
        public DateTime UpdatedAt { get; set; }
    }
}
