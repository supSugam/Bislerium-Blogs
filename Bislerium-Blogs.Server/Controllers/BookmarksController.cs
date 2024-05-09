using Bislerium_Blogs.Server.Interfaces;
using Bislerium_Blogs.Server.Helpers;
using Bislerium_Blogs.Server.Payload;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Bislerium_Blogs.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookmarksController : ControllerBase
    {
        private readonly IBlogService _blogService;

        public BookmarksController(
            IBlogService blogService)
        {
            _blogService = blogService;
        }

        [HttpGet]
        [AuthorizedOnly]
        public async Task<ActionResult<List<BlogPayload>>> GetAllOfMyBookmarks() {
            try
            {
                Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
                var bookmarks = await _blogService.GetAllBookmarksOfAUser(userId.ToString());
                return Ok(bookmarks);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpGet("{username}")]
        public async Task<ActionResult<List<BlogPayload>>> GetAllBookmarksOfAUser(string username)
        {
            try
            {
                var bookmarks = await _blogService.GetAllBookmarksOfAUser(username);
                return Ok(bookmarks);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}



