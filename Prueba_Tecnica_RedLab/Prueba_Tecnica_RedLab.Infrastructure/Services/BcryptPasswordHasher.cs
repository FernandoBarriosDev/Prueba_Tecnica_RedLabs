using Prueba_Tecnica_RedLab.Application.Interfaces;
//hasherde contrase;nas usando bycript
namespace Prueba_Tecnica_RedLab.Infrastructure.Services
{
    public class BcryptPasswordHasher : IPasswordHasher
    {
        public string Hash(string password) =>
            BCrypt.Net.BCrypt.HashPassword(password);





        public bool Verify(string password, string hash) =>
            BCrypt.Net.BCrypt.Verify(password, hash);
    }
}
