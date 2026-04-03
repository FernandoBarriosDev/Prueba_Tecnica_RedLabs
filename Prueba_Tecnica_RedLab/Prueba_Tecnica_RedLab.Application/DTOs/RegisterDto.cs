using System.ComponentModel.DataAnnotations;

namespace Prueba_Tecnica_RedLab.Application.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "El usuario es obligatorio.")]
        [MinLength(1, ErrorMessage = "El usuario no puede estar vacío.")]
        public required string Username { get; set; }

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        [MinLength(1, ErrorMessage = "La contraseña no puede estar vacía.")]
        public required string Password { get; set; }
    }
}
