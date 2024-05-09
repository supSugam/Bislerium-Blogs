namespace Bislerium_Blogs.Server.DTOs
{
    public class GetDashboardStatsDto
    {
        public DateTime? OfThisSpecificMonth { get; set; }

    }

    public class GetTop10StatsDto : GetDashboardStatsDto
    {
    }
}
