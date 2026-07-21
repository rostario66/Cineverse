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
            [property: JsonPropertyName("vote_average")] double VoteAverage,
            [property: JsonPropertyName("genre_ids")] List<int> GenreIds
    );

    public record TmdbMovieDetail(
            [property: JsonPropertyName("id")] int Id,
            [property: JsonPropertyName("title")] string Title,
            [property: JsonPropertyName("overview")] string Overview,
            [property: JsonPropertyName("poster_path")] string? PosterPath,
            [property: JsonPropertyName("backdrop_path")] string? BackdropPath,
            [property: JsonPropertyName("release_date")] string ReleaseDate,
            [property: JsonPropertyName("vote_average")] double VoteAverage,
            [property: JsonPropertyName("runtime")] int? Runtime,
            [property: JsonPropertyName("genres")] List<TmdbGenre> Genres,
            [property: JsonPropertyName("credits")] TmdbCredits? Credits,
            [property: JsonPropertyName("similar")] TmdbMovieListResponse? Similar

    );

    public record TmdbCredits(
            [property: JsonPropertyName("cast")] List<TmdbCastMember> Cast,
            [property: JsonPropertyName("crew")] List<TmdbCrewMember> Crew
    );

    public record TmdbCastMember(
            [property: JsonPropertyName("id")] int Id,
            [property: JsonPropertyName("name")] string Name,
            [property: JsonPropertyName("character")] string Character,
            [property: JsonPropertyName("profile_path")] string? ProfilePath
    );

    public record TmdbCrewMember(
            [property: JsonPropertyName("name")] string Name,
            [property: JsonPropertyName("job")] string Job
    );

    public record TmdbGenre(
            [property: JsonPropertyName("id")] int Id,
            [property: JsonPropertyName("name")] string Name

    );

    public record TmdbGenreListResponse(
            [property: JsonPropertyName("genres")] List<TmdbGenre> Genres
    );
}
