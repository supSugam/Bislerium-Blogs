using Bislerium_Blogs.Server.Configs;
using Bislerium_Blogs.Server.DTOs;
using Bislerium_Blogs.Server.Enums;
using Bislerium_Blogs.Server.Interfaces;
using Bislerium_Blogs.Server.Models;
using Bislerium_Blogs.Server.Payload;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Bislerium_Blogs.Server.Services
{
    public class BlogService : IBlogService
    {
        private readonly BisleriumBlogsContext _context;
        private readonly INotificationService _notificationService;
        private readonly IUserService _userService;


        public BlogService(BisleriumBlogsContext context,
            INotificationService notificationService,
            IUserService userService)
        {
            _context = context;
            _notificationService = notificationService;
            _userService = userService;
        }


        public async Task<List<Tag>> GetAllTagsOfABlog(Guid blogPostId)
        {
            try
            {

            var blogPostTags = await _context.Tags
                .Where(tag => tag.BlogPostTags.Any(blogPostTag => blogPostTag.BlogPostId == blogPostId))
                .ToListAsync();
                return blogPostTags;

            }

            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

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

        public async Task<BlogHistoryPayload> GetBlogHistoryByIdAsync(Guid blogHistoryId)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(blogHistoryId, nameof(blogHistoryId));

                var blogHistory = await _context.BlogPostHistories
                    .Include(x => x.BlogPostHistoryTags)
                    .ThenInclude(x => x.Tag)
                    .Include(x => x.BlogPost)
                    .FirstOrDefaultAsync(x => x.BlogPostHistoryId == blogHistoryId);

                if (blogHistory is null)
                {
                    throw new Exception("Blog History Not Found..");
                }
                var author = await _userService.GetUserById(blogHistory.BlogPost.AuthorId);

                if (author is null)
                {
                    throw new Exception("Author Not Found..");
                }

                var options = new JsonSerializerOptions
                {
                    ReferenceHandler = ReferenceHandler.Preserve
                };

                // Serialize the blog history payload with the preserve reference handler
                var payloadJson = JsonSerializer.Serialize(new BlogHistoryPayload
                {
                    BlogPostHistoryId = blogHistory.BlogPostHistoryId,
                    BlogPostId = blogHistory.BlogPostId,
                    Title = blogHistory.Title,
                    Body = blogHistory.Body,
                    Thumbnail = blogHistory.Thumbnail,
                    ChangesSummary = blogHistory.ChangesSummary,
                    UpdatedAt = blogHistory.UpdatedAt,
                    Tags = blogHistory.BlogPostHistoryTags.Select(x => x.Tag).ToList(),
                    Author = author
                }, options);

                // Deserialize the payload back to the BlogHistoryPayload object
                return JsonSerializer.Deserialize<BlogHistoryPayload>(payloadJson, options);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public Task<List<BlogHistoryPreviewPayload>> GetHistoryPreviewByBlogIdAsync(Guid blogPostId)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(blogPostId, nameof(blogPostId));

                return _context.BlogPostHistories
                    .Where(x => x.BlogPostId == blogPostId)
                    .Select(x => new BlogHistoryPreviewPayload
                    {
                        BlogPostHistoryId = x.BlogPostHistoryId,
                        BlogPostId = blogPostId,
                        Title = x.Title,
                        Thumbnail = x.Thumbnail,
                        ChangesSummary = x.ChangesSummary,
                        UpdatedAt = x.UpdatedAt
                    })
                    .ToListAsync();
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
                await _notificationService.SendBlogReactionNotification(blogPostId, userId, isUpvote);

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
                var isBookmarked = userId is not null && await _context.Bookmarks.AnyAsync(x => x.BlogPostId == blogPostId && x.UserId == userId);

                return new VotePayload
                {
                    Popularity = await UpdatePopularityOfABlog(blogPostId),
                    IsVotedUp = isVotedUp,
                    IsVotedDown = isVotedDown,
                    TotalComments = totalComments,
                    IsBookmarked = isBookmarked
                };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public async Task<bool> BookmarkBlogPostAsync(Guid blogPostId, Guid userId)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(blogPostId, nameof(blogPostId));
                ArgumentNullException.ThrowIfNull(userId, nameof(userId));

                var existingBookmark = await _context.Bookmarks.FirstOrDefaultAsync(x => x.BlogPostId == blogPostId && x.UserId == userId);
                if (existingBookmark is null)
                {
                    await _context.Bookmarks.AddAsync(new Bookmark
                    {
                        BlogPostId = blogPostId,
                        UserId = userId
                    });
                    await _context.SaveChangesAsync();
                    await _notificationService.SendBookmarkedBlogNotification(blogPostId, userId);
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> RemoveBookmarkAsync(Guid blogPostId, Guid userId)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(blogPostId, nameof(blogPostId));
                ArgumentNullException.ThrowIfNull(userId, nameof(userId));

                var existingBookmark = await _context.Bookmarks.FirstOrDefaultAsync(x => x.BlogPostId == blogPostId && x.UserId == userId);
                if (existingBookmark is not null)
                {
                    _context.Bookmarks.Remove(existingBookmark);
                    await _context.SaveChangesAsync();
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<BlogPayload>> GetAllBookmarksOfAUser(Guid userId)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(userId, nameof(userId));

                var bookmarks = await _context.Bookmarks
                    .Where(x => x.UserId == userId)
                    .Include(x => x.BlogPost)
                    .Select(x => new BlogPayload
                    {
                        BlogPostId = x.BlogPost.BlogPostId,
                        Title = x.BlogPost.Title,
                        Body = x.BlogPost.Body,
                        Popularity = x.BlogPost.Popularity,
                        Tags = x.BlogPost.BlogPostTags.Select(x => x.Tag).ToList(),
                        CreatedAt = x.BlogPost.CreatedAt,
                        UpdatedAt = x.BlogPost.UpdatedAt,
                        Author = new UserPayload
                        {
                            UserId = x.BlogPost.AuthorId,
                            Username = x.BlogPost.Author.Username,
                            AvatarUrl = x.BlogPost.Author.AvatarUrl,
                            Email = x.BlogPost.Author.Email,
                            Role = Constants.EnumToString(UserRole.BLOGGER),
                            FullName = x.BlogPost.Author.FullName,
                            CreatedAt = x.BlogPost.Author.CreatedAt,
                            UpdatedAt = x.BlogPost.Author.UpdatedAt
                        },
                        VotePayload = new VotePayload
                        {
                            Popularity = x.BlogPost.Popularity,
                            IsVotedUp = x.BlogPost.Reactions.Any(x => x.UserId == userId && x.IsUpvote),
                            IsVotedDown = x.BlogPost.Reactions.Any(x => x.UserId == userId && !x.IsUpvote),
                            TotalComments = x.BlogPost.Comments.Count,
                            IsBookmarked = true
                        },
                        Thumbnail = x.BlogPost.Thumbnail,
                        
                    })
                    .ToListAsync();

                return bookmarks;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public async Task<bool> IsBlogBookmarked(Guid blogPostId, Guid userId)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(blogPostId, nameof(blogPostId));
                ArgumentNullException.ThrowIfNull(userId, nameof(userId));

                return await _context.Bookmarks.AnyAsync(x => x.BlogPostId == blogPostId && x.UserId == userId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public async Task<List<BlogPayload>> GetAllBlogsOfAUser(Guid userId)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(userId, nameof(userId));

                var blogs = await _context.BlogPosts
                    .Where(x => x.AuthorId == userId)
                    .Include(x => x.BlogPostTags)
                    .Include(x => x.Author)
                    .Select(x => new BlogPayload
                    {
                        BlogPostId = x.BlogPostId,
                        Title = x.Title,
                        Body = x.Body,
                        Popularity = x.Popularity,
                        Tags = x.BlogPostTags.Select(x => x.Tag).ToList(),
                        CreatedAt = x.CreatedAt,
                        UpdatedAt = x.UpdatedAt,
                        Author = new UserPayload
                        {
                            UserId = x.AuthorId,
                            Username = x.Author.Username,
                            AvatarUrl = x.Author.AvatarUrl,
                            Email = x.Author.Email,
                            Role = Constants.EnumToString(UserRole.BLOGGER),
                            FullName = x.Author.FullName,
                            CreatedAt = x.Author.CreatedAt,
                            UpdatedAt = x.Author.UpdatedAt
                        },
                        VotePayload = new VotePayload
                        {
                            Popularity = x.Popularity,
                            IsVotedUp = x.Reactions.Any(x => x.UserId == userId && x.IsUpvote),
                            IsVotedDown = x.Reactions.Any(x => x.UserId == userId && !x.IsUpvote),
                            TotalComments = x.Comments.Count,
                            IsBookmarked = x.Bookmarks.Any(x => x.UserId == userId)
                        },
                        Thumbnail = x.Thumbnail
                    })
                    .ToListAsync();

                return blogs;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public string BlogUpdateSummaryBuilder(bool titleUpdates, bool tagsUpdated,bool thumbnailUpdated, bool bodyUpdated)
        {
            string summary = "Updated ";

            if (titleUpdates)
            {
                bool hasMoreUpdates = tagsUpdated || thumbnailUpdated || bodyUpdated;
                summary += hasMoreUpdates ? "title, " : "title of the blog.";
                if(!hasMoreUpdates) return summary;
            }
            if (tagsUpdated)
            {
                bool hasMoreUpdates = thumbnailUpdated || bodyUpdated;
                summary += hasMoreUpdates ? "tags, " : titleUpdates ? "and tags of the blog." : "tags of the blog.";
                if (!hasMoreUpdates) return summary;
            }
            if (thumbnailUpdated)
            {
                bool hasMoreUpdates = bodyUpdated;
                summary += hasMoreUpdates ? "thumbnail, " : titleUpdates || tagsUpdated ? "and thumbnail of the blog." : "thumbnail of the blog.";
                if (!hasMoreUpdates) return summary;
            }
            if (bodyUpdated)
            {
                summary += titleUpdates || tagsUpdated || thumbnailUpdated ? "and body contents of the blog." : "body contents of the blog.";
            }
            return summary;
        }


        public async Task<BlogPaginationPayload> GetBlogPaginationPayload(BlogPaginationDto blogPaginationDto, Guid? userId)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(blogPaginationDto, nameof(blogPaginationDto));

                var query = _context.BlogPosts
                    .Include(x => x.Author)
                    .Include(x => x.BlogPostTags)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(blogPaginationDto.Search))
                {
                    query = query.Where(x => x.Title.Contains(blogPaginationDto.Search) || x.Body.Contains(blogPaginationDto.Search));
                }

                if (blogPaginationDto.OfThisSpecificMonth is not null)
                {
                    query = query.Where(x => x.CreatedAt.Month == blogPaginationDto.OfThisSpecificMonth.Value.Month && x.CreatedAt.Year == blogPaginationDto.OfThisSpecificMonth.Value.Year);
                }

                if (blogPaginationDto.Tags is not null && blogPaginationDto.Tags.Count > 0)
                {
                    query = query.Where(x => x.BlogPostTags.Any(y => blogPaginationDto.Tags.Contains(y.Tag.TagName) || blogPaginationDto.Tags.Contains(y.Tag.TagId.ToString())));
                }

                query = blogPaginationDto.SortBy switch
                {
                    SortBy.POPULARARITY => query.OrderByDescending(x => x.Popularity),
                    SortBy.NEWEST => query.OrderByDescending(x => x.CreatedAt),
                    SortBy.OLDEST => query.OrderBy(x => x.CreatedAt),
                    _ => query.OrderByDescending(x => x.CreatedAt)
                };

                var totalBlogs = await query.CountAsync();
                var blogs = await query
                    .Skip((blogPaginationDto.PageNumber??1 - 1) * blogPaginationDto.PageSize??10)
                    .Take(blogPaginationDto.PageSize??10)
                    .Select(x => new BlogPayload
                    {
                        BlogPostId = x.BlogPostId,
                        Title = x.Title,
                        Body = x.Body,
                        Popularity = x.Popularity,
                        Tags = x.BlogPostTags.Select(x => x.Tag).ToList(),
                        CreatedAt = x.CreatedAt,
                        UpdatedAt = x.UpdatedAt,
                        Thumbnail = x.Thumbnail,
                        Author = new UserPayload
                        {
                            UserId = x.AuthorId,
                            Username = x.Author.Username,
                            AvatarUrl = x.Author.AvatarUrl,
                            Email = x.Author.Email,
                            Role = Constants.EnumToString(UserRole.BLOGGER),
                            FullName = x.Author.FullName,
                            CreatedAt = x.Author.CreatedAt,
                            UpdatedAt = x.Author.UpdatedAt
                        },
                        VotePayload = userId !=null ? new VotePayload
                        {
                            Popularity = x.Popularity,
                            IsVotedUp = x.Reactions.Any(x => x.UserId == userId && x.IsUpvote),
                            IsVotedDown = x.Reactions.Any(x => x.UserId == userId && !x.IsUpvote),
                            IsBookmarked = x.Bookmarks.Any(x => x.UserId == userId),
                            TotalComments = x.Comments.Count
                        }:new VotePayload(),
                    })
                    .ToListAsync();

                return new BlogPaginationPayload

                {
                    Blogs = blogs,
                    TotalBlogs = totalBlogs,
                    CurrentPage = blogPaginationDto.PageNumber??1
                };

            }

            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        }
}
