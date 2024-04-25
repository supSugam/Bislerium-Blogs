namespace Bislerium_Blogs.Server.Helpers
{
    public class GlobalRoutePrefixMiddleware(RequestDelegate next, string routePrefix)
    {
        private readonly RequestDelegate _next = next;
        private readonly string _routePrefix = routePrefix;

        public async Task InvokeAsync(HttpContext context)
        {
            context.Request.PathBase = new PathString(_routePrefix);
            await _next(context);
        }
    }
}
