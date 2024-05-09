using Bislerium_Blogs.Server.Configs;
using Bislerium_Blogs.Server.DTOs;
using Bislerium_Blogs.Server.Enums;
using Bislerium_Blogs.Server.Interfaces;
using Bislerium_Blogs.Server.Models;
using Bislerium_Blogs.Server.Payload;
using Microsoft.EntityFrameworkCore;

namespace Bislerium_Blogs.Server.Services
{
    public class DashboardService:IDashboardService
    {

        private readonly BisleriumBlogsContext _context;
        private readonly IBlogService _blogService;

        public DashboardService(
            BisleriumBlogsContext context,
            IBlogService blogService
            )
        {
            _context = context;
            _blogService = blogService;
        }

        public async Task<Top10StatsPayload> GetTop10Statistics(GetTop10StatsDto getTop10StatsDto)
        {

            var blogPaginationDto = new BlogPaginationDto
            {
                PageNumber = 1,
                PageSize = 10,
                SortBy=SortBy.POPULARARITY,
                OfThisSpecificMonth = getTop10StatsDto.OfThisSpecificMonth
            };

            var top10Blogs = await _blogService.GetBlogPaginationPayload(blogPaginationDto,null);

            // top 10 bloggers counted by sum of  total popularity of all blogs by them
            var top10Bloggers = await _context.Users
                .Where(x=> x.BlogPosts.Count > 0)
                .OrderByDescending(x => x.BlogPosts.Sum(y => y.Popularity))
                .Take(10)
                .Select(user => new UserPayload
                {
         UserId = user.UserId,
                Email = user.Email,
                Username = user.Username,
                AvatarUrl = user.AvatarUrl,
                Role = Constants.EnumToString(UserRole.BLOGGER),
                    CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                FullName = user.FullName
                })
                .ToListAsync();

            return new Top10StatsPayload
            {
                Top10Blogs = top10Blogs.Blogs,
                Top10Bloggers = top10Bloggers,
                OfThisSpecificMonth = getTop10StatsDto.OfThisSpecificMonth
            };

        }

        public async Task<DashboardStatsPayload> GetWholeStatistics(GetDashboardStatsDto getDashboardStatsDto)
        {
            var totalBloggers = await _context.Users.CountAsync();
            var totalBlogs = await _context.BlogPosts.CountAsync();
            var totalBookmarks = await _context.Bookmarks.CountAsync();
            var totalComments = await _context.Comments.CountAsync();
            var totalUpvotesOnBlog = await _context.Reactions.CountAsync(x => x.IsUpvote  && x.CommentId == null);
            var totalDownvotesOnBlog = await _context.Reactions.CountAsync(x => !x.IsUpvote && x.CommentId == null);
            var totalUpvotesOnComment = await _context.Reactions.CountAsync(x => x.IsUpvote && x.CommentId != null);
            var totalDownvotesOnComment = await _context.Reactions.CountAsync(x => !x.IsUpvote && x.CommentId != null);

            var blogPaginationDto = new BlogPaginationDto
            {
                PageNumber = 1,
                PageSize = 11,
                SortBy = SortBy.POPULARARITY,
                OfThisSpecificMonth = getDashboardStatsDto.OfThisSpecificMonth
            };

            var mostPopularBlog = await _blogService.GetBlogPaginationPayload(blogPaginationDto, null);

            return new DashboardStatsPayload
            {
                TotalBloggers = totalBloggers,
                TotalBlogs = totalBlogs,
                TotalBookmarks = totalBookmarks,
                TotalComments = totalComments,
                TotalUpvotesOnBlog = totalUpvotesOnBlog,
                TotalDownvotesOnBlog = totalDownvotesOnBlog,
                TotalUpvotesOnComment = totalUpvotesOnComment,
                TotalDownvotesOnComment = totalDownvotesOnComment,
                MostPopularBlog = mostPopularBlog.Blogs.FirstOrDefault(),
            };

        }



    }
}
