using Bislerium_Blogs.Server.Interfaces;
using Bislerium_Blogs.Server.Models;
using Bislerium_Blogs.Server.Payload;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Bislerium_Blogs.Server.Services
{
    public class CommentService:ICommentService
    {
        private readonly BisleriumBlogsContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public CommentService(BisleriumBlogsContext context
            , UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        

        public async Task<CommentPayload> GetCommentByIdAsync(Guid commentId)
        {
            try
            {
                var comment = await _context.Comments.FindAsync(commentId);
                if (comment == null)
                {
                    return null;
                }

                var author = await _userManager.FindByIdAsync(comment.Author.UserId.ToString());
                var authorRoles = await _userManager.GetRolesAsync(author);


                return new CommentPayload
                {
                    CommentId = comment.CommentId,
                    Body = comment.Body,
                    CreatedAt = comment.CreatedAt,
                    UpdatedAt = comment.UpdatedAt,
                    Author = new UserPayload
                    {
                        UserId = comment.Author.UserId,
                        FullName = comment.Author.FullName,
                        Username = comment.Author.Username,
                        Email = comment.Author.Email,
                        CreatedAt = comment.Author.CreatedAt,
                        UpdatedAt = comment.Author.UpdatedAt,
                        AvatarUrl = comment.Author.AvatarUrl,
                        Role = authorRoles[0]
                    },
                    BlogPostId = comment.BlogPostId,
                    ParentCommentId = comment.ParentCommentId
                };
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<List<CommentPayload>> GetCommentsAsync(Guid blogPostId, bool includeReplies)
        {
            try
            {
                var comments = await _context.Comments
                    .Where(c => c.BlogPostId == blogPostId && c.ParentCommentId == null)
                    .ToListAsync();

                var commentPayloads = new List<CommentPayload>();

                foreach (var comment in comments)
                {
                    var author = await _userManager.FindByIdAsync(comment.Author.UserId.ToString());
                    var authorRoles = await _userManager.GetRolesAsync(author);

                    var commentPayload = new CommentPayload
                    {
                        CommentId = comment.CommentId,
                        Body = comment.Body,
                        CreatedAt = comment.CreatedAt,
                        UpdatedAt = comment.UpdatedAt,
                        Author = new UserPayload
                        {
                            UserId = comment.Author.UserId,
                            FullName = comment.Author.FullName,
                            Username = comment.Author.Username,
                            Email = comment.Author.Email,
                            CreatedAt = comment.Author.CreatedAt,
                            UpdatedAt = comment.Author.UpdatedAt,
                            AvatarUrl = comment.Author.AvatarUrl,
                            Role = authorRoles[0]
                        },
                        BlogPostId = comment.BlogPostId,
                        ParentCommentId = comment.ParentCommentId
                    };

                    if (includeReplies)
                    {
                        var replies = await GetRepliesAsync(comment.CommentId, true);
                        commentPayload.Replies = replies;
                    }

                    commentPayloads.Add(commentPayload);
                }

                return commentPayloads;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

        }

        public async Task<List<CommentPayload>> GetRepliesAsync(Guid commentId, bool includeReplies = true)
        {
            try
            {
                var replies = await _context.Comments
                    .Where(c => c.ParentCommentId == commentId)
                    .ToListAsync();

                var commentPayloads = new List<CommentPayload>();

                foreach (var reply in replies)
                {
                    var author = await _userManager.FindByIdAsync(reply.Author.UserId.ToString());
                    var authorRoles = await _userManager.GetRolesAsync(author);

                    var commentPayload = new CommentPayload
                    {
                        CommentId = reply.CommentId,
                        Body = reply.Body,
                        CreatedAt = reply.CreatedAt,
                        UpdatedAt = reply.UpdatedAt,
                        Author = new UserPayload
                        {
                            UserId = reply.Author.UserId,
                            FullName = reply.Author.FullName,
                            Username = reply.Author.Username,
                            Email = reply.Author.Email,
                            CreatedAt = reply.Author.CreatedAt,
                            UpdatedAt = reply.Author.UpdatedAt,
                            AvatarUrl = reply.Author.AvatarUrl,
                            Role = authorRoles[0]
                        },
                        BlogPostId = reply.BlogPostId,
                        ParentCommentId = reply.ParentCommentId
                    };

                    if (includeReplies)
                    {
                        var childReplies = await GetRepliesAsync(reply.CommentId, true);
                        commentPayload.Replies = childReplies;
                    }
                    else
                    {
                        commentPayload.Replies = new List<CommentPayload>();
                    }

                    commentPayloads.Add(commentPayload);
                }
                return commentPayloads;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        // TODO: Implement the GetCommentReactionsAsync method, calculating the popularity of a comment etc


        public async Task<CommentReactionsPayload>
            GetCommentReactionsAsync(Guid commentId, Guid? userId)
        {
            try
            {

            }
        }

    }
}
