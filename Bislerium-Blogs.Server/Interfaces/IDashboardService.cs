using Bislerium_Blogs.Server.DTOs;
using Bislerium_Blogs.Server.Payload;

namespace Bislerium_Blogs.Server.Interfaces
{
    public interface IDashboardService
    {

        public Task<DashboardStatsPayload> GetWholeStatistics(GetDashboardStatsDto getDashboardStatsDto);

        public Task<Top10StatsPayload> GetTop10Statistics(GetTop10StatsDto getTop10StatsDto);
    }
}
