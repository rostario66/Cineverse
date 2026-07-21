using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cineverse.Application.DTOs.Likes
{
	public record MovieLikeDto(
		Guid Id,
		int TmdbMovieId,
		DateTime CreatedAt
	);
}
