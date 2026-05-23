using Cineverse.Application.DTOs.Users;
using Cineverse.Application.Exceptions;
using Cineverse.Application.Interfaces;
using Cineverse.Domain.Entities;
using Cineverse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cineverse.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _dbContext;

        public UserService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<UserProfileDto> GetProfileAsync(Guid userId, CancellationToken ct = default)
        {
            var user = await _dbContext.Users.
                FirstOrDefaultAsync(u => u.Id == userId, ct)
                ?? throw new NotFoundException("User not found");

            var reviewsCount = await _dbContext.Reviews
                .CountAsync(u => u.UserId == userId, ct);

            var watchlistCount = await _dbContext.WatchlistItems
                .CountAsync(w => w.UserId == userId && !w.IsWatched, ct);

            var watchedCount = await _dbContext.WatchlistItems
                .CountAsync(w => w.UserId == userId && w.IsWatched, ct);

            var followersCount = await _dbContext.UserFollowers
                .CountAsync(f => f.FollowingId == userId, ct);
  
            var followingCount = await _dbContext.UserFollowers
                .CountAsync(f => f.FollowerId == userId, ct);

            return new UserProfileDto(
                Id: user.Id,
                UserName: user.UserName,
                Email: user.Email,
                CreatedAt: user.CreatedAt,
                ReviewsCount: reviewsCount,
                WatchlistCount: watchlistCount,
                WatchedCount: watchedCount,
                FollowersCount: followersCount,
                FollowingCount: followingCount
            );
        }

        public async Task FollowAsync(Guid followerId, Guid followingId, CancellationToken ct = default)
        {
            if (followerId == followingId)
                throw new ValidationException("You cannot follow yourself");

            var targetExists = await _dbContext.Users.AnyAsync(u => u.Id == followingId, ct);
            if (!targetExists)
                throw new NotFoundException("USer not found");

            var alreadyFollowing = await _dbContext.UserFollowers
                .AnyAsync(f => f.FollowerId == followerId && f.FollowingId == followingId, ct);

            if (alreadyFollowing)
                throw new ValidationException("Already following this user");

            _dbContext.UserFollowers.Add(new UserFollower
            {
                FollowerId = followerId,
                FollowingId = followingId
            });
            
            await _dbContext.SaveChangesAsync(ct);
        }
        public async Task UnfollowAsync(Guid followerId, Guid followingId, CancellationToken ct = default)
        {
            var follow = await _dbContext.UserFollowers
                .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FollowingId == followingId, ct)
                ?? throw new NotFoundException("You are not following this user");

            _dbContext.UserFollowers.Remove(follow);
            await _dbContext.SaveChangesAsync(ct);
        }

        public async Task<List<UserProfileDto>> GetFollowersAsync(Guid userId, CancellationToken ct = default)
        {
            var followers = await _dbContext.UserFollowers
                .Include(f => f.Follower)
                .Where(f => f.FollowingId == userId)
                .Select(f => f.Follower)
                .ToListAsync(ct);

            return await MapUsersToProfileAsync(followers, ct);
        }

        public async Task<List<UserProfileDto>> GetFollowingAsync(Guid userId, CancellationToken ct = default)
        {
            var following = await _dbContext.UserFollowers
                .Include(f => f.Following)
                .Where(f => f.FollowerId == userId)
                .Select(f => f.Following)
                .ToListAsync(ct);

            return await MapUsersToProfileAsync(following, ct);
        }   
        
        public async Task<List<UserProfileDto>> MapUsersToProfileAsync(List<User> users, CancellationToken ct = default)
        {
            var profiles = new List<UserProfileDto>();

            foreach(var user in users)
            {
                var profile = await GetProfileAsync(user.Id, ct);
                profiles.Add(profile);
            }

            return profiles;
        }

    }
}
