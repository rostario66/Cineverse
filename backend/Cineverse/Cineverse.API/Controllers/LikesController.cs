using Cineverse.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cineverse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LikesController : BaseController
{
    private readonly ILikeService _likeService;

    public LikesController(ILikeService likeService)
    {
        _likeService = likeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMy(CancellationToken ct)
    {
        var userId = GetUserId();
        var likes = await _likeService.GetByUserAsync(userId, ct);

        return Ok(likes);
    }

    [HttpGet("{tmdbMovieId}/status")]
    public async Task<IActionResult> CheckStatus(int tmdbMovieId, CancellationToken ct)
    {
        var userId = GetUserId();
        var isLiked = await _likeService.IsLikedAsync(userId, tmdbMovieId, ct);

        return Ok(new { isLiked });
    }

    [HttpPost("{tmdbMovieId}")]
    public async Task<IActionResult> Like(int tmdbMovieId, CancellationToken ct)
    {
        var userId = GetUserId();
        var like = await _likeService.LikeAsync(userId, tmdbMovieId, ct);

        return Ok(like);
    }

    [HttpDelete("{tmdbMovieId}")]
    public async Task<IActionResult> Unlike(int tmdbMovieId, CancellationToken ct)
    {
        var userId = GetUserId();
        await _likeService.UnlikeAsync(userId, tmdbMovieId, ct);

        return NoContent();
    }
}