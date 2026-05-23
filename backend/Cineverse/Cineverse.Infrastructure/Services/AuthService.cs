using Cineverse.Application.DTOs.Auth;
using Cineverse.Application.Exceptions;
using Cineverse.Application.Interfaces;
using Cineverse.Application.Settings;
using Cineverse.Domain.Entities;
using Cineverse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Cineverse.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _dbContext;
        private readonly JwtSettings _jwtSettings;

        public AuthService(AppDbContext dbContext, IOptions<JwtSettings> jwtSettings)
        {
            _dbContext = dbContext;
            _jwtSettings = jwtSettings.Value;
        }
        public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct)
        {
            if (await _dbContext.Users.AnyAsync(u => u.Email == request.Email, ct))
                throw new ValidationException("Email already exists");

            if (await _dbContext.Users.AnyAsync(u => u.UserName == request.UserName, ct))
                throw new ValidationException("Username already exists");

            var user = new User
            {
                Email = request.Email,
                UserName = request.UserName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync(ct);

            return new AuthResponse(GenerateToken(user), user.UserName, user.Email);
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email, ct)
                ?? throw new NotFoundException("Invalid credentials");

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new ValidationException("Invalid credentials");

            return new AuthResponse(GenerateToken(user), user.UserName, user.Email);
        }

        private string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddDays(_jwtSettings.ExpiryDays),
                signingCredentials: creds
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static void ValidateRegistration(RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.UserName) ||
                request.UserName.Length < 3 ||
                request.UserName.Length < 20)
                throw new ValidationException("Username must be 3-20 characters");

            if (!System.Text.RegularExpressions.Regex.IsMatch(request.UserName, @"^[a-zA-Z0-9_]+$"))
                throw new ValidationException("Username can only contain letters, numbers and underscores");

            if (!System.Text.RegularExpressions.Regex.IsMatch(request.Email, @"^[^\s@]+@[^\s@]+\.[^\s@]+$"))
                throw new ValidationException("Invalid email format");

            if (request.Password.Length < 8)
                throw new ValidationException("Password must be at least 8 characters");
            if (!request.Password.Any(char.IsUpper))
                throw new ValidationException("Password must contain at least one uppercase letter");
            if (!request.Password.Any(char.IsLower))
                throw new ValidationException("Password must contain at least one lowercase letter");
            if (!request.Password.Any(char.IsDigit))
                throw new ValidationException("Password must contain at least one number");
        }
    }

}
