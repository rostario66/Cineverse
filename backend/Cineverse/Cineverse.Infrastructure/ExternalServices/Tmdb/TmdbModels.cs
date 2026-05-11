using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace Cineverse.Infrastructure.ExternalServices.Tmdb
{
    public record TmdbMovieListResponse(
              [property: JsonPropertyName("results")] List<TmdbMovie> Results, 
              [property: JsonPropertyName("total_results")] int TotalResults, 
              [property: JsonPropertyName("total_pages")] int TotalPages, 
              [property: JsonPropertyName("page")] int Page 
    );

    public record TmdbMovie(
              [property: JsonPropertyName("id")] int Id,
              [property: JsonPropertyName("title")] string Title,
              [property: JsonPropertyName("overview")] string Overview,
              [property: JsonPropertyName("poster_path")] string? PosterPath,
              [property: JsonPropertyName("release_date")] string ReleaseDate,
              [property: JsonPropertyName("vote_avarage")] double VoteAverage,
              [property: JsonPropertyName("genre_ids")] List<int> GenreIds
    );

    public record TmdbMovieDetail(
              [property: JsonPropertyName("id")] int Id,
              [property: JsonPropertyName("title")] string Title,
              [property: JsonPropertyName("overview")] string Overview,
              [property: JsonPropertyName("poster_path")] string? PosterPath,
              [property: JsonPropertyName("release_date")] string ReleaseDate,
              [property: JsonPropertyName("vote_avarage")] double VoteAverage,
              [property: JsonPropertyName("genres")] List<TmdbGenre> Genres
    );

    public record TmdbGenre(
              [property: JsonPropertyName("id")] int Id,
              [property: JsonPropertyName("name")] string Name

    );

    public record TmdbGenreListResponse(
        [property: JsonPropertyName("genres")] List<TmdbGenre> Genres
    );
}
