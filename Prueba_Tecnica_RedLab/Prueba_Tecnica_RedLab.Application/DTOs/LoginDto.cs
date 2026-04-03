using System.ComponentModel.DataAnnotations;

namespace Prueba_Tecnica_RedLab.Application.DTOs
{
    public class LoginDto
    {
        [Required(ErrorMessage = "El usuario es obligatorio.")]
        [MinLength(1, ErrorMessage = "El usuario no puede estar vacío.")]
        [MaxLength(100, ErrorMessage = "El usuario no puede superar 100 caracteres.")]
        public required string Username { get; set; }

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        [MinLength(7, ErrorMessage = "La contraseña debe tener más de 6 caracteres.")]
        [MaxLength(128, ErrorMessage = "La contraseña no puede superar 128 caracteres.")]
        public required string Password { get; set; }
    }
}
