using Bislerium_Blogs.Server.Interfaces;
using Bislerium_Blogs.Server.Models;
using Bislerium_Blogs.Server.Enums;
using Microsoft.EntityFrameworkCore;
using Bislerium_Blogs.Server.Payload;
namespace Bislerium_Blogs.Server.Services
{
    public class NotificationService : INotificationService
    {

        private readonly BisleriumBlogsContext _context;
        private readonly IEmailService _emailService;

        public NotificationService(BisleriumBlogsContext context,
            IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;

        }

        public async Task<List<NotificationPayload>> GetNotificationsAsync(Guid userId)
        {
            try
            {
                var notifications = await _context.Notifications
                    .Include(n => n.TriggerUser)
                    .Include(n => n.BlogPost)
                    .Include(n => n.Comment)
                    .Where(n => n.TargetUserId == userId)
                    .Select(n => new NotificationPayload
                    {
                        NotificationId = n.NotificationId,
                        NotificationType = n.NotificationType,
                        NotificationMessage = n.NotificationMessage,
                        CreatedAt = n.CreatedAt,
                        IsRead = n.IsRead,
                        TriggerUser = new UserPayload
                        {
                            UserId = n.TriggerUser.UserId,
                            FullName = n.TriggerUser.FullName,
                            AvatarUrl = n.TriggerUser.AvatarUrl,
                            Username = n.TriggerUser.Username,
                            Email = n.TriggerUser.Email,
                            CreatedAt = n.TriggerUser.CreatedAt,
                            UpdatedAt = n.TriggerUser.UpdatedAt,
                        },
                        BlogPostId = n.BlogPost.BlogPostId,
                        CommentId = n.Comment == null ? null : n.CommentId
                    }
                        )
                    .OrderByDescending(n => n.CreatedAt)
                    .ToListAsync();

                return notifications;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> MarkNotificationAsRead(Guid notificationId)
        {
            try
            {
                var notification = await _context.Notifications.FindAsync(notificationId);
                if (notification == null)
                {
                    return false;
                }

                notification.IsRead = true;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public async Task<bool> MarkAllNotificationsAsRead(Guid userId)
        {
            try
            {
                var notifications = await _context.Notifications
                    .Where(n => n.TargetUserId == userId)
                    .ToListAsync();

                foreach (var notification in notifications)
                {
                    notification.IsRead = true;
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
    }
}


public async Task<bool> SendBlogReactionNotification(Guid blogPostId, Guid triggerUserId, bool IsUpvote)
        {
            try
            {
                var blogPost = await _context.BlogPosts.FindAsync(blogPostId);
                if (blogPost == null)
                {
                    return false;
                }
                var targetUser = await _context.Users.FindAsync(blogPost.AuthorId);

                if (targetUser == null)
                {
                    return false;
                }

                if(targetUser.UserId == triggerUserId)
                {
                    return false;
                }

                string notificationMessage = $"<strong>{targetUser.FullName}</strong> just {(IsUpvote ? "upvoted" : "downvoted")} your blog post.";

                var notification = new Notification
                {
                    TargetUserId = targetUser.UserId,
                    TriggerUserId = triggerUserId,
                    BlogPostId = blogPostId,
                    NotificationType = IsUpvote ? (byte)NotificationType.UPVOTE_BLOG : (byte)NotificationType.DOWNVOTE_BLOG,
                    NotificationMessage = notificationMessage,
                    CreatedAt = DateTime.Now,
                    IsRead = false
                };

                await _context.Notifications.AddAsync(notification);
                await _context.SaveChangesAsync();
                _emailService.SendNotificationEmail(targetUser.Email, targetUser.FullName, notificationMessage);
                return true;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> SendCommentReactionNotification(Guid commentId, Guid triggerUserId, bool IsUpvote)
        {
            try
            {
                var comment = await _context.Comments.FindAsync(commentId);
                if (comment == null)
                {
                    return false;
                }
                var targetUser = await _context.Users.FindAsync(comment.AuthorId);
                var triggerUser = await _context.Users.FindAsync(triggerUserId);

                if (targetUser == null || triggerUser == null)
                {
                    return false;
                }

                if (targetUser.UserId == triggerUserId)
                {
                    return false;
                }

                var blogPost = await _context.BlogPosts.FindAsync(comment.BlogPostId);

                if (blogPost == null)
                {
                    return false;
                }

                string notificationMessage = $"<strong>{triggerUser.FullName}</strong> just {(IsUpvote ? "upvoted" : "downvoted")} your comment on <strong>{blogPost.Title}</strong>.";

                var notification = new Notification
                {
                    BlogPostId = blogPost.BlogPostId,
                    TargetUserId = targetUser.UserId,
                    TriggerUserId = triggerUserId,
                    CommentId = commentId,
                    NotificationType = IsUpvote ? (byte)NotificationType.UPVOTE_COMMENT : (byte)NotificationType.DOWNVOTE_COMMENT,
                    NotificationMessage = notificationMessage,
                    CreatedAt = DateTime.Now,
                    IsRead = false
                };

                await _context.Notifications.AddAsync(notification);
                await _context.SaveChangesAsync();
                _emailService.SendNotificationEmail(targetUser.Email, targetUser.FullName, notificationMessage);


                return true;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> SendBlogCommentNotification(Guid blogPostId, Guid triggerUserId)
        {
            try
            {
                var blogPost = await _context.BlogPosts.FindAsync(blogPostId);
                if (blogPost == null)
                {
                    return false;
                }
                var targetUser = await _context.Users.FindAsync(blogPost.AuthorId);
                var triggerUser = await _context.Users.FindAsync(triggerUserId);

                if (targetUser == null || triggerUser == null)
                {
                    return false;
                }

                if (targetUser.UserId == triggerUserId)
                {
                    return false;
                }

                string notificationMessage = $"<strong>{triggerUser.FullName}</strong> just commented on your blog post <strong>{blogPost.Title}</strong>.";

                var notification = new Notification
                {
                    BlogPostId = blogPost.BlogPostId,
                    TargetUserId = targetUser.UserId,
                    TriggerUserId = triggerUserId,
                    NotificationType = (byte)NotificationType.COMMENT,
                    NotificationMessage = notificationMessage,
                    CreatedAt = DateTime.Now,
                    IsRead = false
                };

                await _context.Notifications.AddAsync(notification);
                await _context.SaveChangesAsync();
                _emailService.SendNotificationEmail(targetUser.Email, targetUser.FullName, notificationMessage);


                return true;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> SendCommentReplyNotification(Guid commentId, Guid triggerUserId)
        {
            try
            {
                var comment = await _context.Comments.FindAsync(commentId);
                if (comment == null)
                {
                    return false;
                }
                var targetUser = await _context.Users.FindAsync(comment.AuthorId);
                var triggerUser = await _context.Users.FindAsync(triggerUserId);

                if (targetUser == null || triggerUser == null)
                {
                    return false;
                }

                if (targetUser.UserId == triggerUserId)
                {
                    return false;
                }

                var blogPost = await _context.BlogPosts.
                    Include(b => b.Author)
                    .FirstOrDefaultAsync(b => b.BlogPostId == comment.BlogPostId);

                if (blogPost == null)
                {
                    return false;
                }

                string notificationMessageForTargetUser = $"<strong>{triggerUser.FullName}</strong> just replied to your comment on <strong>{blogPost.Title}</strong>.";

                var notificationForTargetUser = new Notification
                {
                    BlogPostId = blogPost.BlogPostId,
                    TargetUserId = targetUser.UserId,
                    TriggerUserId = triggerUserId,
                    CommentId = commentId,
                    NotificationType = (byte)NotificationType.REPLY,
                    NotificationMessage = notificationMessageForTargetUser,
                    CreatedAt = DateTime.Now,
                    IsRead = false
                };

                string notificationMessageForBlogAuthor = $"<strong>{triggerUser.FullName}</strong> replied to <strong>{targetUser.FullName}'s</strong> comment on your blog post.";

                var notificationForBlogAuthor = new Notification
                {
                    BlogPostId = blogPost.BlogPostId,
                    TargetUserId = blogPost.AuthorId,
                    TriggerUserId = triggerUserId,
                    CommentId = commentId,
                    NotificationType = (byte)NotificationType.REPLY,
                    NotificationMessage = notificationMessageForBlogAuthor,
                    CreatedAt = DateTime.Now,
                    IsRead = false
                };

                await _context.Notifications.AddAsync(notificationForTargetUser);
                await _context.Notifications.AddAsync(notificationForBlogAuthor);
                await _context.SaveChangesAsync();
                _emailService.SendNotificationEmail(targetUser.Email, targetUser.FullName, notificationMessageForTargetUser);
                _emailService.SendNotificationEmail(blogPost.Author.Email, blogPost.Author.FullName, notificationMessageForBlogAuthor);


                return true;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> SendBookmarkedBlogNotification(Guid blogPostId, Guid triggerUserId)
        {
            try
            {
                var blogPost = await _context.BlogPosts.Include(b => b.Author).FirstOrDefaultAsync(b => b.BlogPostId == blogPostId);

                if (blogPost == null)
                {
                    return false;
                }

                var triggerUser = await _context.Users.FindAsync(triggerUserId);

                if (triggerUser == null)
                {
                    return false;
                }

                if(triggerUser.UserId == blogPost.AuthorId)
                {
                    return false;
                }

                string notificationMessage = $"<strong>{triggerUser.FullName}</strong> just bookmarked your blog post <strong>{blogPost.Title}</strong>.";

                var notification = new Notification
                {
                    BlogPostId = blogPost.BlogPostId,
                    TargetUserId = blogPost.AuthorId,
                    TriggerUserId = triggerUserId,
                    NotificationType = (byte)NotificationType.BOOKMARK,
                    NotificationMessage = notificationMessage,
                    CreatedAt = DateTime.Now,
                    IsRead = false
                };
                await _context.Notifications.AddAsync(notification);
                await _context.SaveChangesAsync();
                _emailService.SendNotificationEmail(blogPost.Author.Email, blogPost.Author.FullName, notificationMessage);
                return true;
            } catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
    }
