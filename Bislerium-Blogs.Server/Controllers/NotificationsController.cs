using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bislerium_Blogs.Server.Models;
using Bislerium_Blogs.Server.Helpers;
using Bislerium_Blogs.Server.Payload;
using Bislerium_Blogs.Server.Interfaces;
using System.Security.Claims;

namespace Bislerium_Blogs.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly BisleriumBlogsContext _context;
        private readonly INotificationService _notificationService;

        public NotificationsController(BisleriumBlogsContext context,
            INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;

        }

        // GET: api/Notifications
        [HttpGet]
        [AuthorizedOnly]
        public async Task<ActionResult<IEnumerable<NotificationPayload>>> GetNotifications()
        {
            try
            {
            Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
            var notifications= await _notificationService.GetNotificationsAsync(userId);

                return Ok(notifications);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("{notificationId}/read")]
        [AuthorizedOnly]
        public async Task<ActionResult> MarkNotificationAsRead(Guid notificationId)
        {
            try
            {
                var result = await _notificationService.MarkNotificationAsRead(notificationId);
                if (result)
                {
                    return Ok();
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("read")]
        [AuthorizedOnly]
        public async Task<ActionResult> MarkAllNotificationsAsRead()
        {
            try
            {
                Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
                var result = await _notificationService.MarkAllNotificationsAsRead(userId);
                if (result)
                {
                    return Ok();
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
