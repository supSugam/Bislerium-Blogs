namespace Bislerium_Blogs.Server.Interfaces
{
    public interface IOtpService
    {
        public Task<string> GenerateOtpAsync(string email);

        public Task<
            bool> VerifyOtpAsync(string email, string otp);
    }
}
