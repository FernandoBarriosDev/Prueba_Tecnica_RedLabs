using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prueba_Tecnica_RedLab.Domain.Entities
{
    public class Product
    {
        public Guid Id {  get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Precio { get; set; }
        public bool Estado { get; set; }
        public string? UsuarioCreacion { get; set; }
        public DateTime FechaCreacion { get; set; }
        public string? UsuarioModificacion { get; set; }
        public DateTime? FechaModificacion { get; set; }

    }
}
