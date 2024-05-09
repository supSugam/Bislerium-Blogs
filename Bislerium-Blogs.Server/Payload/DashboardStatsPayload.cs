namespace Bislerium_Blogs.Server.Payload
{
    public class DashboardStatsPayload
    {
        public int TotalBloggers { get; set; }
        public int TotalBlogs { get; set; }
        public int TotalBookmarks { get; set; }
        public int TotalComments { get; set; }
        public int TotalUpvotesOnBlog { get; set; }
        public int TotalDownvotesOnBlog { get; set; }
        public int TotalUpvotesOnComment { get; set; }
        public int TotalDownvotesOnComment { get; set; }

        public BlogPayload? MostPopularBlog { get; set; }

    }

    public class Top10StatsPayload
    {
        public List<BlogPayload> Top10Blogs { get; set; } = new List<BlogPayload>();
        public List<UserPayload> Top10Bloggers { get; set; } = new List<UserPayload>();
        public DateTime? OfThisSpecificMonth { get; set; }
    }
}
