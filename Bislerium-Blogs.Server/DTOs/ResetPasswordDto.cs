namespace Bislerium_Blogs.Server.DTOs
{
    public class ResetPasswordDto
    {
        public string Email { get; set; }
        public int Otp { get; set; }
        public string Password { get; set; }
    }
}
