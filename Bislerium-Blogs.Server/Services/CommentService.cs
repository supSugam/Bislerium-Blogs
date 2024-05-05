using Bislerium_Blogs.Server.Configs;
using Bislerium_Blogs.Server.Interfaces;
using Bislerium_Blogs.Server.Models;
using Bislerium_Blogs.Server.Payload;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Bislerium_Blogs.Server.Services
{
    public class CommentService : ICommentService
    {
        private readonly BisleriumBlogsContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IUserService _userService;

        public CommentService(BisleriumBlogsContext context
            , UserManager<IdentityUser> userManager, IUserService userService)
        {
            _context = context;
            _userManager = userManager;
            _userService = userService;
        }


        public async Task<CommentPayload> GetCommentByIdAsync(Guid commentId, bool includeReplies=
            true)
        {
            try
            {
                var comment = await _context.Comments.FirstOrDefaultAsync(c => c.CommentId == commentId);
                if (comment == null)
                {
                    throw new Exception("Comment not found");
                }

                var authorRole = await _userService.GetRoleByUserId(comment.Author.UserId);

                if (comment.Author == null)
                {
                    Console.WriteLine(comment?.Author?.FullName);
                    throw new Exception("Author not found");
                }
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
                            Role = authorRole
                        },
                        BlogPostId = comment.BlogPostId,
                        ParentCommentId = comment.ParentCommentId,
                        Replies = includeReplies == true ? await GetRepliesAsync(comment.CommentId, true): []
                    };


            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<List<CommentPayload>> GetCommentsAsync(Guid blogPostId, bool includeReplies=true)
        {
            try
            {
                var comments = await _context.Comments
                    .Where(c => c.BlogPostId == blogPostId && c.ParentCommentId == null)
                    .Include(c => c.Author)
                    .OrderByDescending(c => c.CreatedAt)
                    .ToListAsync();

                if (comments.Count == 0)
                {
                    return new List<CommentPayload>();
                }

                var commentPayloads = new List<CommentPayload>();

                foreach (var comment in comments)
                {
                    if(comment == null || comment.Author == null)
                    {
                        continue;
                    }
                    UserPayload? commentator = await _userService.GetUserById(comment.Author.UserId);

                    if(commentator == null)
                    {
                        continue;
                    }

                    var commentPayload = new CommentPayload
                    {
                        CommentId = comment.CommentId,
                        Body = comment.Body,
                        CreatedAt = comment.CreatedAt,
                        UpdatedAt = comment.UpdatedAt,
                        Author = commentator,
                        BlogPostId = comment.BlogPostId,
                        ParentCommentId = comment.ParentCommentId
                    };

                    if (includeReplies)
                    {
                        var replies = await GetRepliesAsync(comment.CommentId, includeReplies);
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
        

        public async Task<CommentReactionsPayload> ReactToACommentAsync
            (Guid commentId, Guid userId, bool isUpvote)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(commentId, nameof(commentId));
                ArgumentNullException.ThrowIfNull(userId, nameof(userId));

                var existingVote = await _context.Reactions.FirstOrDefaultAsync(x => x.CommentId == commentId && x.UserId == userId);

                if (existingVote is not null)
                {
                    if (existingVote.IsUpvote == isUpvote)
                    {
                        _context.Reactions.Remove(existingVote);
                    }
                    else
                    {
                        existingVote.IsUpvote = isUpvote;
                    }
                }
                else
                {
                    await _context.Reactions.AddAsync(new Reaction
                    {
                        CommentId = commentId,
                        UserId = userId,
                        IsUpvote = isUpvote
                    });
                }

                await _context.SaveChangesAsync();
                return await GetCommentReactionDetails(commentId, userId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<int> GetPopularityOfComment(Guid commentId)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(commentId, nameof(commentId));
                var totalUpvotes = await _context.Reactions.CountAsync(x => x.CommentId == commentId && x.IsUpvote);
                var totalDownvotes = await _context.Reactions.CountAsync(x => x.CommentId == commentId && !x.IsUpvote);
                var totalComments = await _context.Comments.CountAsync(x => x.CommentId == commentId);

                int popularity = totalUpvotes * Constants.UPVOTE_WEIGHTAGE + totalDownvotes * Constants.DOWNVOTE_WEIGHTAGE;

                //await _context.Comments.Where(x => x.CommentId == commentId).ForEachAsync(x => x. = popularity);
                //await _context.SaveChangesAsync();
                return popularity;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public async Task<CommentReactionsPayload>
            GetCommentReactionDetails(Guid commentId, Guid? userId)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(commentId, nameof(commentId));
                ArgumentNullException.ThrowIfNull(userId, nameof(userId));

                bool isVotedUp = userId is not null && await _context.Reactions.AnyAsync(x => x.CommentId == commentId && x.UserId == userId && x.IsUpvote);
                bool isVotedDown =
                    userId is not null && await _context.Reactions.AnyAsync(x => x.CommentId == commentId && x.UserId == userId && !x.IsUpvote);
                var totalReplies = await _context.Comments.CountAsync(x => x.ParentCommentId == commentId);


                return new CommentReactionsPayload
                {
                    Popularity = await GetPopularityOfComment(commentId),
                    IsVotedUp = isVotedUp,
                    IsVotedDown = isVotedDown,
                    TotalReplies = totalReplies
                };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public async Task<List<CommentHistory>> GetCommentHistoryAsync(Guid commentId)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(commentId, nameof(commentId));
                return await _context.CommentHistories.Where(x => x.CommentId == commentId).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
