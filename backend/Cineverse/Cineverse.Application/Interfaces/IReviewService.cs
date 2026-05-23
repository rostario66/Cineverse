using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cineverse.Application.DTOs.Reviews;

namespace Cineverse.Application.Interfaces
{
    public interface IReviewService
    {
        Task<ReviewDto> CreateAsync(Guid userId, CreateReviewRequest request, CancellationToken ct = default);
        Task<List<ReviewDto>> GetByMovieAsync(int tmdbMovieId, CancellationToken ct);
        Task<List<ReviewDto>> GetByUserAsync(Guid userId, CancellationToken ct = default);
        Task DeleteAsync(Guid reviewId, Guid userId, CancellationToken ct = default);
    }
}
