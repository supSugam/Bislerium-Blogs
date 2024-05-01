namespace Bislerium_Blogs.Server.DTOs
{
    public class VerifyOtpDto
    {
        public string Email { get; set; }
        public int Otp { get; set; }
    }

    public class ResendOtpDto
    {
        public string Email { get; set; }
        public string FullName { get; set; }
        public string? Subject { get; set; }
    }

}
