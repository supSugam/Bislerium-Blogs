using Bislerium_Blogs.Server.Configs;
using Bislerium_Blogs.Server.Enums;

namespace Bislerium_Blogs.Server.Payload;
public class UserPayload
    {

    public Guid UserId { get; set; }
    public string Email { get; set; }
    public string Username { get; set; }
    public string FullName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string AvatarUrl { get; set; }

    public string Role { get; set; } = Constants.EnumToString(UserRole.USER);
}
