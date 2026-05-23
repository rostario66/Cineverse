using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cineverse.Application.DTOs.Watchlist
{
    public record WatchlistItemDto(
        Guid Id,
        int TmdbMovieId,
        bool IsWatched,
        DateTime AddedAt
    );
}
