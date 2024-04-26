using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Net;
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

        using (var responseBody = new MemoryStream())
        {
            context.Response.Body = responseBody;

            try
            {
                await _next(context);

                if (context.Response.StatusCode >= 400)
                {
                    await HandleErrorResponseAsync(context);
                }
                else
                {
                    await HandleSuccessResponseAsync(context, originalBodyStream);
                }
            }
            finally
            {
                context.Response.Body = originalBodyStream;
            }
        }
    }

    private async Task HandleErrorResponseAsync(HttpContext context)
    {
        context.Response.ContentType = "application/json";
        var errorResponse = new
        {
            path = context.Request.Path,
            statusCode = context.Response.StatusCode,
            message = "An error occurred.",
            success = false
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(errorResponse));
    }

    private async Task HandleSuccessResponseAsync(HttpContext context, Stream originalBodyStream)
    {
        // Manipulate the response if needed

        // Copy original response body to the original stream
        originalBodyStream.Seek(0, SeekOrigin.Begin);
        await originalBodyStream.CopyToAsync(context.Response.Body);
    }
}

// Extension method used to add the middleware to the HTTP request pipeline.
public static class ResponseInterceptorMiddlewareExtensions
{
    public static IApplicationBuilder UseResponseInterceptorMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<ResponseMiddleware>();
    }
}
