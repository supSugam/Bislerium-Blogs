using Bislerium_Blogs.Server.Services;

namespace Bislerium_Blogs.Server.Interfaces
{
    public interface IEmailService
    {
        public Task<string> SendEmailAsync(MailData mailData);

       public string GetOtpVerificationEmailBody(string name, string otpDigits);

        public Task SendOTP(string email, string name,string? subject=null);

        public Task<bool> VerifyOTP(string email, int otp);

        public Task SendNotificationEmail(string email, string name, string notificationMessage);

        public string GetNotificationEmailBody(string name, string notificationMessage);


    }
}
