using Bislerium_Blogs.Server.Services;

namespace Bislerium_Blogs.Server.Interfaces
{
    public interface IEmailService
    {
        public Task<string> SendEmailAsync(MailData mailData);

       public string GetOtpVerificationEmailBody(string name, int[] otp);

        public Task<string> SendOTP(string email, string name);

        void StoreOTP(string email, int[] otp);

        bool VerifyOTP(string email, string otp);
    }
}
