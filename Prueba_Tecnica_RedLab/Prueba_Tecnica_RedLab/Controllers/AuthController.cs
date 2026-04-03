using Microsoft.AspNetCore.Mvc;
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
    //register controller
    [HttpPost("register")]
    public IActionResult Register(RegisterDto dto)
    {
        var user = _authService.Register(dto);
        if (user == null)
            return Conflict(new { message = "El nombre de usuario ya está en uso." });

        return Ok(new { token = BuildToken(user) });
    }

    //login controller
    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        var user = _authService.Login(dto);
        if (user == null)
            return Unauthorized();

        return Ok(new { token = BuildToken(user) });
    }

    //token para autenticación
private string BuildToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
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