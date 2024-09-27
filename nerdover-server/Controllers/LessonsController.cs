using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using nerdover_server.DB;
using nerdover_server.DB.Entities;
using nerdover_server.Models;

namespace nerdover_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LessonsController(MasterContext context) : ControllerBase
    {
        public record CreateLessonDto(string Id, string Title, string CategoryId);
        public record UpdateLessonDto(string Id, string Title, string CategoryId);
        public record UpdateLessonContentDto(string Id, string Content, string CategoryId);

        private readonly MasterContext _context = context;

        [HttpGet("{categoryId}")]
        public async Task<ActionResult<IEnumerable<IdentifiableWithTrace>>> GetLessonIdentities(string categoryId)
        {
            return await _context.Lessons
                .Where(l => l.CategoryId == categoryId)
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

        [HttpGet("{categoryId}/{id}")]
        public async Task<ActionResult<Lesson>> GetLesson(string categoryId, string id)
        {
            var lesson = await _context.Lessons
                .Where (l => l.CategoryId == categoryId)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (lesson == null)
            {
                return NotFound();
            }

            return lesson;
        }

        [HttpPatch("{categoryId}/{id}")]
        public async Task<IActionResult> UpdateLesson(string categoryId, string id, UpdateLessonDto updateLessonDto)
        {
            if (id != updateLessonDto.Id || categoryId != updateLessonDto.CategoryId)
            {
                return BadRequest();
            }

            var foundLesson = await _context.Lessons
                .Where(l => l.CategoryId == categoryId)
                .FirstOrDefaultAsync(l => l.Id == updateLessonDto.Id);

            if (foundLesson == null)
            {
                return NotFound();
            }

            DateTime now = DateTime.Now;

            foundLesson.Title = updateLessonDto.Title;
            foundLesson.UpdatedAt = now;

            _context.Entry(foundLesson).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LessonExists(id))
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

        [HttpPatch("{categoryId}/{id}/content")]
        public async Task<IActionResult> UpdateLessonContent(string categoryId, string id, UpdateLessonContentDto updateLessonContentDto)
        {
            if (id != updateLessonContentDto.Id || categoryId != updateLessonContentDto.CategoryId)
            {
                return BadRequest();
            }

            var foundLesson = await _context.Lessons
                .Where(l => l.CategoryId == categoryId)
                .FirstOrDefaultAsync(l => l.Id == updateLessonContentDto.Id);

            if (foundLesson == null)
            {
                return NotFound();
            }

            DateTime now = DateTime.Now;

            foundLesson.Content = updateLessonContentDto.Content;
            foundLesson.UpdatedAt = now;

            _context.Entry(foundLesson).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LessonExists(id))
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
        public async Task<ActionResult<Lesson>> PostLesson(CreateLessonDto createLessonDto)
        {
            if (!CategoryExists(createLessonDto.CategoryId))
            {
                return BadRequest();
            }

            DateTime now = DateTime.Now;

            Lesson newLesson = new()
            {
                Id = createLessonDto.Id,
                Title = createLessonDto.Title,
                CategoryId = createLessonDto.CategoryId,
                CreatedAt = now,
                UpdatedAt = now
            };

            _context.Lessons.Add(newLesson);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (LessonExists(newLesson.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction(nameof(GetLesson), new { id = newLesson.Id, categoryId = newLesson.CategoryId }, newLesson);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLesson(string id)
        {
            var lesson = await _context.Lessons.FindAsync(id);
            if (lesson == null)
            {
                return NotFound();
            }

            _context.Lessons.Remove(lesson);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LessonExists(string id)
        {
            return _context.Lessons.Any(e => e.Id == id);
        }

        private bool CategoryExists(string id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}
