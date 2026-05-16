using Cineverse.Application.DTOs.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cineverse.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserProfileDto> GetProfileAsync(Guid userId, CancellationToken ct = default);
        Task FollowAsync(Guid followerId, Guid followingId,  CancellationToken ct = default);
        Task UnfollowAsync(Guid followerId, Guid followingId,  CancellationToken ct = default);
        Task<List<UserProfileDto>> GetFollowersAsync(Guid userId, CancellationToken ct = default);
        Task<List<UserProfileDto>> GetFollowingAsync(Guid userId, CancellationToken ct = default);
    }
}
