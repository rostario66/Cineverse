using Cineverse.Application.DTOs.Reviews;
using Cineverse.Application.Exceptions;
using Cineverse.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using ValidationException = Cineverse.Application.Exceptions.ValidationException;

namespace Cineverse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : BaseController
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> GetMy(CancellationToken ct = default)
        {
            var userId = GetUserId();
            var reviews = await _reviewService.GetByUserAsync(userId, ct);

            return Ok(reviews);
        }

        [HttpGet("movie/{tmdbMovieId}")]
        public async Task<IActionResult> GetByMovie(int tmdbMovieId, CancellationToken ct = default)
        {
            var reviews = await _reviewService.GetByMovieAsync(tmdbMovieId, ct);

            return Ok(reviews);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(Guid userId, CancellationToken ct = default)
        {
            var reviews = await _reviewService.GetByUserAsync(userId, ct);

            return Ok(reviews);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(CreateReviewRequest request, CancellationToken ct = default)
        {
            var userId = GetUserId();
            var review = await _reviewService.CreateAsync(userId, request, ct);

            return Ok(review);
        }

        [Authorize]
        [HttpDelete("{reviewId}")]
        public async Task<IActionResult> Delete(Guid reviewId, CancellationToken ct = default)
        {
            var userId = GetUserId();
            await _reviewService.DeleteAsync(reviewId, userId, ct);

            return NoContent();
   
        }
    }
}
