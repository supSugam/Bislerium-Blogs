using Bislerium_Blogs.Server.Services;

namespace Bislerium_Blogs.Server.Interfaces
{
    public interface IEmailService
    {
        public Task SendEmailAsync(MailData mailData);

       public string GetOtpVerificationEmailBody(string name, int[] otp);

        public Task SendOTP(string email, string name);
    }
}
