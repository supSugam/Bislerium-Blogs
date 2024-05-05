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
using Bislerium_Blogs.Server.Interfaces;

namespace Bislerium_Blogs.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly BisleriumBlogsContext _context;
        private readonly ICommentService _commentService;
        private readonly IUserService _userService;

        public CommentsController(BisleriumBlogsContext context,
            ICommentService commentService,
            IUserService userService)
        {
            _context = context;
            _commentService = commentService;
            _userService = userService;

        }

        // GET: api/Comments
        [HttpGet("{blogPostId}")]
        public async Task<ActionResult<List<CommentPayload>>> GetComments(Guid blogPostId, bool includeReplies=true){
            try
            {
                var comments = await _commentService.GetCommentsAsync(blogPostId, includeReplies);
                return Ok(comments);
    }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
}
}


        // PATCH: api/Comments/5
        [HttpPatch("{id}")]
        public async Task<ActionResult<CommentPayload>> UpdateAComment(Guid id,
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

            var updatedComment = await _commentService.GetCommentByIdAsync(comment.CommentId, true);
            return Ok(updatedComment);
        }


        // POST: api/Comments
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

                if (!Guid.TryParse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value, out Guid authorId))
                {
                    return Unauthorized("You are not permitted to post a comment");
                }


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

                UserPayload? userPayload = await _userService.GetUserById(authorId);

                if(userPayload == null)
                {
                    return NotFound("User Not Found");
                }

                return new CommentPayload
                {
                    CommentId = comment.CommentId,
                    Body = comment.Body,
                    CreatedAt = comment.CreatedAt,
                    UpdatedAt = comment.UpdatedAt,
                    Author = userPayload,
                    BlogPostId = comment.BlogPostId,
                    ParentCommentId = comment.ParentCommentId,
                    Reactions = new CommentReactionsPayload()
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


        [HttpPost("{commentId}/upvote")]
        [AuthorizedOnly]
        public async Task<ActionResult<CommentReactionsPayload>> UpvoteAComment(Guid commentId)
        {
            try
            {
                var userId = Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
                var reaction = await _commentService.ReactToACommentAsync(commentId, userId, true);
                return Ok(reaction);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{commentId}/downvote")]
        [AuthorizedOnly]
        public async Task<ActionResult<CommentReactionsPayload>> DownvoteAComment(Guid commentId)
        {
            try
            {
                var userId = Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
                var reaction = await _commentService.ReactToACommentAsync(commentId, userId, false);
                return Ok(reaction);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("{commentId}/reactions")]
        public async Task<ActionResult<CommentReactionsPayload>> GetCommentReactionDetails(Guid commentId)
        {
            try
            {
                var userId =
                    User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier) == null ?
                    (Guid?)null :
                    Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

                var reaction = await _commentService.GetCommentReactionDetails(commentId, userId);
                return Ok(reaction);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{commentId}/history")]
        public async Task<ActionResult<List<CommentHistory>>> GetCommentHistory(Guid commentId)
        {
            try
            {
                var commentHistory = await _commentService.GetCommentHistoryAsync(commentId);
                return Ok(commentHistory);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

    }
}
