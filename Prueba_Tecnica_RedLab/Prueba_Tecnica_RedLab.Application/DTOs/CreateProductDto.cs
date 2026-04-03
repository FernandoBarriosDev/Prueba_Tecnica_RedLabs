using System.ComponentModel.DataAnnotations;

namespace Prueba_Tecnica_RedLab.Application.DTOs
{
    public class CreateProductDto
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(200, MinimumLength = 1, ErrorMessage = "El nombre debe tener entre 1 y 200 caracteres.")]
        public string Nombre { get; set; } = string.Empty;

        [StringLength(2000, ErrorMessage = "La descripción no puede superar 2000 caracteres.")]
        public string? Description { get; set; }

        [Range(0, 999999999, ErrorMessage = "El precio debe ser mayor o igual que 0.")]
        public decimal Precio { get; set; }

        public bool Estado { get; set; }
    }
}