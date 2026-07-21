using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cineverse.Application.DTOs.Movies
{
    public record GenreDto(
        int Id, 
        string Name
    );
}
