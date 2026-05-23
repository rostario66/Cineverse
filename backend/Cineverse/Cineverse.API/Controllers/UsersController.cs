using Cineverse.Application.Exceptions;
using Cineverse.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography.X509Certificates;

namespace Cineverse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : BaseController
    {
        private readonly IUserService _userService;
        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMe(CancellationToken ct)
        {            
            var userId = GetUserId();
            var profile = await _userService.GetProfileAsync(userId, ct);

            return Ok(profile);            
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetProfile(Guid userId, CancellationToken ct = default)
        {                       
            var profile = await _userService.GetProfileAsync(userId, ct);

            return Ok(profile);                     
        }

        [Authorize]
        [HttpPost("{userId}/follow")]
        public async Task<IActionResult> Follow(Guid userId, CancellationToken ct = default)
        {
            var followerId = GetUserId();
            await _userService.FollowAsync(followerId, userId, ct);

            return NoContent();            
        }

        [Authorize]
        [HttpDelete("{userId}/follow")]
        public async Task<IActionResult> Unfollow(Guid userId, CancellationToken ct = default)
        {
            var followerId = GetUserId();
            await _userService.UnfollowAsync(followerId, userId, ct);

            return NoContent();
        }

        [HttpGet("{userId}/followers")]
        public async Task<IActionResult> GetFollowers(Guid userId, CancellationToken ct = default)
        {
            var followers = await _userService.GetFollowersAsync(userId, ct);

            return Ok(followers);
        }

        [HttpGet("{userId}/following")]
        public async Task<IActionResult> GetFollowing(Guid userId, CancellationToken ct = default)
        {
            var following = await _userService.GetFollowingAsync(userId, ct);

            return Ok(following);
        }
    }
}
