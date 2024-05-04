using System;

namespace Bislerium_Blogs.Server.Configs
{
    public static class Constants
    {
        public const string ADMIN_PASSWORD = "Admin@123";
        public const string ADMIN_EMAIL = "super.admin@bislerium.com";
            public const string ADMIN_USERNAME = "SuperAdmin";

        public static string EnumToString<T>(T value)
        {
            return Enum.GetName(typeof(T), value);
        }

        public static readonly string USER_AVATARS_DIRECTORY = "UserAvatars";
        public static readonly string BLOG_THUMBNAILS_DIRECTORY = "BlogThumbnails";

        public static readonly int UPVOTE_WEIGHTAGE = 2;
        public static readonly int DOWNVOTE_WEIGHTAGE = -1;
        public static readonly int COMMENT_WEIGHTAGE = 1;
    }
}
