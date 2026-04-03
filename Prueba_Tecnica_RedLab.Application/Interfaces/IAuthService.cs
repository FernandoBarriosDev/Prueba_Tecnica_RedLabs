using Prueba_Tecnica_RedLab.Application.DTOs;
using Prueba_Tecnica_RedLab.Domain.Entities;

namespace Prueba_Tecnica_RedLab.Application.Interfaces
{
    public interface IAuthService
    {
        User? Register(RegisterDto dto);
        User? Login(LoginDto dto);
    }
}
