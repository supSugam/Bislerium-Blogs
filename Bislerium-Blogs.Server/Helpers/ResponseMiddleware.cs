namespace Bislerium_Blogs.Server.Helpers
{
    using Microsoft.AspNetCore.Http;
    using System.IO;
    using System.Text;
    using System.Text.Json;
    using System.Text.RegularExpressions;
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
            context.Response.ContentType = "application/json";

            try
            {
                await _next(context);
                responseBody.Seek(0, SeekOrigin.Begin);
                string jsonResponse = await new StreamReader(responseBody).ReadToEndAsync();

                if (context.Response.StatusCode >= 400)
                {
                    List<string> allErrors = new();
                    if (JSON.IsValidJSON(jsonResponse))
                    {
                        Console.WriteLine("ISVALIDJSON");
                        Console.WriteLine(jsonResponse);
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
                    await responseBody.WriteAsync(Encoding.UTF8.GetBytes(errorResponseJson)); 
                }
                else
                {
                    Console.WriteLine("jsonResponse");
                    Console.WriteLine(jsonResponse.GetType());
                    Console.WriteLine(jsonResponse);
                    string pattern = @"[""']([^""']+?)[""']";
                    var successResponse = new
                    {
                        path = context.Request.Path.Value,
                        statusCode = context.Response.StatusCode,
                        success = true,
                        result = JSON.IsValidJSON(jsonResponse) ? JsonSerializer.Deserialize<dynamic>(jsonResponse) : Regex.Replace(jsonResponse, pattern, m => m.Groups[1].Value) ?? jsonResponse
                    };

                    var successResponseJson = JsonSerializer.Serialize(successResponse);
                    responseBody.SetLength(0); // Clear the response body
                    await responseBody.WriteAsync(Encoding.UTF8.GetBytes(successResponseJson));

                }
            } catch (Exception ex)
            {
                Console.WriteLine("Error from Middleware");
                Console.WriteLine(ex.Message);

                responseBody.Seek(0, SeekOrigin.Begin);
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

