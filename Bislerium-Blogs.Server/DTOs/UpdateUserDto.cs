namespace Bislerium_Blogs.Server.DTOs
{
    public class UpdateUserDto
    {
        public string? UserName { get; set; }
        public string? FullName { get; set; }
        public IFormFile? Avatar
        {
            get;
            set;
        }

        public string? Role { get; set; }

        public bool? DeleteAvatar { get; set; } = false;

    }
}
