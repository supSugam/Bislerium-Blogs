using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bislerium_Blogs.Server.Models;
using Bislerium_Blogs.Server.Helpers;
using Bislerium_Blogs.Server.DTOs;
using System.Security.Claims;
using Bislerium_Blogs.Server.Payload;
using System.Reflection.Metadata;
using Bislerium_Blogs.Server.Enums;
using Bislerium_Blogs.Server.Configs;

namespace Bislerium_Blogs.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly BisleriumBlogsContext _context;

        public CommentsController(BisleriumBlogsContext context)
        {
            _context = context;
        }

        // GET: api/Comments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Comment>>> GetComments()
        {
            return await _context.Comments.ToListAsync();
        }

        // GET: api/Comments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Comment>> GetComment(Guid id)
        {
            var comment = await _context.Comments.FindAsync(id);

            if (comment == null)
            {
                return NotFound();
            }

            return comment;
        }

        // PUT: api/Comments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateAComment(Guid id,
            [FromBody] UpdateACommentDto updateACommentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            var IsPermitted = Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value) ==
                comment.AuthorId;
            if (!IsPermitted)
            {
                return Unauthorized("You are not permitted to update this comment");
            }

            // Save to CommentHistory
            var commentHistory = new CommentHistory
            {
                CommentId = comment.CommentId,
                Body = comment.Body,
                UpdatedAt = comment.UpdatedAt
            };
            _context.CommentHistories.Add(commentHistory);

            comment.Body = updateACommentDto.Body;
            comment.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(comment);
        }


        // POST: api/Comments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [AuthorizedOnly]
        public async Task<ActionResult<CommentPayload>> PostComment([FromBody] PostACommentDto? postACommentDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (postACommentDto == null)
                {
                    return BadRequest("Invalid Comment Data");
                }
                var blogExists = await _context.BlogPosts.AnyAsync(b => b.BlogPostId == postACommentDto.BlogPostId);
                if (!blogExists)
                {
                    return NotFound("Blog Post Not Found");
                }

                Guid authorId = Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

                var comment = new Comment
                {
                    Body = postACommentDto.Body,
                    BlogPostId = postACommentDto.BlogPostId,
                    AuthorId = authorId,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                if (postACommentDto.ParentCommentId != null)
                {
                    var parentCommentExists = await _context.Comments.AnyAsync(c => c.CommentId == Guid.Parse(postACommentDto.ParentCommentId));
                    if (!parentCommentExists)
                    {
                        return NotFound("Parent Comment Not Found");
                    }
                    comment.ParentCommentId = Guid.Parse(postACommentDto.ParentCommentId);
                }

                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();

                return new CommentPayload
                {
                    CommentId = comment.CommentId,
                    Body = comment.Body,
                    CreatedAt = comment.CreatedAt,
                    UpdatedAt = comment.UpdatedAt,
                    Author = new UserPayload
                    {
                        UserId = comment.Author.UserId,
                        Username = comment.Author.Username
                    },
                    BlogPostId = comment.BlogPostId,
                    ParentCommentId = comment.ParentCommentId
                };
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // DELETE: api/Comments/5
        [HttpDelete("{id}")]
        [AuthorizedOnly]
        public async Task<ActionResult<string>> DeleteComment(Guid id)
        {
            try
            {

            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }
            var IsPermitted = Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value) == comment.AuthorId || User.IsInRole(Constants.EnumToString(UserRole.ADMIN));

            if (!IsPermitted)
            {
                return Unauthorized("You are not permitted to delete this comment");
            }

            _context.Comments.Remove(comment);
            _context.Comments.RemoveRange(comment.InverseParentComment);
                await _context.SaveChangesAsync();

            return Ok("Comment Deleted");
            }

            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
