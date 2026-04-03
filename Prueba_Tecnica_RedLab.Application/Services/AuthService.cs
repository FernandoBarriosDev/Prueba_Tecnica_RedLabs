using Prueba_Tecnica_RedLab.Application.DTOs;
using Prueba_Tecnica_RedLab.Application.Interfaces;
using Prueba_Tecnica_RedLab.Domain.Entities;

namespace Prueba_Tecnica_RedLab.Application.Services
{
    public class AuthService : IAuthService
    {
  
        private readonly IUserRepository _users;
        private readonly IPasswordHasher _hasher;

        //constructor
        public AuthService(IUserRepository users, IPasswordHasher hasher)
        {
            _users = users;
            _hasher = hasher;
        }
        //register mtodo
        public User? Register(RegisterDto dto)
        {
            if (_users.GetByUsername(dto.Username) != null)
                return null;

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = dto.Username,
                Password = _hasher.Hash(dto.Password)
            };

            _users.Add(user);
            return user;
        }
        //login metodo
        public User? Login(LoginDto dto)
        {
            var user = _users.GetByUsername(dto.Username);
            if (user == null || !_hasher.Verify(dto.Password, user.Password))
                return null;

            return user;
        }
    }
}
