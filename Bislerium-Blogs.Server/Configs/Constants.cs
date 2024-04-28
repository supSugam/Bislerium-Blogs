namespace Bislerium_Blogs.Server.Configs
{
    public static class Constants
    {
        public static string ADMIN_PASSWORD = "Admin@123";

        public static string EnumToString<T>(T value)
        {
            return Enum.GetName(typeof(T), value);
        }
       
    }
}
