using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Prueba_Tecnica_RedLab.Application.DTOs;
using Prueba_Tecnica_RedLab.Application.Interfaces;
using Prueba_Tecnica_RedLab.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IConfiguration _config;
    public AuthController(IAuthService authService, IConfiguration config)
    {
        _authService = authService;
        _config = config;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterDto? dto)
    {
        if (dto is null)
            return BadRequest(new { message = "Envía un JSON válido con usuario y contraseña (POST /api/auth/register)." });

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        try
        {
            var user = _authService.Register(dto);
            if (user == null)
                return Conflict(new { message = "El nombre de usuario ya está en uso." });

            var token = BuildToken(user);
            return Ok(new { token });
        }
        catch (DbUpdateException)
        {
            return StatusCode(500, new
            {
                message = "Error al guardar el usuario. Revisa que SQL Server esté en marcha (docker compose up) y la cadena de conexión en appsettings.json."
            });
        }
        catch (InvalidOperationException ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto? dto)
    {
        if (dto is null)
            return BadRequest(new { message = "Envía usuario y contraseña en JSON." });

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var user = _authService.Login(dto);
        if (user == null)
            return Unauthorized();

        return Ok(new { token = BuildToken(user) });
    }

    private string BuildToken(User user)
    {
        var jwtKey = _config["Jwt:Key"];
        if (string.IsNullOrEmpty(jwtKey))
            throw new InvalidOperationException("Jwt:Key no está configurada.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("id", user.Id.ToString()),
            new Claim("username", user.Username)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}