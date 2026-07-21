using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cineverse.Application.DTOs.Movies
{
    public record MovieDto(
        int Id,
        string Title,
        string Overview,
        string PosterPath,
        string BackdropPath,
        string ReleaseDate,
        double VoteAverage,
        int Runtime,
        List<string> Genres,
        List<string> Directors,
        List<CastMemberDto> Cast,
        List<MovieDto> Similar
    );

    public record CastMemberDto(
        int Id,
        string Name,
        string Character,
        string ProfilePath
    );
}
