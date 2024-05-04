
using Bislerium_Blogs.Server.Models;
namespace Bislerium_Blogs.Server.Payload
{
    public class BlogPayload
    {
        public Guid BlogPostId { get; set; }

        public string Title { get; set; }

        public required string Body { get; set; }

        public required string Thumbnail { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public UserPayload Author { get; set; }

        public int Popularity { get; set; }

        public List<Tag> Tags { get; set; } = [];

        public VotePayload VotePayload { get; set; }

    }
}
