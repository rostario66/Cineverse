using Cineverse.Application.DTOs.Auth;
using Cineverse.Application.Exceptions;
using Cineverse.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Cineverse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request, CancellationToken ct)
        {
            try
            {
                var response = await _authService.RegisterAsync(request, ct);
                return Ok(response);
            }
            catch (ValidationException ex) 
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request, CancellationToken ct)
        {
            try
            {
                var response = await _authService.LoginAsync(request, ct);
                return Ok(response);
            }
            catch (NotFoundException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


    }
}
