using Cineverse.Application.DTOs.Likes;
using Cineverse.Application.Exceptions;
using Cineverse.Application.Interfaces;
using Cineverse.Domain.Entities;
using Cineverse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Cineverse.Infrastructure.Services;

public class LikeService : ILikeService
{
    private readonly AppDbContext _dbContext;

    public LikeService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<MovieLikeDto> LikeAsync(Guid userId, int tmdbMovieId, CancellationToken ct = default)
    {
        var exists = await _dbContext.MovieLikes.AnyAsync(
            l => l.UserId == userId && l.TmdbMovieId == tmdbMovieId, ct);

        if (exists)
            throw new ValidationException("Movie already liked");

        var like = new MovieLike
        {
            UserId = userId,
            TmdbMovieId = tmdbMovieId
        };

        _dbContext.MovieLikes.Add(like);
        await _dbContext.SaveChangesAsync(ct);

        return new MovieLikeDto(like.Id, like.TmdbMovieId, like.CreatedAt);
    }

    public async Task UnlikeAsync(Guid userId, int tmdbMovieId, CancellationToken ct = default)
    {
        var like = await _dbContext.MovieLikes
            .FirstOrDefaultAsync(l => l.UserId == userId && l.TmdbMovieId == tmdbMovieId, ct)
            ?? throw new NotFoundException("Like not found");

        _dbContext.MovieLikes.Remove(like);
        await _dbContext.SaveChangesAsync(ct);
    }

    public async Task<List<MovieLikeDto>> GetByUserAsync(Guid userId, CancellationToken ct = default)
    {
        return await _dbContext.MovieLikes
            .Where(l => l.UserId == userId)
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => new MovieLikeDto(l.Id, l.TmdbMovieId, l.CreatedAt))
            .ToListAsync(ct);
    }

    public async Task<bool> IsLikedAsync(Guid userId, int tmdbMovieId, CancellationToken ct = default)
    {
        return await _dbContext.MovieLikes.AnyAsync(
            l => l.UserId == userId && l.TmdbMovieId == tmdbMovieId, ct);
    }
}