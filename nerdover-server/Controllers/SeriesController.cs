using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using nerdover_server.DB;
using nerdover_server.DB.Entities;
using nerdover_server.Models;

namespace nerdover_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeriesController(MasterContext context) : ControllerBase
    {
        public record CreateSeriesDto(string Id, string Title, string CategoryId, string? Cover);
        public record UpdateSeriesDto(string Id, string Title, string CategoryId, string? Cover);

        private readonly MasterContext _context = context;

        [HttpGet("{categoryId}")]
        public async Task<ActionResult<IEnumerable<Series>>> GetSeries(string categoryId)
        {
            return await _context.Series
                .Where(s => s.CategoryId == categoryId)
                .Select(s => new Series
                {
                    Id = s.Id,
                    CategoryId = s.CategoryId,
                    Title = s.Title,
                    Cover = s.Cover,
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt
                }
                )
                .ToListAsync();
        }

        [HttpGet("{categoryId}/{id}")]
        public async Task<ActionResult<Series>> GetSeriesById(string categoryId, string id)
        {
            var series = await _context.Series
                .Where(s => s.CategoryId == categoryId)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (series == null)
            {
                return NotFound();
            }

            return series;
        }

        [HttpPatch("{categoryId}/{id}")]
        public async Task<IActionResult> UpdateSeries(string categoryId, string id, UpdateSeriesDto updateSeriesDto)
        {
            if (id != updateSeriesDto.Id || categoryId != updateSeriesDto.CategoryId)
            {
                return BadRequest();
            }

            var foundSeries = await _context.Series
                .Where(s => s.CategoryId == categoryId)
                .FirstOrDefaultAsync(s => s.Id == updateSeriesDto.Id);

            if (foundSeries == null)
            {
                return NotFound();
            }

            DateTime now = DateTime.Now;

            foundSeries.Title = updateSeriesDto.Title;
            foundSeries.Cover = updateSeriesDto.Cover;
            foundSeries.UpdatedAt = now;

            _context.Entry(foundSeries).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeriesExists(id))
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
        public async Task<ActionResult<Series>> PostSeries(CreateSeriesDto createSeriesDto)
        {
            if (!CategoryExists(createSeriesDto.CategoryId))
            {
                return BadRequest();
            }

            DateTime now = DateTime.Now;

            Series newSeries = new()
            {
                Id = createSeriesDto.Id,
                Title = createSeriesDto.Title,
                CategoryId = createSeriesDto.CategoryId,
                Cover = createSeriesDto.Cover,
                CreatedAt = now,
                UpdatedAt = now
            };

            _context.Series.Add(newSeries);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SeriesExists(newSeries.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction(nameof(GetSeriesById), new { id = newSeries.Id, categoryId = newSeries.CategoryId }, newSeries);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSeries(string id)
        {
            var series = await _context.Series.FindAsync(id);
            if (series == null)
            {
                return NotFound();
            }

            var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var relatedSeriesLessons = await _context.SeriesLessons.Where(sl => sl.CategoryId == id).ToListAsync();

                _context.SeriesLessons.RemoveRange(relatedSeriesLessons);
                _context.Series.Remove(series);

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

        private bool SeriesExists(string id)
        {
            return _context.Series.Any(e => e.Id == id);
        }

        private bool CategoryExists(string id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}
