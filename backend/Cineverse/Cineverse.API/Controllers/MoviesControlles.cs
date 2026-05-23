using Cineverse.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Cineverse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly IMovieService _movieService;

        public MoviesController(IMovieService movieService) 
        {
            _movieService = movieService;
        }

        [HttpGet("popular")]
        public async Task<IActionResult> GetPopular([FromQuery] int page = 1, CancellationToken ct = default)
        {
            var movies = await _movieService.GetPopularAsync(page, ct);
            
            return Ok(movies);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query, [FromQuery] int page = 1, CancellationToken ct = default)
        {
            var movies = await _movieService.SearchAsync(query, page, ct);
            
            return Ok(movies);
        }

        [HttpGet("{tmdbId}")]
        public async Task<IActionResult> GetById(int tmdbId, CancellationToken ct = default)
        {
            var movie = await _movieService.GetByIdAsync(tmdbId, ct);         
            
            return Ok(movie);
        }
    }
}
