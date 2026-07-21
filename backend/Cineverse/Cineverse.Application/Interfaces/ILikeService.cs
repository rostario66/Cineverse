using Cineverse.Application.DTOs.Likes;

namespace Cineverse.Application.Interfaces;

public interface ILikeService
{
    Task<MovieLikeDto> LikeAsync(Guid userId, int tmdbMovieId, CancellationToken ct = default);
    Task UnlikeAsync(Guid userId, int tmdbMovieId, CancellationToken ct = default);
    Task<List<MovieLikeDto>> GetByUserAsync(Guid userId, CancellationToken ct = default);
    Task<bool> IsLikedAsync(Guid userId, int tmdbMovieId, CancellationToken ct = default);
}