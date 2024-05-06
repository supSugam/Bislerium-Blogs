using Bislerium_Blogs.Server.Interfaces;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;
namespace Bislerium_Blogs.Server.Services
{

public class EmailService: IEmailService
{
        private readonly EmailSettings _emailSettings;
        private readonly IOtpService _otpService;

        public EmailService(IOptions<EmailSettings> emailSettings, IOtpService otpService)
        {
            _emailSettings = emailSettings.Value;
            _otpService = otpService;
        }

        public Task<string> SendEmailAsync(MailData mailData)
        {
            try
            {
                using MimeMessage emailMessage = new();
                MailboxAddress emailFrom = new(
                    "Bislerium Blogs",
                    _emailSettings.MailUser
                );
                emailMessage.From.Add(emailFrom);
                MailboxAddress emailTo = new(mailData.EmailToName, mailData.EmailToId);
                emailMessage.To.Add(emailTo);

                emailMessage.Cc.Add(new MailboxAddress(
                    "Bislerium Blogs",
                    _emailSettings.MailUser
                ));
                emailMessage.Bcc.Add(new MailboxAddress(
                                           "Bislerium Blogs",
                                                                  _emailSettings.MailUser
                                                                                     ));
                emailMessage.Subject = mailData.EmailSubject;

                BodyBuilder emailBodyBuilder = new()
                {
                    HtmlBody = mailData.EmailBody
                };
                emailMessage.Body = emailBodyBuilder.ToMessageBody();
                using (SmtpClient mailClient = new())
                {
                    mailClient.Connect(
                        _emailSettings.MailHost,
                        _emailSettings.MailPort,
                        SecureSocketOptions.StartTls
                    );
                    mailClient.Authenticate(
                        _emailSettings.MailUser,
                        _emailSettings.MailPass
                    );
                    mailClient.Send(emailMessage);
                    mailClient.Disconnect(true);
                }
                return Task.FromResult("Mail sent successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }

        public async Task SendOTP(string email, string name, string? subject =null)
        {
            var otp = await _otpService.GenerateOtpAsync(email);
            var mailData = new MailData
            {
                EmailToId = email,
                EmailToName = name,
                EmailSubject = subject ?? "Account Verification",
                EmailBody = GetOtpVerificationEmailBody(name, otp)
            };
            await SendEmailAsync(mailData);
        }


        public async Task<bool> VerifyOTP(string email, int otp)
        {
            return await _otpService.VerifyOtpAsync(email, otp.ToString());
        }


        public string GetOtpVerificationEmailBody(string name, string otpDigits)
    {

        return $@"
<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Bislerium Blogs - OTP Verification</title>
    <link rel=""stylesheet"" href=""https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"">
    <style>
        body {{
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f8f8;
        }}
        table {{
            border-collapse: collapse;
            background-color: #f8f8f8;
        }}
        /* Add other styles as needed */
    </style>
</head>
<body>
    <table width=""100%"" cellpadding=""0"" cellspacing=""0"">
        <tbody style=""padding: 40px 0;"">
            <tr>
                <td style=""padding: 20px 0;"">
                    <center>
                        <table cellpadding=""0"" cellspacing=""0"" style=""max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-radius: 10px; overflow: hidden;"">
                            <tbody>
                                <tr>
                                    <td style=""text-align: center; padding: 40px 20px;"">
                                        <h2 style=""margin: 0; color: #333;"">Hi {name} 👋</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td style=""text-align: center; padding: 20px;"">
                                        <p style=""margin: 0; color: #555; font-size: 18px;"">Thank you for registering with Bislerium Blogs! Please use the following verification code to complete your registration.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style=""text-align: center; padding: 20px;"">
                                        {string.Join("", otpDigits.Select(digit => $"<div style=\"display: inline-block; background-color: #f2f2f2; border-radius: 5px; padding: 10px; margin: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); font-size: 24px; color: #333;\">{digit}</div>"))}
                                    </td>
                                </tr>
                                <tr>
                                    <td style=""text-align: center; padding: 20px;"">
                                        <p style=""margin: 0; color: #555; font-size: 18px;"">Please ignore this email if you didn't register. The verification code expires in 5 minutes.</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </center>
                </td>
            </tr>
        </tbody>
    </table>
    <center>
        <p style=""margin-top: 30px; color: #888; font-size: 12px;"">© 2024 Bislerium Blogs. All rights reserved.</p>
    </center>
</body>
</html>
";
    }

  



        public async Task SendNotificationEmail(string email, string name, string notificationMessage)
        {
            var mailData = new MailData
            {
                EmailToId = email,
                EmailToName = name,
                EmailSubject = "New Notification - BislreiumBlogs",
                EmailBody = GetNotificationEmailBody(name, notificationMessage)
            };
            await SendEmailAsync(mailData);
        }

        public string GetNotificationEmailBody(string targetName, string notificationMessage)
        {
            return $@"<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Email Notification</title>
    <style>
        body {{
            font-family: 'Segoe UI', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f8f8;
        }}
Copy code    table {{
        border-collapse: collapse;
        background-color: #f8f8f8;
    }}

    .container {{
        max-width: 600px;
        width: 100%;
        margin: 0 auto;
        background-color: #ffffff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        overflow: hidden;
    }}

    .content {{
        text-align: center;
        padding: 8px 20px;
    }}

    h2 {{
        margin: 0;
        color: #333;
        font-size: 24px;
        margin-bottom: 24px;
    }}

    p {{
        margin: 5px 0;
        color: #555;
        font-size: 18px;
    }}

    .notification-alert {{
        color: #ffffff;
        font-weight: bold;
        background-color: #4CAF50;
        border-radius: 5px;
        padding: 15px 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        font-size: 24px;
        margin-bottom: 30px;
    }}

    .emoji {{
        font-size: 24px;
        vertical-align: middle;
        margin-left: 5px;
    }}

    .footer {{
        margin-top: 30px;
        color: #888;
        font-size: 12px;
        padding: 10px;
        background-color: #f2f2f2;
    }}
</style>
</head>
<body>
    <table width=""100%"" cellpadding=""0"" cellspacing=""0"">
        <tbody style=""padding: 40px 0;"">
            <tr>
                <td style=""padding: 20px 0;"">
                    <center>
                        <div class=""container"">
                            <div class=""notification-alert"">Notification Alert</div>
                            <div class=""content"">
                                <h2>Hi {targetName} 👋</h2>
                                <p style=""margin-top:18px;"">{notificationMessage}</p>
                                <p>Check it up on Bislerium Blogs</p>
                            </div>
                            <div class=""footer"">
                                <p>&copy; 2024 Bislerium Blogs. All rights reserved.</p>
                            </div>
                        </div>
                    </center>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>";
        }
    }

public class EmailSettings
{
    public string MailHost { get; set; }
    public int MailPort { get; set; }
    public string MailUser { get; set; }
    public string MailPass { get; set; }
}
    public class MailData
    {
        public string EmailToId { get; set; }
        public string EmailToName { get; set; }
        public string EmailSubject { get; set; }
        public string EmailBody { get; set; }
    }
}
