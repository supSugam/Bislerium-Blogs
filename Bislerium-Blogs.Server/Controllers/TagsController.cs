using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bislerium_Blogs.Server.Models;

namespace Bislerium_Blogs.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagsController : ControllerBase
    {
        private readonly BisleriumBlogsContext _context;

        public TagsController(BisleriumBlogsContext context)
        {
            _context = context;
        }

        // GET: api/Tags
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tag>>> GetTags([FromQuery] string? search)
        {
            if (search == null || search.Length == 0)
            {
                return await _context.Tags
                    .OrderByDescending(tag => tag.BlogPostTags.Count)
                    .Take(10)
                    .ToListAsync();
            }

            return await _context.Tags
                .Where(tag => tag.TagName.ToUpper().Contains(search.ToUpper()))
                .Take(20)
                .ToListAsync();
        }



        // GET: api/Tags/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Tag>> GetTag(Guid id)
        {
            var tag = await _context.Tags.FindAsync(id);

            if (tag == null)
            {
                return NotFound();
            }

            return tag;
        }

        // PUT: api/Tags/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTag(Guid id, Tag tag)
        {
            if (id != tag.TagId)
            {
                return BadRequest();
            }

            _context.Entry(tag).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TagExists(id))
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

        // POST: api/Tags
        [HttpPost("{name}")]
        public async Task<ActionResult<string>> PostTag(string name)
        {

            try
            {

            // check if tag already exists
            var tagExists = await _context.Tags.AnyAsync(tag => tag.TagName == name);

                if (tagExists)
                {

                    throw new Exception("Tag already exists");
                }


                    // create new tag
                   var tag = new Tag
            {
                TagName = name,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };
            _context.Tags .Add(tag);
            await _context.SaveChangesAsync();
                return Ok("Tag Created");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

        }

        // DELETE: api/Tags/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(Guid id)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null)
            {
                return NotFound();
            }

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TagExists(Guid id)
        {
            return _context.Tags.Any(e => e.TagId == id);
        }
    }
}
