using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Cineverse.API.Controllers
{
    public abstract class BaseController : ControllerBase
    {
        protected Guid GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new UnauthorizedAccessException("User is not authenticated");

            return Guid.Parse(claim);
        }
    }
}
