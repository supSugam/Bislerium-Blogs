﻿// <auto-generated />
using System;
using Bislerium_Blogs.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Bislerium_Blogs.Server.Migrations
{
    [DbContext(typeof(BisleriumBlogsContext))]
    [Migration("20240501100516_ChangesInImageFields")]
    partial class ChangesInImageFields
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.BlogPost", b =>
                {
                    b.Property<Guid>("BlogPostId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("(newid())");

                    b.Property<Guid>("AuthorId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Body")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("(sysdatetime())");

                    b.Property<int>("Popularity")
                        .HasColumnType("int")
                        .HasColumnName("popularity");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(200)
                        .IsUnicode(false)
                        .HasColumnType("varchar(200)");

                    b.Property<DateTime>("UpdatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("(sysdatetime())");

                    b.HasKey("BlogPostId")
                        .HasName("PK__BlogPost__3217416967EE6FB5");

                    b.HasIndex("AuthorId");

                    b.ToTable("BlogPosts");
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.BlogPostHistory", b =>
                {
                    b.Property<Guid>("BlogPostHistoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("(newid())");

                    b.Property<Guid>("BlogPostId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Body")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(200)
                        .IsUnicode(false)
                        .HasColumnType("varchar(200)");

                    b.Property<DateTime>("UpdatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("(sysdatetime())");

                    b.HasKey("BlogPostHistoryId")
                        .HasName("PK__BlogPost__E05DD7E774F4912D");

                    b.HasIndex("BlogPostId");

                    b.ToTable("BlogPostHistory", (string)null);
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.Bookmark", b =>
                {
                    b.Property<Guid>("BookmarkId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("(newid())");

                    b.Property<Guid>("BlogPostId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("(sysdatetime())");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("BookmarkId")
                        .HasName("PK__Bookmark__541A3B71FE562A81");

                    b.HasIndex("BlogPostId");

                    b.HasIndex("UserId");

                    b.ToTable("Bookmarks");
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.Comment", b =>
                {
                    b.Property<Guid>("CommentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("(newid())");

                    b.Property<Guid>("AuthorId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("BlogPostId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Body")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("(sysdatetime())");

                    b.Property<Guid?>("ParentCommentId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("UpdatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("(sysdatetime())");

                    b.HasKey("CommentId")
                        .HasName("PK__Comments__C3B4DFCA354D11FE");

                    b.HasIndex("AuthorId");

                    b.HasIndex("BlogPostId");

                    b.HasIndex("ParentCommentId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.CommentHistory", b =>
                {
                    b.Property<Guid>("CommentHistoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("(newid())");

                    b.Property<string>("Body")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("CommentId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("UpdatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("(sysdatetime())");

                    b.HasKey("CommentHistoryId")
                        .HasName("PK__CommentH__E7507DBB25870158");

                    b.HasIndex("CommentId");

                    b.ToTable("CommentHistory", (string)null);
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.Image", b =>
                {
                    b.Property<Guid>("ImageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("(newid())");

                    b.Property<Guid>("BlogPostId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("ImageUrl")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ImageId")
                        .HasName("PK__Images__7516F70CE6D39443");

                    b.HasIndex("BlogPostId");

                    b.ToTable("Images");
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.Notification", b =>
                {
                    b.Property<Guid>("NotificationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("(newid())");

                    b.Property<Guid>("BlogPostId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("(sysdatetime())");

                    b.Property<byte>("NotificationType")
                        .HasColumnType("tinyint");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("NotificationId")
                        .HasName("PK__Notifica__20CF2E128CF7E86A");

                    b.HasIndex("BlogPostId");

                    b.HasIndex("UserId");

                    b.ToTable("Notifications");
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.Otp", b =>
                {
                    b.Property<Guid>("OtpId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("OtpCode")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("OtpId");

                    b.ToTable("Otps");
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.Reaction", b =>
                {
                    b.Property<Guid>("ReactionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("(newid())");

                    b.Property<Guid?>("BlogPostId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("CommentId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("(sysdatetime())");

                    b.Property<bool>("IsUpvote")
                        .HasColumnType("bit");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("ReactionId")
                        .HasName("PK__Reaction__46DDF9B4DD001AD6");

                    b.HasIndex("BlogPostId");

                    b.HasIndex("CommentId");

                    b.HasIndex("UserId");

                    b.ToTable("Reactions");
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.Tag", b =>
                {
                    b.Property<Guid>("TagId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("(newid())");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("(sysdatetime())");

                    b.Property<string>("TagName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .IsUnicode(false)
                        .HasColumnType("varchar(50)");

                    b.Property<DateTime>("UpdatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("(sysdatetime())");

                    b.HasKey("TagId")
                        .HasName("PK__Tags__657CF9AC58698391");

                    b.HasIndex(new[] { "TagName" }, "UQ__Tags__BDE0FD1D05A4B2EE")
                        .IsUnique();

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.User", b =>
                {
                    b.Property<Guid>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("(newid())");

                    b.Property<string>("AvatarUrl")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("(sysdatetime())");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100)
                        .IsUnicode(false)
                        .HasColumnType("varchar(100)");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .IsUnicode(false)
                        .HasColumnType("varchar(100)");

                    b.Property<DateTime>("UpdatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("(sysdatetime())");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(50)
                        .IsUnicode(false)
                        .HasColumnType("varchar(50)");

                    b.HasKey("UserId")
                        .HasName("PK__Users__1788CC4C3B5FE7AC");

                    b.HasIndex(new[] { "Username" }, "UQ__Users__536C85E435CD5759")
                        .IsUnique();

                    b.HasIndex(new[] { "Email" }, "UQ__Users__A9D1053494AA17E2")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("RoleId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.BlogPost", b =>
                {
                    b.HasOne("Bislerium_Blogs.Server.Models.User", "Author")
                        .WithMany("BlogPosts")
                        .HasForeignKey("AuthorId")
                        .IsRequired()
                        .HasConstraintName("FK__BlogPosts__Autho__412EB0B6");

                    b.Navigation("Author");
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.BlogPostHistory", b =>
                {
                    b.HasOne("Bislerium_Blogs.Server.Models.BlogPost", "BlogPost")
                        .WithMany("BlogPostHistories")
                        .HasForeignKey("BlogPostId")
                        .IsRequired()
                        .HasConstraintName("FK__BlogPostH__BlogP__45F365D3");

                    b.Navigation("BlogPost");
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.Bookmark", b =>
                {
                    b.HasOne("Bislerium_Blogs.Server.Models.BlogPost", "BlogPost")
                        .WithMany("Bookmarks")
                        .HasForeignKey("BlogPostId")
                        .IsRequired()
                        .HasConstraintName("FK__Bookmarks__BlogP__6383C8BA");

                    b.HasOne("Bislerium_Blogs.Server.Models.User", "User")
                        .WithMany("Bookmarks")
                        .HasForeignKey("UserId")
                        .IsRequired()
                        .HasConstraintName("FK__Bookmarks__UserI__628FA481");

                    b.Navigation("BlogPost");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.Comment", b =>
                {
                    b.HasOne("Bislerium_Blogs.Server.Models.User", "Author")
                        .WithMany("Comments")
                        .HasForeignKey("AuthorId")
                        .IsRequired()
                        .HasConstraintName("FK__Comments__Author__4CA06362");

                    b.HasOne("Bislerium_Blogs.Server.Models.BlogPost", "BlogPost")
                        .WithMany("Comments")
                        .HasForeignKey("BlogPostId")
                        .IsRequired()
                        .HasConstraintName("FK__Comments__BlogPo__4D94879B");

                    b.HasOne("Bislerium_Blogs.Server.Models.Comment", "ParentComment")
                        .WithMany("InverseParentComment")
                        .HasForeignKey("ParentCommentId")
                        .HasConstraintName("FK__Comments__Parent__4E88ABD4");

                    b.Navigation("Author");

                    b.Navigation("BlogPost");

                    b.Navigation("ParentComment");
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.CommentHistory", b =>
                {
                    b.HasOne("Bislerium_Blogs.Server.Models.Comment", "Comment")
                        .WithMany("CommentHistories")
                        .HasForeignKey("CommentId")
                        .IsRequired()
                        .HasConstraintName("FK__CommentHi__Comme__52593CB8");

                    b.Navigation("Comment");
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.Image", b =>
                {
                    b.HasOne("Bislerium_Blogs.Server.Models.BlogPost", "BlogPost")
                        .WithMany("Images")
                        .HasForeignKey("BlogPostId")
                        .IsRequired()
                        .HasConstraintName("FK__Images__BlogPost__571DF1D5");

                    b.Navigation("BlogPost");
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.Notification", b =>
                {
                    b.HasOne("Bislerium_Blogs.Server.Models.BlogPost", "BlogPost")
                        .WithMany("Notifications")
                        .HasForeignKey("BlogPostId")
                        .IsRequired()
                        .HasConstraintName("FK__Notificat__BlogP__693CA210");

                    b.HasOne("Bislerium_Blogs.Server.Models.User", "User")
                        .WithMany("Notifications")
                        .HasForeignKey("UserId")
                        .IsRequired()
                        .HasConstraintName("FK__Notificat__UserI__68487DD7");

                    b.Navigation("BlogPost");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.Reaction", b =>
                {
                    b.HasOne("Bislerium_Blogs.Server.Models.BlogPost", "BlogPost")
                        .WithMany("Reactions")
                        .HasForeignKey("BlogPostId")
                        .HasConstraintName("FK__Reactions__BlogP__5BE2A6F2");

                    b.HasOne("Bislerium_Blogs.Server.Models.Comment", "Comment")
                        .WithMany("Reactions")
                        .HasForeignKey("CommentId")
                        .HasConstraintName("FK__Reactions__Comme__5CD6CB2B");

                    b.HasOne("Bislerium_Blogs.Server.Models.User", "User")
                        .WithMany("Reactions")
                        .HasForeignKey("UserId")
                        .IsRequired()
                        .HasConstraintName("FK__Reactions__UserI__5AEE82B9");

                    b.Navigation("BlogPost");

                    b.Navigation("Comment");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.BlogPost", b =>
                {
                    b.Navigation("BlogPostHistories");

                    b.Navigation("Bookmarks");

                    b.Navigation("Comments");

                    b.Navigation("Images");

                    b.Navigation("Notifications");

                    b.Navigation("Reactions");
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.Comment", b =>
                {
                    b.Navigation("CommentHistories");

                    b.Navigation("InverseParentComment");

                    b.Navigation("Reactions");
                });

            modelBuilder.Entity("Bislerium_Blogs.Server.Models.User", b =>
                {
                    b.Navigation("BlogPosts");

                    b.Navigation("Bookmarks");

                    b.Navigation("Comments");

                    b.Navigation("Notifications");

                    b.Navigation("Reactions");
                });
#pragma warning restore 612, 618
        }
    }
}
