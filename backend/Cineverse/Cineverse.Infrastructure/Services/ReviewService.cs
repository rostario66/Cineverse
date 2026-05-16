using Cineverse.Application.DTOs.Reviews;
using Cineverse.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cineverse.Infrastructure.Data;
using Cineverse.Application.Exceptions;
using Microsoft.EntityFrameworkCore;
using Cineverse.Domain.Entities;

namespace Cineverse.Infrastructure.Services
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _dbContext;

        public ReviewService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ReviewDto> CreateAsync(Guid userId, CreateReviewRequest request, CancellationToken ct = default)
        {
            if (request.Rating < 1 || request.Rating > 5)
                throw new ValidationException("Rating must be between 1 and 5");

            var exists = await _dbContext.Reviews.AnyAsync(r => r.UserId == userId && r.TmdbMovieId == request.TmdbMovieId, ct);

            if (exists)
                throw new ValidationException("You already reviewed this movie");

            var review = new Review
            {
                UserId = userId,
                TmdbMovieId = request.TmdbMovieId,
                Rating = request.Rating,
                Content = request.Content
            };

            _dbContext.Reviews.Add(review);
            await _dbContext.SaveChangesAsync(ct);

            var user = await _dbContext.Users.FindAsync([userId], ct);

            return MapToDto(review, user!.UserName);

        }
        public async Task<List<ReviewDto>> GetByMovieAsync(int tmdbMovieId, CancellationToken ct)
        {
            return await _dbContext.Reviews
                .Include(r => r.User)
                .Where(r => r.TmdbMovieId ==  tmdbMovieId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => MapToDto(r, r.User.UserName))
                .ToListAsync(ct);
        }

        public async Task<List<ReviewDto>> GetByUserAsync(Guid userId, CancellationToken ct = default)
        {
            return await _dbContext.Reviews
                .Include(r => r.User)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => MapToDto(r, r.User.UserName))
                .ToListAsync(ct);
        }

        public async Task DeleteAsync(Guid reviewId, Guid userId, CancellationToken ct = default)
        {
            var review = await _dbContext.Reviews
                .FirstOrDefaultAsync(r => r.Id == reviewId, ct)
                ?? throw new NotFoundException("Review not found");

            if (review.UserId != userId)
                throw new ValidationException("You can only delete your own reviews");

            _dbContext.Reviews.Remove(review);
            await _dbContext.SaveChangesAsync(ct);
        }

        private static ReviewDto MapToDto(Review review, string UserName) => new(
            Id: review.Id,
            UserId: review.UserId,
            UserName: UserName,
            TmdbMovieId: review.TmdbMovieId,
            Rating: review.Rating,
            Content: review.Content,
            CreatedAt: review.CreatedAt
        );
    }
}
