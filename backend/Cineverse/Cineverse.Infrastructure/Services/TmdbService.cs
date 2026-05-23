using Cineverse.Application.DTOs.Movies;
using Cineverse.Application.Interfaces;
using Cineverse.Application.Settings;
using Cineverse.Infrastructure.ExternalServices.Tmdb;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using System.Text.Json;
using Cineverse.Application.Exceptions;

namespace Cineverse.Infrastructure.Services
{
    public class TmdbService : IMovieService
    {
        private readonly HttpClient _httpClient;
        private readonly TmdbSettings _tmdbSettings;
        private readonly IMemoryCache _cache;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNameCaseInsensitive = true
        };

        public TmdbService(HttpClient httpClient, IOptions<TmdbSettings> tmdbSettings, IMemoryCache cache) 
        { 
            _httpClient = httpClient;
            _tmdbSettings = tmdbSettings.Value;
            _cache = cache;
        }

        private async Task<Dictionary<int, string>> GetGenresAsync(CancellationToken ct)
        {
            if (_cache.TryGetValue("tmdb_genres", out Dictionary<int, string?> cached)) 
                return cached!;
            
            var url = $"{_tmdbSettings.BaseUrl}/genre/movie/list?api_key={_tmdbSettings.ApiKey}&language=en-US";
            
            var response = await _httpClient.GetAsync(url, ct);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync(ct);
            var result = JsonSerializer.Deserialize<TmdbGenreListResponse>(content, JsonOptions)
                ?? throw new Exception("Failed to load genres from TMDB");

            var genres = result.Genres.ToDictionary(g => g.Id, g => g.Name);

            _cache.Set("tmdb_genres", genres, TimeSpan.FromHours(24));

            return genres;
        }

        public async Task<MovieSearchResult> GetPopularAsync(int page = 1, CancellationToken ct = default)
        {
            var genres = await GetGenresAsync(ct);

            var url = $"{_tmdbSettings.BaseUrl}/movie/popular?api_key={_tmdbSettings.ApiKey}&page={page}&language=en-US";

            var response = await _httpClient.GetAsync(url, ct);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync(ct);
            var tmdbResponse = JsonSerializer.Deserialize<TmdbMovieListResponse>(content, JsonOptions)
                 ?? throw new Exception("Failed to load popular movies from TMDB");

            return new MovieSearchResult(
                Movies: tmdbResponse.Results.Select(m => MapToDto(m, genres)).ToList(),
                TotalResults: tmdbResponse.TotalResults,
                TotalPages: tmdbResponse.TotalPages,
                CurrentPage: tmdbResponse.Page
            );
        }
        public async Task<MovieSearchResult> SearchAsync(string query, int page = 1, CancellationToken ct = default)
        {
            var genres = await GetGenresAsync(ct);

            if(string.IsNullOrWhiteSpace(query))
                throw new ValidationException("Query cannot be empty");

            var encodedQuery = Uri.EscapeDataString(query);
            var url = $"{_tmdbSettings.BaseUrl}/search/movie?api_key={_tmdbSettings.ApiKey}&query={encodedQuery}&page={page}&language=en-US";

            var response = await _httpClient.GetAsync(url, ct);

            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                throw new NotFoundException($"Movies not found");

            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync(ct);

            var tmdbResponse = JsonSerializer.Deserialize<TmdbMovieListResponse>(content, JsonOptions)
                 ?? throw new Exception("Failed to load movies from TMDB");

            return new MovieSearchResult(
                Movies: tmdbResponse.Results.Select(m => MapToDto(m, genres)).ToList(),
                TotalResults: tmdbResponse.TotalResults,
                TotalPages: tmdbResponse.TotalPages,
                CurrentPage: tmdbResponse.Page
            );
        }

        public async Task<MovieDto?> GetByIdAsync(int tmdbId, CancellationToken ct = default)
        {
            var url = $"{_tmdbSettings.BaseUrl}/movie/{tmdbId}?api_key={_tmdbSettings.ApiKey}&language=en-US";

            var response = await _httpClient.GetAsync(url, ct);

            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                throw new NotFoundException($"Movie with id {tmdbId} not found");

            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync(ct);

            var movie = JsonSerializer.Deserialize<TmdbMovieDetail>(content, JsonOptions)
                 ?? throw new Exception("Failed to load movie from TMDB");

            return new MovieDto(
                Id: movie.Id,
                Title: movie.Title,
                Overview: movie.Overview,
                PosterPath: movie.PosterPath != null
                ? $"{_tmdbSettings.ImageBaseUrl}{movie.PosterPath}"
                : string.Empty,
                ReleaseDate: movie.ReleaseDate,
                VoteAverage: movie.VoteAverage,
                Genres: movie.Genres.Select(g => g.Name).ToList()
            );
        }

        private MovieDto MapToDto(TmdbMovie movie, Dictionary<int, string> genres) => new(
            Id: movie.Id,
            Title: movie.Title,
            Overview: movie.Overview,
            PosterPath: movie.PosterPath != null
            ? $"{_tmdbSettings.ImageBaseUrl}{movie.PosterPath}"
            : string.Empty,
            ReleaseDate: movie.ReleaseDate,
            VoteAverage: movie.VoteAverage,
            Genres: movie.GenreIds
                .Where(id => genres.ContainsKey(id))
                .Select(id => genres[id])
                .ToList()
        );
    }
}
