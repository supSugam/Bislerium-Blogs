﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bislerium_Blogs.Server.Models;
using Bislerium_Blogs.Server.Configs;
using Bislerium_Blogs.Server.DTOs;
using Bislerium_Blogs.Server.Interfaces;
using System.Security.Claims;
using Bislerium_Blogs.Server.Payload;
using Bislerium_Blogs.Server.Enums;
using Microsoft.AspNetCore.Identity;
using Bislerium_Blogs.Server.Helpers;
using Bislerium_Blogs.Server.Services;

namespace Bislerium_Blogs.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogsController : ControllerBase
    {
        private readonly BisleriumBlogsContext _context;
        private readonly IS3Service _s3Service;
        private readonly IUserService _userService;
        private readonly IBlogService _blogService;

        public BlogsController(BisleriumBlogsContext context,IS3Service s3Service, IUserService userService, IBlogService blogService)
        {
            _context = context;
            _s3Service = s3Service;
            _userService = userService;
            _blogService = blogService;

        }

        // GET: api/Blogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogPost>>> GetBlogPosts()
        {
            return await _context.BlogPosts.ToListAsync();
        }

        // GET: api/Blogs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BlogPayload>> GetBlogPostById(Guid? id)
        {

            if(id == null)
            {
                return BadRequest("No Blog Id Provided");
            }
            try
            {
                string? userId = null;
                try
                {
                    userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                }
                catch (Exception)
                {
                    userId = null;
                }

                var blogPost = await _context.BlogPosts.FindAsync(id);

            if (blogPost == null)
            {
                return NotFound();
            }

            string role = await _userService.GetRoleByUserId(blogPost.AuthorId) ?? Constants.EnumToString(UserRole.USER);

            var blogPayload = new BlogPayload
            {
                BlogPostId = blogPost.BlogPostId,
                Title = blogPost.Title,
                Body = blogPost.Body,
                Thumbnail = blogPost.Thumbnail,
                CreatedAt = blogPost.CreatedAt,
                UpdatedAt = blogPost.UpdatedAt,
                Author = new UserPayload
                {
                    UserId = blogPost.Author.UserId,
                    Email = blogPost.Author.Email,
                    Username = blogPost.Author.Username,
                    FullName = blogPost.Author.FullName,
                    CreatedAt = blogPost.Author.CreatedAt,
                    UpdatedAt = blogPost.Author.UpdatedAt,
                    AvatarUrl = blogPost.Author.AvatarUrl,
                    Role = role
                },
                Popularity = blogPost.Popularity,
                Tags = await _blogService.GetAllTagsOfABlog(blogPost.BlogPostId),
                VotePayload = await _blogService.GetBlogReactionDetails(blogPost.BlogPostId, userId is not null ? Guid.Parse(userId):null)
            };

                return Ok(blogPayload);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPatch("{blogPostId}")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<string>> UpdateBlogPost(Guid blogPostId, [FromForm] UpdateBlogDto updateBlogDto)
        {
            try
            {
                var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;

                var blogPost = await _context.BlogPosts
                    .Include(bp => bp.BlogPostTags)
                    .FirstOrDefaultAsync(bp => bp.BlogPostId == blogPostId);

                if (blogPost == null)
                {
                    return NotFound("Blog Not Found");
                }


                // Check if the user is the author of the blog post
                if (blogPost.AuthorId != Guid.Parse(userId))
                {
                    return Unauthorized("Only the author can update the blog post");
                }

                // Add BlogPostHistory
                var blogPostHistory = new BlogPostHistory
                {
                    BlogPostId = blogPost.BlogPostId,
                    Title = blogPost.Title,
                    Body = blogPost.Body,
                    UpdatedAt = blogPost.UpdatedAt
                };

                await _blogService.CreateBlogHistoryAsync(blogPostHistory);

                // Update blog post properties
                blogPost.Title = updateBlogDto.Title ?? blogPost.Title; // Only update if not null
                blogPost.Body = updateBlogDto.Body ?? blogPost.Body; // Only update if not null

                // Check if thumbnail exists and its size is less than or equal to 3MB
                if (updateBlogDto.Thumbnail != null)
                {
                    if (updateBlogDto.Thumbnail.Length > 3000000)
                    {
                        return BadRequest("Thumbnail size should not exceed 3MB");
                    }

                    // Upload thumbnail to S3
                    string thumbnailUrl = await _s3Service.UploadFileToS3(updateBlogDto.Thumbnail, Constants.BLOG_THUMBNAILS_DIRECTORY, blogPost.BlogPostId.ToString());
                    blogPost.Thumbnail = thumbnailUrl;
                }

                // Update tags if provided
                if (updateBlogDto.Tags != null)
                {
                    // Clear existing tags
                    blogPost.BlogPostTags.Clear();

                    // Add new tags
                    foreach (var tagId in updateBlogDto.Tags)
                    {
                        var tag = await _context.Tags.FirstOrDefaultAsync(t => t.TagId.ToString() == tagId);

                        if (tag == null)
                        {
                            return NotFound("Tag Not Found");
                        }

                        blogPost.BlogPostTags.Add(new BlogPostTag { Tag = tag });
                    }
                }

                // Save changes to the database
                await _context.SaveChangesAsync();

                return Ok("Blog Updated");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        // POST: api/Blogs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        //[AuthorizedOnly(Roles = "BLOGGER")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<string>> PostBlogPost(
            [FromForm] PublishBlogDto publishBlogDto)
        {
            try
            {
                if(publishBlogDto == null)
                {
                    return BadRequest("No Data Provided to Publish Blog");
                }
                var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (publishBlogDto.Thumbnail == null)
                {
                    return BadRequest("Thumbnail is required");
                }

                if (publishBlogDto.Thumbnail.Length > 3000000)
                {
                    return BadRequest("Thumbnail size should not exceed 3MB");
                }

                var blogPost = new BlogPost
                {
                    Title = publishBlogDto.Title,
                    Body = publishBlogDto.Body,
                    Thumbnail = publishBlogDto.Thumbnail.FileName,
                    AuthorId = Guid.Parse(userId),
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    Popularity = 0 // Set popularity to initial value
                };

                // Upload thumbnail to S3
                string thumbnailUrl = await _s3Service.UploadFileToS3(publishBlogDto.Thumbnail, Constants.BLOG_THUMBNAILS_DIRECTORY, blogPost.BlogPostId.ToString());
                blogPost.Thumbnail = thumbnailUrl;

                // Add tags to the blog post if tags are provided
                if (publishBlogDto.Tags != null && publishBlogDto.Tags.Length > 0)
                {
                    foreach (var tagId in publishBlogDto.Tags)
                    {
                        var tag = await _context.Tags.
                            FirstOrDefaultAsync(t => t.TagId.ToString() == tagId); 

                        if (tag == null)
                        {
                            return NotFound("Tag Not Found");
                        }

                        blogPost.BlogPostTags.Add(new BlogPostTag { Tag = tag });
                    }
                }

                // Save changes to the database
                _context.BlogPosts.Add(blogPost);
                await _context.SaveChangesAsync();

                return blogPost.BlogPostId.ToString();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        // DELETE: api/Blogs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlogPost(Guid id)
        {
            var blogPost = await _context.BlogPosts.FindAsync(id);
            if (blogPost == null)
            {
                return NotFound();
            }

            _context.BlogPosts.Remove(blogPost);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpPost("{blogPostId}/upvote")]
        [AuthorizedOnly]
        public async Task<ActionResult<VotePayload>> UpvoteBlogPost(Guid blogPostId)
        {
            try
            {
                var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;

                VotePayload votePayload = await _blogService.ReactToBlogPostAsync(blogPostId, Guid.Parse(userId), true);

                return Ok(votePayload);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{blogPostId}/downvote")]
        [AuthorizedOnly]
        public async Task<ActionResult<VotePayload>> DownvoteBlogPost(Guid blogPostId)
        {
            try
            {
                var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;

                VotePayload votePayload = await _blogService.ReactToBlogPostAsync(blogPostId, Guid.Parse(userId), false);

                return Ok(votePayload);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{blogPostId}/reactions")]
        public async Task<ActionResult<CommentReactionsPayload>> GetCommentReactionDetails(Guid blogPostId)
        {
            try
            {
                var userId =
                    User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier) == null ?
                    (Guid?)null :
                    Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

                var reaction = await _blogService.GetBlogReactionDetails(blogPostId, userId);
                return Ok(reaction);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
