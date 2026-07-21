using Cineverse.Application.DTOs.Movies;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cineverse.Application.Interfaces
{
    public interface IMovieService
    {
        Task<MovieSearchResult> GetPopularAsync(int page = 1, int? genreId = null, CancellationToken ct = default); 
        Task<MovieSearchResult> SearchAsync(string query, int page = 1, CancellationToken ct = default); 
        Task<MovieDto?> GetByIdAsync(int tmdbId, CancellationToken ct = default);
        Task<List<GenreDto>> GetGenresAsync(CancellationToken ct = default);
    }
}
