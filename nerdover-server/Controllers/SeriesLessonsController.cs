using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using nerdover_server.DB;
using nerdover_server.DB.Entities;
using nerdover_server.Models;

namespace nerdover_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeriesLessonsController(MasterContext context) : ControllerBase
    {
        public record CreateSeriesLessonDto(string Id, string Title, string CategoryId, string SeriesId);
        public record UpdateSeriesLessonDto(string Id, string Title, string CategoryId, string SeriesId);
        public record UpdateSeriesLessonContentDto(string Id, string Content, string CategoryId, string SeriesId);
        
        private readonly MasterContext _context = context;

        [HttpGet("{categoryId}/{seriesId}")]
        public async Task<ActionResult<IEnumerable<IdentifiableWithTrace>>> GetSeriesLessonIdentities(string categoryId, string seriesId)
        {
            return await _context.SeriesLessons
                .Where(sl => sl.CategoryId == categoryId)
                .Where(sl => sl.SeriesId == seriesId)
                .Select(l => new IdentifiableWithTrace
                {
                    Id = l.Id,
                    Title = l.Title,
                    CreatedAt = l.CreatedAt,
                    UpdatedAt = l.UpdatedAt
                }
                )
                .ToListAsync();
        }

        [HttpGet("{categoryId}/{seriesId}/{id}")]
        public async Task<ActionResult<SeriesLesson>> GetSeriesLesson(string categoryId, string seriesId, string id)
        {
            var seriesLesson = await _context.SeriesLessons
                .Where(sl => sl.CategoryId == categoryId)
                .Where(sl => sl.SeriesId == seriesId)
                .FirstOrDefaultAsync(sl => sl.Id == id);

            if (seriesLesson == null)
            {
                return NotFound();
            }

            return seriesLesson;
        }

        [HttpPatch("{categoryId}/{seriesId}/{id}")]
        public async Task<IActionResult> UpdateSeriesLesson(string categoryId, string seriesId, string id, UpdateSeriesLessonDto updateSeriesLessonDto)
        {
            if (id != updateSeriesLessonDto.Id || seriesId != updateSeriesLessonDto.SeriesId || categoryId != updateSeriesLessonDto.CategoryId)
            {
                return BadRequest();
            }

            var foundSeriesLesson = await _context.SeriesLessons
                .Where(sl => sl.CategoryId == categoryId)
                .Where(sl => sl.SeriesId == seriesId)
                .FirstOrDefaultAsync(sl => sl.Id == updateSeriesLessonDto.Id);

            if (foundSeriesLesson == null)
            {
                return NotFound();
            }

            DateTime now = DateTime.Now;

            foundSeriesLesson.Title = updateSeriesLessonDto.Title;
            foundSeriesLesson.UpdatedAt = now;

            _context.Entry(foundSeriesLesson).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeriesLessonExists(id))
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

        [HttpPatch("{categoryId}/{seriesId}/{id}/content")]
        public async Task<IActionResult> UpdateSeriesLessonContent(string categoryId, string seriesId, string id, UpdateSeriesLessonContentDto updateSeriesLessonContentDto)
        {
            if (id != updateSeriesLessonContentDto.Id || seriesId != updateSeriesLessonContentDto.SeriesId || categoryId != updateSeriesLessonContentDto.CategoryId)
            {
                return BadRequest();
            }

            var foundSeriesLesson = await _context.SeriesLessons
                .Where(sl => sl.CategoryId == categoryId)
                .Where(sl => sl.SeriesId == seriesId)
                .FirstOrDefaultAsync(sl => sl.Id == updateSeriesLessonContentDto.Id);

            if (foundSeriesLesson == null)
            {
                return NotFound();
            }

            DateTime now = DateTime.Now;

            foundSeriesLesson.Content = updateSeriesLessonContentDto.Content;
            foundSeriesLesson.UpdatedAt = now;

            _context.Entry(foundSeriesLesson).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeriesLessonExists(id))
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
        public async Task<ActionResult<SeriesLesson>> PostSeriesLesson(CreateSeriesLessonDto createSeriesLessonDto)
        {
            if (!CategoryExists(createSeriesLessonDto.CategoryId))
            {
                return BadRequest();
            }

            if (!SeriesExists(createSeriesLessonDto.SeriesId))
            {
                return BadRequest();
            }

            DateTime now = DateTime.Now;

            SeriesLesson newSeriesLesson = new()
            {
                Id = createSeriesLessonDto.Id,
                Title = createSeriesLessonDto.Title,
                CategoryId = createSeriesLessonDto.CategoryId,
                SeriesId = createSeriesLessonDto.SeriesId,
                CreatedAt = now,
                UpdatedAt = now
            };

            _context.SeriesLessons.Add(newSeriesLesson);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SeriesLessonExists(newSeriesLesson.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction(nameof(GetSeriesLesson), new { id = newSeriesLesson.Id, categoryId = newSeriesLesson.CategoryId, seriesId = newSeriesLesson.SeriesId }, newSeriesLesson);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSeriesLesson(string id)
        {
            var seriesLesson = await _context.SeriesLessons.FindAsync(id);
            if (seriesLesson == null)
            {
                return NotFound();
            }

            _context.SeriesLessons.Remove(seriesLesson);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SeriesLessonExists(string id)
        {
            return _context.SeriesLessons.Any(e => e.Id == id);
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
