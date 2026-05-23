using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cineverse.Domain.Entities
{
    public class WatchlistItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public int TmdbMovieId { get; set; }
        public bool IsWatched { get; set; } = false;
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;

    }
}
