using Bislerium_Blogs.Server.Configs;
using Bislerium_Blogs.Server.Interfaces;
using Bislerium_Blogs.Server.Models;
using Bislerium_Blogs.Server.Payload;
using Microsoft.EntityFrameworkCore;

namespace Bislerium_Blogs.Server.Services
{
    public class BlogService : IBlogService
    {
        private readonly BisleriumBlogsContext _context;

        public BlogService(BisleriumBlogsContext context)
        {
            _context = context;
        }

        public async Task<List<Tag>> GetAllTagsOfABlog(Guid blogPostId)
        {
            var blogPostTags = await _context.Tags
                .Where(tag => tag.BlogPostTags.Any(blogPostTag => blogPostTag.BlogPostId == blogPostId))
                .ToListAsync();

            return blogPostTags;
        }

        public async Task<bool> CreateBlogHistoryAsync(BlogPostHistory blogPostHistory)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(blogPostHistory, nameof(blogPostHistory));
                await _context.BlogPostHistories.AddAsync(blogPostHistory);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<BlogPostHistory>> GetHistoryByBlogIdAsync(Guid blogPostId)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(blogPostId, nameof(blogPostId));
                return await _context.BlogPostHistories.Where(x => x.BlogPostId == blogPostId).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<VotePayload> ReactToBlogPostAsync(Guid blogPostId, Guid userId, bool isUpvote)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(blogPostId, nameof(blogPostId));
                ArgumentNullException.ThrowIfNull(userId, nameof(userId));

                var existingVote = await _context.Reactions.FirstOrDefaultAsync(x => x.BlogPostId == blogPostId && x.UserId == userId);

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
                        BlogPostId = blogPostId,
                        UserId = userId,
                        IsUpvote = isUpvote
                    });
                }

                await _context.SaveChangesAsync();
                return await GetBlogReactionDetails(blogPostId, userId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<int> UpdatePopularityOfABlog(Guid blogPostId)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(blogPostId, nameof(blogPostId));
                var totalUpvotes = await _context.Reactions.CountAsync(x => x.BlogPostId == blogPostId && x.IsUpvote);
                var totalDownvotes = await _context.Reactions.CountAsync(x => x.BlogPostId == blogPostId && !x.IsUpvote);
                var totalComments = await _context.Comments.CountAsync(x => x.BlogPostId == blogPostId);

                int popularity = totalUpvotes * Constants.UPVOTE_WEIGHTAGE + totalDownvotes * Constants.DOWNVOTE_WEIGHTAGE + totalComments * Constants.COMMENT_WEIGHTAGE;

                await _context.BlogPosts.Where(x => x.BlogPostId == blogPostId).ForEachAsync(x => x.Popularity = popularity);
                await _context.SaveChangesAsync();
                return popularity;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public async Task<VotePayload> GetBlogReactionDetails(Guid blogPostId, Guid? userId)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(blogPostId, nameof(blogPostId));
                ArgumentNullException.ThrowIfNull(userId, nameof(userId));

                bool isVotedUp = userId is not null && await _context.Reactions.AnyAsync(x => x.BlogPostId == blogPostId && x.UserId == userId && x.IsUpvote);
                bool isVotedDown =
                    userId is not null && await _context.Reactions.AnyAsync(x => x.BlogPostId == blogPostId && x.UserId == userId && !x.IsUpvote);
                var totalComments = await _context.Comments.CountAsync(x => x.BlogPostId == blogPostId);


                return new VotePayload
                {
                    Popularity = await UpdatePopularityOfABlog(blogPostId),
                    IsVotedUp = isVotedUp,
                    IsVotedDown = isVotedDown,
                    TotalComments = totalComments
                };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


    }
}
