using Bislerium_Blogs.Server.Enums;
using Bislerium_Blogs.Server.Interfaces;

namespace Bislerium_Blogs.Server.DTOs
{
    public class BlogPaginationDto : IPagination
    {

        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Search { get; set; }
        public SortBy SortBy { get; set; }
        public DateTime? OfThisSpecificMonth { get; set; }
    }
}
