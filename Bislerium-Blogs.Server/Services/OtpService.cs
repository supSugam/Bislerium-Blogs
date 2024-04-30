using Bislerium_Blogs.Server.Models;
using Bislerium_Blogs.Server.Interfaces;
namespace Bislerium_Blogs.Server.Services
{
    public class OtpService:IOtpService
    {
        private readonly BisleriumBlogsContext _dbContext;
        public OtpService(
            BisleriumBlogsContext dbContext
            )
        {
            _dbContext = dbContext;
        }

        public async Task<string> GenerateOtpAsync(string email)
        {
            ArgumentNullException.ThrowIfNull(email, nameof(email));
            var otp = new Otp
            {
                Email = email,
                OtpCode = new Random().Next(100000, 999999).ToString()
            };
            var existingOtp = _dbContext.Otps.FirstOrDefault(x => x.Email == email);
            if (existingOtp != null)
            {
                _dbContext.Otps.Remove(existingOtp);
            }
            await _dbContext.Otps.AddAsync(otp);
            await _dbContext.SaveChangesAsync();
            return otp.OtpCode;
        }

        public async Task<bool>
            VerifyOtpAsync(string email, string otp)
        {
            ArgumentNullException.ThrowIfNull(email, nameof(email));
            ArgumentNullException.ThrowIfNull(otp, nameof(otp));
            var existingOtp = _dbContext.Otps.FirstOrDefault(x => x.Email == email && x.OtpCode == otp);
            if (existingOtp == null)
            {
                return false;
            }
            _dbContext.Otps.Remove(existingOtp);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
