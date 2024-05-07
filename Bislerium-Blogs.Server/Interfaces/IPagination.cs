using Bislerium_Blogs.Server.Enums;

namespace Bislerium_Blogs.Server.Interfaces
{
    public interface IPagination
    {
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }

        public string? Search { get; set; }

    }

}
