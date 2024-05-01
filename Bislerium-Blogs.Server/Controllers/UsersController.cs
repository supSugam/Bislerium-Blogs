using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bislerium_Blogs.Server.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Bislerium_Blogs.Server.Helpers;
using Microsoft.AspNetCore.Identity;

namespace Bislerium_Blogs.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly BisleriumBlogsContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public UsersController(BisleriumBlogsContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
           _userManager = userManager;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(Guid id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.UserId }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(Guid id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }

        [AuthorizedOnly]
        [HttpGet("me")]
        public async Task<ActionResult<User>> GetMe()
        {
            Console.WriteLine("GET ME");
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;
            Console.WriteLine(userId);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId.ToString() == userId);
            Console.WriteLine(user);

            if(user == null)
            {
                return NotFound("User not found");
            }

            var userData = new User
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
            return userData;
        }

        [AuthorizedOnly]
        [HttpDelete("me")]
        public async Task<ActionResult<string>> DeleteMe()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;
            var identityUser = await _userManager.FindByIdAsync(userId);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId.ToString() == userId);

            if (user == null && identityUser == null)
            {
                return NotFound("User not found");
            }

            if(user is not null)
            {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            }

            if(identityUser is not null)
            {

            await _userManager.DeleteAsync(identityUser);
            }

            return $"Goodbye {user?.FullName??identityUser?.UserName}, your account has been deleted";
        }
    }


}
