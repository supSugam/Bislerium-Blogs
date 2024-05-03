
using System.ComponentModel.DataAnnotations;

namespace Bislerium_Blogs.Server.DTOs
{

    public class PublishBlogDto
    {
        [Required]
        public string Title { get; set; } = null!;

        [Required]
        [MinLength(100)]
        public string Body { get; set; } = null!;

        [Required]
        public IFormFile Thumbnail { get; set; }

        public string[]? Tags { get; set; }

    }

    public class UpdateBlogDto
    {
        public string? Title { get; set; } = null!;

        public string? Body { get; set; } = null!;

        public IFormFile? Thumbnail { get; set; }

        public string[]? Tags { get; set; }

    }
}
