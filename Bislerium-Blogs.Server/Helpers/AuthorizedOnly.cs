using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Bislerium_Blogs.Server.Helpers
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
    public class AuthorizedOnlyAttribute : Attribute, IAuthorizationFilter
    {
        public string Roles { get; set; } // Property to specify the required roles

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            // Check if user is authenticated
            if (!context.HttpContext.User.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedObjectResult("You are not authorized to access this resource.");
                return;
            }

            // Check if the user has the required role
            if (!string.IsNullOrEmpty(Roles) && !context.HttpContext.User.IsInRole(Roles))
            {
                context.Result = new ForbidResult(); // Return 403 Forbidden if the user doesn't have the required role
                return;
            }
        }
    }
}
