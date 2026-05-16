using Cineverse.Application.Exceptions;
using System.Text.Json;

namespace Cineverse.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            context.Response.ContentType = "application/json";

            var (statusCode, message) = ex switch
            {
                ValidationException e => (400, e.Message),
                NotFoundException e => (404, e.Message),
                UnauthorizedAccessException e => (401, e.Message),
                _ => (500, "Internal server error")
            };

            context.Response.StatusCode = statusCode;

            var response = JsonSerializer.Serialize(new { message });
            await context.Response.WriteAsync(response);
        }
    }
}
