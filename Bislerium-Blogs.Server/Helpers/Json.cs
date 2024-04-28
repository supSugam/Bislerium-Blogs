using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Bislerium_Blogs.Server.Helpers
{
    public static class JSON
    {
        public static bool IsValidJSON(this string json)
        {
            try
            {
                JToken.Parse(json);
                return true;
            }
            catch (JsonReaderException)
            {
                return false;
            }
        }

        public static string ParseJSON(this string json)
        {
            return JToken.Parse(json).ToString(Formatting.Indented);
        }
    }
}
