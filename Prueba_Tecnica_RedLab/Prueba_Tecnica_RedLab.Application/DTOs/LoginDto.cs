using System.ComponentModel.DataAnnotations;

namespace Prueba_Tecnica_RedLab.Application.DTOs
{
    public class LoginDto
    {
        [Required]
        [MinLength(1)]
        public required string Username { get; set; }

        [Required]
        [MinLength(1)]
        public required string Password { get; set; }
    }
}
