using System.Security.Cryptography;
using System.Text;

public static class Password
{
    public static string GenerateSalt()
    {
        byte[] randomBytes = new byte[16];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    public static string HashPassword(string password, string salt)
    {
        using var sha256 = SHA256.Create();
        var saltedPassword = string.Concat(password, salt);
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
        return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
    }

    public static bool VerifyPassword(string password, string hash, string salt)
    {
        var hashedPassword = HashPassword(password, salt);
        return hash == hashedPassword;
    }
}