using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cineverse.Application.DTOs.Movies
{
    public record MovieSearchResult(
        List<MovieDto> Movies,
        int TotalResults,
        int TotalPages,
        int CurrentPage
    );
}
