
namespace Bislerium_Blogs.Server.Models
{
    public class Otp
    {
        public Guid OtpId { get; set; }
        public string Email { get; set; }
        public string OtpCode { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

    }
}
