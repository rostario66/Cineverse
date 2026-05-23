using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cineverse.Application.DTOs.Watchlist;

namespace Cineverse.Application.Interfaces
{
    public interface IWatchlistService
    {
        Task<WatchlistItemDto> AddAsync(Guid userId, AddToWatchlistRequest request, CancellationToken ct = default);
        Task<List<WatchlistItemDto>> GetByUserAsync(Guid userId, CancellationToken ct = default);
        Task<List<WatchlistItemDto>> GetWatchedAsync(Guid userId, CancellationToken ct = default);
        Task MarkWatchedAsync(Guid itemId, Guid userId, CancellationToken ct = default);
        Task RemoveAsync(Guid itemId, Guid userId, CancellationToken ct = default);
    }
}
