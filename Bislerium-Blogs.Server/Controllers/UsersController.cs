using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bislerium_Blogs.Server.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Bislerium_Blogs.Server.Helpers;
using Microsoft.AspNetCore.Identity;
using Bislerium_Blogs.Server.Interfaces;
using Bislerium_Blogs.Server.Configs;
using Bislerium_Blogs.Server.Enums;
using Bislerium_Blogs.Server.Payload;
using System.Data;
using Bislerium_Blogs.Server.DTOs;

namespace Bislerium_Blogs.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly BisleriumBlogsContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IS3Service _s3Service;

        public UsersController(BisleriumBlogsContext context, UserManager<IdentityUser> userManager,
            IS3Service s3Service)
        {
            _context = context;
           _userManager = userManager;
            _s3Service = s3Service;
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
            return _context.Users.Any(e => e.UserId == id) && _userManager.Users.Any(u => u.Id == id.ToString());
        }

        [AuthorizedOnly]
        [HttpGet("me")]
        public async Task<ActionResult<UserPayload>> GetMe()
        {
            Console.WriteLine("GET ME");
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId.ToString() == userId);

            if(user == null)
            {
                return NotFound("User Not Found");
            }

            return new UserPayload
            {
                UserId = user.UserId,
                Email = user.Email,
                Username = user.Username,
                FullName = user.FullName,
                AvatarUrl = user.AvatarUrl,
                UpdatedAt = user.UpdatedAt,
                CreatedAt = user.CreatedAt,
                Role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role).Value
            };
        }

        [AuthorizedOnly]
        [HttpPatch("me")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<UserPayload>> UpdateMe(UpdateUserDto? updateUserDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            ArgumentNullException.ThrowIfNull(updateUserDto, nameof(updateUserDto));

            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId.ToString() == userId);

            if (user == null)
            {
                return NotFound("User not found");
            }

            if(updateUserDto.DeleteAvatar == true)
            {
                if(user.AvatarUrl is not null)
                {
                   await _s3Service.DeleteFileFromS3(Constants.USER_AVATARS_DIRECTORY, user.UserId.ToString());
                }
            }
            else
            {
                if (updateUserDto.Avatar is not null)
                {
                    string imageUrl = await _s3Service.UploadFileToS3(updateUserDto.Avatar, Constants.USER_AVATARS_DIRECTORY, user.UserId.ToString());
                    user.AvatarUrl = imageUrl;
                }
            }
           

            if(updateUserDto.FullName is not null)
            {
                user.FullName = updateUserDto.FullName;
            }
            if (updateUserDto.UserName is not null)
            {
                user.Username = updateUserDto.UserName;
            }

            if(updateUserDto.Role is not null)
            {
                if (updateUserDto.Role == Constants.EnumToString(UserRole.ADMIN))
                {
                    return Unauthorized("You cannot make yourself an admin");
                }
                else
                {
                    // remove all roles
                    var roles = await _userManager.GetRolesAsync(await _userManager.FindByIdAsync(userId));
                    await _userManager.RemoveFromRolesAsync(await _userManager.FindByIdAsync(userId), roles);
                    await _userManager.AddToRoleAsync(await _userManager.FindByIdAsync(userId), updateUserDto.Role);
                }

            }

            user.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok(new UserPayload
            {
                UserId = user.UserId,
                Email = user.Email,
                Username = user.Username,
                FullName = user.FullName,
                AvatarUrl = user.AvatarUrl,
                UpdatedAt = user.UpdatedAt,
                CreatedAt = user.CreatedAt,
                Role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role).Value
            });
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
            if(user.AvatarUrl is not null)
            {
            string imageExt = user.AvatarUrl.Split('.').Last();
                _s3Service.DeleteFileFromS3(Constants.USER_AVATARS_DIRECTORY,
                    $"{user.UserId}.{imageExt}");
            }


            return $"Goodbye {user?.FullName??identityUser?.UserName}, your account has been deleted";
        }


        [HttpGet("username/{username}")]
        public async Task<ActionResult<UserPayload>> GetUserByUsername(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username || u.UserId.ToString() == username);

            if (user == null)
            {
                return NotFound("User not found");
            }

            var role = await _userManager.GetRolesAsync(await _userManager.FindByIdAsync(user.UserId.ToString()))
                ?? throw new DataException("User has no role");

            return new UserPayload
            {
                UserId = user.UserId,
                Email = user.Email,
                Username = user.Username,
                FullName = user.FullName,
                AvatarUrl = user.AvatarUrl,
                UpdatedAt = user.UpdatedAt,
                CreatedAt = user.CreatedAt,
                Role = role[0]
            };
        }



    }


}
