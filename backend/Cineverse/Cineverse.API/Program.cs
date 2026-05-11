using Cineverse.Application.Interfaces;
using Cineverse.Application.Settings;
using Cineverse.Infrastructure.Data;
using Cineverse.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;


namespace Cineverse.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddMemoryCache();

            builder.Services.AddDbContext<AppDbContext>(options => 
                options.UseNpgsql(builder.Configuration
                .GetConnectionString("DefaultConnection")));

            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IReviewService, ReviewService>();
            builder.Services.AddScoped<IWatchlistService, WatchlistService>();
            builder.Services.AddHttpClient<IMovieService, TmdbService>();

            builder.Services.Configure<JwtSettings>(
                builder.Configuration.GetSection("Jwt"));

            builder.Services.Configure<TmdbSettings>(
                builder.Configuration.GetSection("Tmdb"));
            
            var jwtSettings = builder.Configuration
                .GetSection("Jwt")
                .Get<JwtSettings>()!;

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(jwtSettings.Secret)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });
               

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("Frontend", policy =>
                    policy.WithOrigins("http://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod());
            });

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Database.Migrate();
            }

            app.UseCors("Frontend");
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.MapGet("/health", () => "OK");  // эндпоинт для проверки

            app.Run();
        }
    }
}
