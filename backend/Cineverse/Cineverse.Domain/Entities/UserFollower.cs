using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cineverse.Domain.Entities
{
    public class UserFollower
    {
        public Guid FollowerId { get; set; }
        public Guid FollowingId { get; set; }

        public User Follower { get; set; } = null!;
        public User Following { get; set; } = null!;
    }
}
