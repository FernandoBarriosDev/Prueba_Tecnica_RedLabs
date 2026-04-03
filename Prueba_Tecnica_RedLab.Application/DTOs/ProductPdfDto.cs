using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prueba_Tecnica_RedLab.Application.DTOs
{
    public class ProductPdfDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Description { get; set; }
        public decimal Precio { get; set; }
        public bool Estado { get; set; }
    }
}
