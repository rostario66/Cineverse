using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cineverse.Application.DTOs.Watchlist;
using Cineverse.Application.Interfaces;
using Cineverse.Infrastructure.Data;
using Cineverse.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Cineverse.Application.Exceptions;

namespace Cineverse.Infrastructure.Services
{
    public class WatchlistService : IWatchlistService
    {
        private readonly AppDbContext _dbContext;

        public WatchlistService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<WatchlistItemDto> AddAsync(Guid userId, AddToWatchlistRequest request, CancellationToken ct = default)
        {
            var exists = await _dbContext.WatchlistItems.AnyAsync(w => w.UserId == userId && w.TmdbMovieId == request.TmdbMovieId, ct);

            if (exists)
                throw new ValidationException("Movie already in watchlist");

            var item = new WatchlistItem()
            {
                UserId = userId,
                TmdbMovieId = request.TmdbMovieId,
            };

            _dbContext.WatchlistItems.Add(item);
            await _dbContext.SaveChangesAsync(ct);

            return MapToDto(item);
        }

        public async Task<List<WatchlistItemDto>> GetByUserAsync(Guid userId, CancellationToken ct = default)
        {
            return await _dbContext.WatchlistItems
                .Where(w => w.UserId == userId)
                .OrderByDescending(w => w.AddedAt)
                .Select(w => MapToDto(w))
                .ToListAsync(ct);
        }
        public async Task<List<WatchlistItemDto>> GetWatchedAsync(Guid userId, CancellationToken ct = default)
        {
            return await _dbContext.WatchlistItems
                .Where(w => w.UserId == userId && w.IsWatched == true)
                .OrderByDescending(w => w.AddedAt)
                .Select(w => MapToDto(w))
                .ToListAsync(ct);
        }

        public async Task MarkWatchedAsync(Guid itemId, Guid userId, CancellationToken ct = default)
        {
            var item = await _dbContext.WatchlistItems
                .FirstOrDefaultAsync(w => w.Id == itemId, ct)
                ?? throw new NotFoundException("Watchlist item not found");

            if (item.UserId != userId)
                throw new ValidationException("You can only update your own watchlist");

            item.IsWatched = true;
            await _dbContext.SaveChangesAsync(ct);
        }

        public async Task RemoveAsync(Guid itemId, Guid userId, CancellationToken ct = default)
        {
            var item = await _dbContext.WatchlistItems
                .FirstOrDefaultAsync(w => w.Id == itemId, ct)
                 ?? throw new NotFoundException("Watchlist item not found");

            if (item.UserId != userId)
                throw new ValidationException("You can only update your own watchlist");

            _dbContext.Remove(item);
            await _dbContext.SaveChangesAsync(ct);
        }

        private static WatchlistItemDto MapToDto(WatchlistItem item) => new(
            Id: item.Id,
            TmdbMovieId: item.TmdbMovieId,
            IsWatched: item.IsWatched,
            AddedAt: item.AddedAt
        );

    }
}
