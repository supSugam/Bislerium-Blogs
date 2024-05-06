using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Bislerium_Blogs.Server.Configs;

namespace Bislerium_Blogs.Server.Models;

public partial class BisleriumBlogsContext : IdentityDbContext
{
    public BisleriumBlogsContext()
    {
    }

    public BisleriumBlogsContext(DbContextOptions<BisleriumBlogsContext> options)
        : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer("Server=localhost;Database=BisleriumBlogs;Trusted_Connection=True;TrustServerCertificate=True");
        }
    }

    public virtual DbSet<BlogPost> BlogPosts { get; set; }

    public virtual DbSet<BlogPostHistory> BlogPostHistories { get; set; }

    public virtual DbSet<Bookmark> Bookmarks { get; set; }

    public virtual DbSet<Comment> Comments { get; set; }

    public virtual DbSet<CommentHistory> CommentHistories { get; set; }


    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Reaction> Reactions { get; set; }

    public virtual DbSet<Tag> Tags { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Otp> Otps { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<BlogPostTag>()
            .HasKey(bt => new { bt.BlogPostId, bt.TagId });

        modelBuilder.Entity<BlogPostTag>()
            .HasOne(bt => bt.BlogPost)
            .WithMany(b => b.BlogPostTags)
            .HasForeignKey(bt => bt.BlogPostId);

        modelBuilder.Entity<BlogPostTag>()
            .HasOne(bt => bt.Tag)
            .WithMany(t => t.BlogPostTags)
            .HasForeignKey(bt => bt.TagId);


        modelBuilder.Entity<BlogPost>(entity =>
        {
            entity.HasKey(e => e.BlogPostId).HasName("PK__BlogPost__3217416967EE6FB5");

            entity.Property(e => e.BlogPostId).HasDefaultValueSql("(newid())");
            entity.Property(e => e.Body).HasColumnType("text");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Popularity).HasColumnName("popularity");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.Author).WithMany(p => p.BlogPosts)
                .HasForeignKey(d => d.AuthorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BlogPosts__Autho__412EB0B6");
        });

        modelBuilder.Entity<BlogPostHistory>(entity =>
        {
            entity.HasKey(e => e.BlogPostHistoryId).HasName("PK__BlogPost__E05DD7E774F4912D");

            entity.ToTable("BlogPostHistory");

            entity.Property(e => e.BlogPostHistoryId).HasDefaultValueSql("(newid())");
            entity.Property(e => e.Body).HasColumnType("text");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.BlogPost).WithMany(p => p.BlogPostHistories)
                .HasForeignKey(d => d.BlogPostId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BlogPostH__BlogP__45F365D3");
        });

        modelBuilder.Entity<Bookmark>(entity =>
        {
            entity.HasKey(e => e.BookmarkId).HasName("PK__Bookmark__541A3B71FE562A81");

            entity.Property(e => e.BookmarkId).HasDefaultValueSql("(newid())");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.BlogPost).WithMany(p => p.Bookmarks)
                .HasForeignKey(d => d.BlogPostId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Bookmarks__BlogP__6383C8BA");

            entity.HasOne(d => d.User).WithMany(p => p.Bookmarks)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Bookmarks__UserI__628FA481");
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.CommentId).HasName("PK__Comments__C3B4DFCA354D11FE");

            entity.Property(e => e.CommentId).HasDefaultValueSql("(newid())");
            entity.Property(e => e.Body).HasColumnType("text");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.Author).WithMany(p => p.Comments)
                .HasForeignKey(d => d.AuthorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Comments__Author__4CA06362");

            entity.HasOne(d => d.BlogPost).WithMany(p => p.Comments)
                .HasForeignKey(d => d.BlogPostId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Comments__BlogPo__4D94879B");

            entity.HasOne(d => d.ParentComment).WithMany(p => p.InverseParentComment)
                .HasForeignKey(d => d.ParentCommentId)
                .HasConstraintName("FK__Comments__Parent__4E88ABD4");
        });

        modelBuilder.Entity<CommentHistory>(entity =>
        {
            entity.HasKey(e => e.CommentHistoryId).HasName("PK__CommentH__E7507DBB25870158");

            entity.ToTable("CommentHistory");

            entity.Property(e => e.CommentHistoryId).HasDefaultValueSql("(newid())");
            entity.Property(e => e.Body).HasColumnType("text");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.Comment).WithMany(p => p.CommentHistories)
                .HasForeignKey(d => d.CommentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CommentHi__Comme__52593CB8");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E128CF7E86A");

            entity.Property(e => e.NotificationId).HasDefaultValueSql("(newid())");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.TriggerUser)  // Change 'User' to 'TriggerUser'
                .WithMany()  // Assuming 'User' has a collection of notifications
                .HasForeignKey(d => d.TriggerUserId)  // Match foreign key property
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Notificat__TriggerUser__68487DD7");  // Update constraint name

            entity.HasOne(d => d.BlogPost)
                .WithMany(p => p.Notifications)
                .HasForeignKey(d => d.BlogPostId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Notificat__BlogP__693CA210");

            entity.HasOne(d => d.Comment)
                .WithMany()  // Assuming 'Comment' has a collection of notifications
                .HasForeignKey(d => d.CommentId)  // Match foreign key property
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Notificat__Comment__6B24EA82");  // Example of a modified constraint name
        });


        modelBuilder.Entity<Reaction>(entity =>
        {
            entity.HasKey(e => e.ReactionId).HasName("PK__Reaction__46DDF9B4DD001AD6");

            entity.Property(e => e.ReactionId).HasDefaultValueSql("(newid())");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.BlogPost).WithMany(p => p.Reactions)
                .HasForeignKey(d => d.BlogPostId)
                .HasConstraintName("FK__Reactions__BlogP__5BE2A6F2");

            entity.HasOne(d => d.Comment).WithMany(p => p.Reactions)
                .HasForeignKey(d => d.CommentId)
                .HasConstraintName("FK__Reactions__Comme__5CD6CB2B");

            entity.HasOne(d => d.User).WithMany(p => p.Reactions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Reactions__UserI__5AEE82B9");
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.TagId).HasName("PK__Tags__657CF9AC58698391");

            entity.HasIndex(e => e.TagName, "UQ__Tags__BDE0FD1D05A4B2EE").IsUnique();

            entity.Property(e => e.TagId).HasDefaultValueSql("(newid())");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.TagName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(sysdatetime())");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C3B5FE7AC");

            entity.HasIndex(e => e.Username, "UQ__Users__536C85E435CD5759").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Users__A9D1053494AA17E2").IsUnique();

            entity.Property(e => e.UserId).HasDefaultValueSql("(newid())");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.FullName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);

        base.OnModelCreating(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
