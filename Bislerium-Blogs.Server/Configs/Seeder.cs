using Bislerium_Blogs.Server.Enums;
using Microsoft.AspNetCore.Identity;

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

            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            await SeedAllRoles(roleManager);
            await SeedAdminUserAndRole(userManager, roleManager);
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

        private async Task SeedAdminUserAndRole(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            // Check if the admin user already exists
            var adminUser = await userManager.FindByEmailAsync("super.admin@bislerium.com");

            if (adminUser == null)
            {
                // Create the admin user
                adminUser = new ApplicationUser
                {
                    UserName = "SuperAdmin",
                    Email = "super.admin@bislerium.com",
                    EmailConfirmed = true,
                    Role = Enum.GetName(typeof(UserRole), UserRole.ADMIN),
                };

                await userManager.CreateAsync(adminUser, Constants.ADMIN_PASSWORD);

                // Assign the admin role to the user
                await userManager.AddToRoleAsync(adminUser, Enum.GetName(typeof(UserRole), UserRole.ADMIN));
            }
        }
    }
}