using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using nerdover_server.Models;

namespace nerdover_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(SignInManager<AppUser> signInManager) : ControllerBase
    {
        
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Logout([FromBody] object empty)
        {
            if (empty != null)
            {
                await signInManager.SignOutAsync();
                return Ok();
            }
            return Unauthorized();
        }
    }
}
