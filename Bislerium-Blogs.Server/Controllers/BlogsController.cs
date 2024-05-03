using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bislerium_Blogs.Server.Models;
using Bislerium_Blogs.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using System.Reflection.Metadata;
using Bislerium_Blogs.Server.Enums;
using Bislerium_Blogs.Server.Configs;
using Bislerium_Blogs.Server.DTOs;
using Bislerium_Blogs.Server.Interfaces;
using System.Security.Claims;

namespace Bislerium_Blogs.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogsController : ControllerBase
    {
        private readonly BisleriumBlogsContext _context;
        private readonly IS3Service _s3Service;

        public BlogsController(BisleriumBlogsContext context,IS3Service s3Service)
        {
            _context = context;
            _s3Service = s3Service;
        }

        // GET: api/Blogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogPost>>> GetBlogPosts()
        {
            return await _context.BlogPosts.ToListAsync();
        }

        // GET: api/Blogs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BlogPost>> GetBlogPost(Guid id)
        {
            var blogPost = await _context.BlogPosts.FindAsync(id);

            if (blogPost == null)
            {
                return NotFound();
            }

            return blogPost;
        }

        [HttpPatch("{blogPostId}")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<string>> UpdateBlogPost(Guid blogPostId, [FromBody] UpdateBlogDto updateBlogDto)
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
                    foreach (var tagName in updateBlogDto.Tags)
                    {
                        var tag = await _context.Tags.FirstOrDefaultAsync(t => t.TagName.Equals(tagName, StringComparison.OrdinalIgnoreCase));

                        if (tag == null)
                        {
                            // Create new tag if it doesn't exist
                            tag = new Tag
                            {
                                TagName = tagName,
                                CreatedAt = DateTime.Now,
                                UpdatedAt = DateTime.Now
                            };

                            _context.Tags.Add(tag);
                        }

                        // Connect the tag to the blog post
                        blogPost.BlogPostTags.Add(new BlogPostTag { Tag = tag });
                    }
                }

                // Save changes to the database
                await _context.SaveChangesAsync();

                return "Blog Updated";
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
                    BlogPostId = Guid.NewGuid(),
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

                // Add tags to the blog post if tags are provided
                if (publishBlogDto.Tags != null && publishBlogDto.Tags.Length > 0)
                {
                    foreach (var tagName in publishBlogDto.Tags)
                    {
                        var tag = await _context.Tags.FirstOrDefaultAsync(t => t.TagName.Equals(tagName, StringComparison.OrdinalIgnoreCase));

                        if (tag == null)
                        {
                            // Create new tag if it doesn't exist
                            tag = new Tag
                            {
                                TagName = tagName,
                                CreatedAt = DateTime.Now,
                                UpdatedAt = DateTime.Now
                            };

                            _context.Tags.Add(tag);
                        }

                        // Connect the tag to the blog post
                        blogPost.BlogPostTags.Add(new BlogPostTag { Tag = tag });
                    }
                }

                // Save changes to the database
                _context.BlogPosts.Add(blogPost);
                await _context.SaveChangesAsync();

                return "Blog Published, Redirecting to your blog post...";
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

        private bool BlogPostExists(Guid id)
        {
            return _context.BlogPosts.Any(e => e.BlogPostId == id);
        }
    }
}
