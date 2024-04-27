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
    }
}
