using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cineverse.Application.DTOs.Users
{
    public record UserProfileDto(
        Guid Id,
        string UserName,
        string Email,
        DateTime CreatedAt,
        int ReviewsCount,
        int WatchlistCount,
        int WatchedCount,
        int FollowersCount,
        int FollowingCount
    );
    
}
