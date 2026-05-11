using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cineverse.Application.DTOs.Reviews
{
    public record CreateReviewRequest(
        int TmdbMovieId,
        int Rating,
        string Content
    );    
}
