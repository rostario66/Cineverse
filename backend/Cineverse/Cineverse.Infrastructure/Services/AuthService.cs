using Cineverse.Application.DTOs.Auth;
using Cineverse.Application.Interfaces;
using Cineverse.Domain.Entities;
using Cineverse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Cineverse.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext dbContext, IConfiguration config)
        {
            _dbContext = dbContext;
            _config = config;
        }
        public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct)
        {
            if (await _dbContext.Users.AnyAsync(u => u.Email == request.Email, ct))
                throw new Exception("Email already exists");

            if (await _dbContext.Users.AnyAsync(u => u.UserName == request.UserName, ct))
                throw new Exception("Username already exists");

            var user = new User
            {
                Email = request.Email,
                UserName = request.UserName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync(ct);

            return new AuthResponse
            {
                Token = GenerateToken(user),
                UserName = user.UserName,
                Email = user.Email,
            };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email, ct)
                ?? throw new Exception("Invalid credentials");

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new Exception("Invalid credentials");

            return new AuthResponse
            {
                Token = GenerateToken(user),
                UserName = user.UserName,
                Email = user.Email,
            };
        }

        
        private string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("Jwt")["Secret"]!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

}
