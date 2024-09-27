using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using nerdover_server.DB;
using nerdover_server.DB.Entities;
using nerdover_server.Models;

namespace nerdover_server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController(MasterContext context) : ControllerBase
    {
        public record CreateCategoryDto(string Id, string Title);
        public record UpdateCategoryDto(string Id, string Title);

        private readonly MasterContext _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<IdentifiableWithTrace>>> GetCategoryIdentities()
        {
            return await _context.Categories
                .Select(c => new IdentifiableWithTrace 
                { 
                    Id = c.Id,
                    Title = c.Title,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                }
                )
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IdentifiableWithTrace>> GetCategoryIdentity(string id)
        {
            var category = await _context.Categories
                .Select(c => new IdentifiableWithTrace 
                    {
                        Id = c.Id,
                        Title = c.Title,
                        CreatedAt = c.CreatedAt, 
                        UpdatedAt = c.UpdatedAt 
                    }
                )
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateCategory(string id, UpdateCategoryDto updateCategoryDto)
        {
            if (id != updateCategoryDto.Id)
            {
                return BadRequest();
            }

            var foundCategory = await _context.Categories.FindAsync(updateCategoryDto.Id);

            if (foundCategory == null)
            {
                return NotFound();
            }

            DateTime now = DateTime.Now;

            foundCategory.Title = updateCategoryDto.Title;
            foundCategory.UpdatedAt = now;

            _context.Entry(foundCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
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

        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory(CreateCategoryDto createCategoryDto)
        {
            DateTime now = DateTime.Now;

            Category newCategory = new()
            { 
                Id = createCategoryDto.Id,
                Title = createCategoryDto.Title,
                CreatedAt = now,
                UpdatedAt = now
            };

            _context.Categories.Add(newCategory);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CategoryExists(newCategory.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction(nameof(GetCategoryIdentity), new { id = newCategory.Id }, newCategory);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(string id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var relatedSeriesLessons = await _context.SeriesLessons.Where(sl => sl.CategoryId == id).ToListAsync();
                var relatedSeries = await _context.Series.Where(s => s.CategoryId == id).ToListAsync();
                var relatedLessons = await _context.Lessons.Where(l => l.CategoryId == id).ToListAsync();

                _context.SeriesLessons.RemoveRange(relatedSeriesLessons);
                _context.Series.RemoveRange(relatedSeries);
                _context.Lessons.RemoveRange(relatedLessons);
                _context.Categories.Remove(category);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return NoContent();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        private bool CategoryExists(string id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}
