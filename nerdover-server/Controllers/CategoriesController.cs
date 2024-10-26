using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using nerdover_server.DB;
using nerdover_server.DB.Entities;
using nerdover_server.Models;

namespace nerdover_server.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController(MasterContext context) : ControllerBase
    {
        public record CreateCategoryDto(string Id, string Title, string? Cover);
        public record UpdateCategoryDto(string Id, string Title, string? Cover);

        private readonly MasterContext _context = context;

        [HttpGet("utils/map")]
        public async Task<ActionResult<IEnumerable<Category>>> GetMap()
        {
            return await _context.Categories
                .Include(c => c.Lessons)
                .Include(c => c.Series)
                .ThenInclude(c => c.SeriesLessons)
                .Select(c => new Category
                {
                    Id = c.Id,
                    Title = c.Title,
                    Cover = c.Cover,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    Lessons = c.Lessons.Select(l => new Lesson
                    {
                        Id = l.Id,
                        CategoryId = l.CategoryId,
                        Title = l.Title,
                        Cover = l.Cover,
                        CreatedAt = l.CreatedAt,
                        UpdatedAt = l.UpdatedAt
                    }).ToList(),
                    Series = c.Series.Select(s => new Series
                    {
                        Id = s.Id,
                        CategoryId = s.CategoryId,
                        Title = s.Title,
                        Cover = s.Cover,
                        CreatedAt = s.CreatedAt,
                        UpdatedAt = s.UpdatedAt,
                        SeriesLessons = s.SeriesLessons.Select(sl => new SeriesLesson
                        {
                            Id = sl.Id,
                            CategoryId = sl.CategoryId,
                            SeriesId = sl.SeriesId,
                            Title = sl.Title,
                            Cover = sl.Cover,
                            CreatedAt = sl.CreatedAt,
                            UpdatedAt = sl.UpdatedAt,
                        }).ToList()
                    }).ToList()
                })
                .ToListAsync();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            return await _context.Categories
                .Select(c => new Category
                {
                    Id = c.Id,
                    Title = c.Title,
                    Cover = c.Cover,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                }
                ).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategoryById(string id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);

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
            foundCategory.Cover = updateCategoryDto.Cover;
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
            Console.WriteLine($"IS {createCategoryDto.Cover}");
            DateTime now = DateTime.Now;

            Category newCategory = new()
            {
                Id = createCategoryDto.Id,
                Title = createCategoryDto.Title,
                Cover = createCategoryDto.Cover,
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

            return CreatedAtAction(nameof(GetCategoryById), new { id = newCategory.Id }, newCategory);
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
