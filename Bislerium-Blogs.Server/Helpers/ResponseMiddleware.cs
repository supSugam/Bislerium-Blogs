namespace Bislerium_Blogs.Server.Helpers
{
    using Microsoft.AspNetCore.Http;
    using System.IO;
    using System.Text;
    using System.Text.Json;
    using System.Threading.Tasks;

    public class ResponseMiddleware
    {
        private readonly RequestDelegate _next;

        public ResponseMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var originalBodyStream = context.Response.Body;
            using var responseBody = new MemoryStream();
            context.Response.Body = responseBody;

            try
            {
                await _next(context);
                Console.WriteLine(context.Response.StatusCode);
                if (context.Response.StatusCode >= 400)
                {
                    context.Response.ContentType = "application/json";
                    responseBody.Seek(0, SeekOrigin.Begin);
                    List<string> allErrors = new();
                    string jsonResponse = await new StreamReader(responseBody).ReadToEndAsync();

                    if (JSON.IsValidJSON(jsonResponse))
                    {
                        var resJson = JsonSerializer.Deserialize<Dictionary<string, object>>(jsonResponse);

                        foreach (var key in resJson.Keys)
                        {
                            if (key == "errors")
                            {
                                var errorsDict = JsonSerializer.Deserialize<
                                     Dictionary<string, string[]>>(resJson[key].ToString()) ?? new Dictionary<string, string[]>();
                                foreach (var error in errorsDict.Values)
                                {
                                    foreach (var err in error)
                                    {
                                        allErrors.Add(err);
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        allErrors.Add(jsonResponse);
                    }


                    var errorResponse = new
                    {
                        path = context.Request.Path.Value,
                        statusCode = context.Response.StatusCode,
                        message = allErrors,
                        success = false
                    };

                    var errorResponseJson = JsonSerializer.Serialize(errorResponse);
                    responseBody.SetLength(0); // Clear the response body
                    await responseBody.WriteAsync(Encoding.UTF8.GetBytes(errorResponseJson)); // Write the custom error response
                }
            } catch (Exception ex)
            {
                responseBody.Seek(0, SeekOrigin.Begin);
                context.Response.ContentType = "application/json";
                var errorList = new List<string> { ex.Message };
                var errorResponse = new
                {
                    path = context.Request.Path.Value,
                    statusCode = context.Response.StatusCode,
                    message = errorList,
                    success = false
                };
                var errorResponseJson = JsonSerializer.Serialize(errorResponse);
                responseBody.SetLength(0); // Clear the response body
                await responseBody.WriteAsync(Encoding.UTF8.GetBytes(errorResponseJson));
            }
            finally
            {
                // Copy the modified response back to the original stream
                responseBody.Seek(0, SeekOrigin.Begin);
                await responseBody.CopyToAsync(originalBodyStream);
                context.Response.Body = originalBodyStream;
            }
        }

    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class ResponseInterceptorMiddlewareExtensions
    {
        public static IApplicationBuilder UseResponseMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ResponseMiddleware>();
        }
    }
}

