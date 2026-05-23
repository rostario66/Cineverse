using Cineverse.Application.DTOs.Watchlist;
using Cineverse.Application.Exceptions;
using Cineverse.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cineverse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WatchlistController : BaseController
    {
        private readonly IWatchlistService _watchlistService;
        public WatchlistController(IWatchlistService watchlistService)
        {
            _watchlistService = watchlistService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMy(CancellationToken ct = default)
        {
            var userId = GetUserId();
            var items = await _watchlistService.GetByUserAsync(userId, ct);

            return Ok(items);
        }

        [HttpGet("watched")]
        public async Task<IActionResult> GetWatched(CancellationToken ct = default)
        {
            var userId = GetUserId();
            var items = await _watchlistService.GetWatchedAsync(userId, ct);

            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> Add(AddToWatchlistRequest request, CancellationToken ct = default)
        {
            var userId = GetUserId();
            var item = await _watchlistService.AddAsync(userId, request, ct);

            return Ok(item);
        }

        [HttpPatch("{itemId}/watched")]
        public async Task<IActionResult> MarkAsWatched(Guid itemId, CancellationToken ct = default)
        {
            var userId = GetUserId();
            await _watchlistService.MarkWatchedAsync(itemId, userId, ct);

            return NoContent();
        }

        [HttpDelete("{itemId}")]
        public async Task<IActionResult> Remove(Guid itemId, CancellationToken ct = default)
        {
            var userId = GetUserId();
            await _watchlistService.RemoveAsync(itemId, userId, ct);

            return NoContent();
        }
    }
}
