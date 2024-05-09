using Bislerium_Blogs.Server.Enums;
using Bislerium_Blogs.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Bislerium_Blogs.Server.Configs
{
    public class DataSeeder : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;

        public DataSeeder(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }


        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<BisleriumBlogsContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            await SeedAllRoles(roleManager);
            await SeedAdminUserAndRole(userManager, roleManager, context);
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

        private async Task SeedAllRoles(RoleManager<IdentityRole> roleManager)
        {
            foreach (var role in Enum.GetNames(typeof(UserRole)))
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }

        private async Task SeedAdminUserAndRole(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, BisleriumBlogsContext _context)
        {
            // Check if the admin user already exists
            var identityAdmin = await userManager.FindByEmailAsync(Constants.ADMIN_EMAIL);
            var dbAdmin = await _context.Users.FirstOrDefaultAsync(x => x.Email == Constants.ADMIN_EMAIL);

            if (identityAdmin == null)
            {
                // Create the admin user
                var adminUser = new IdentityUser
                {
                    UserName = Constants.ADMIN_USERNAME,
                    Email = Constants.ADMIN_EMAIL,
                    EmailConfirmed = true,
                };

                await userManager.CreateAsync(adminUser, Constants.ADMIN_PASSWORD);

                // Assign the admin role to the user
                await userManager.AddToRoleAsync(adminUser, Enum.GetName(typeof(UserRole), UserRole.ADMIN));

                identityAdmin = await userManager.FindByEmailAsync(Constants.ADMIN_EMAIL);
            }

            if(dbAdmin == null)
            {
                // Seed the admin user's profile
                User admin = new()
                {
                    AvatarUrl = Constants.ADMIN_AVATAR,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    Email = Constants.ADMIN_EMAIL,
                    FullName = Constants.ADMIN_USERNAME,
                    UserId = Guid.Parse(identityAdmin.Id),
                    Username = Constants.ADMIN_USERNAME
                };

                _context.Users.Add(admin);
                await _context.SaveChangesAsync();
            }
            
        }
    }
}