using Bislerium_Blogs.Server.Interfaces;
using Bislerium_Blogs.Server.Helpers;
using Bislerium_Blogs.Server.Payload;
using Microsoft.AspNetCore.Mvc;
using Bislerium_Blogs.Server.DTOs;
namespace Bislerium_Blogs.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(
            IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet]
        [AuthorizedOnly(Roles ="ADMIN")]
        public async Task<ActionResult<DashboardStatsPayload>> GetBlogPosts(
            [FromQuery] GetDashboardStatsDto getDashboardStatsDto)
        {
            try
            {
                var dashboardStats = await _dashboardService.GetWholeStatistics(getDashboardStatsDto);

                return Ok(dashboardStats);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("top-10")]
        [AuthorizedOnly(Roles = "ADMIN")]
        public async Task<ActionResult<Top10StatsPayload>> GetTop10Stats(
                       [FromQuery] GetTop10StatsDto getTop10StatsDto)
        {
            try
            {
                var top10Stats = await _dashboardService.GetTop10Statistics(getTop10StatsDto);

                return Ok(top10Stats);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

    }
}



