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
        string ReleaseDate,
        double VoteAverage,
        List<string> Genres
    );

   
}
