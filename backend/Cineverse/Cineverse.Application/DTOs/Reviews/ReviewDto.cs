using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cineverse.Application.DTOs.Reviews
{
    public record ReviewDto(
        Guid Id,
        Guid UserId,
        string UserName,
        int TmdbMovieId,
        double Rating,
        string Content,
        DateTime CreatedAt
    );
}
