using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Prueba_Tecnica_RedLab.Application.DTOs;
using Prueba_Tecnica_RedLab.Application.Interfaces;
using Prueba_Tecnica_RedLab.Application.Services;
using Prueba_Tecnica_RedLab.Domain.Entities;

namespace Prueba_Tecnica_RedLab.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _service;
        private readonly PdfService _pdfService;

        public ProductsController(IProductService service, PdfService pdfService)
        {
            _service = service;
            _pdfService = pdfService;
        }
        //get all controller
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_service.GetAll());
        }

        // get by id controller
        [HttpGet("{id}")]
        public IActionResult GetById(Guid id)
        {
            var product = _service.GetById(id);
            if (product == null) return NotFound();

            return Ok(product);
        }

        //create controller
        [HttpPost]
        [Authorize]
        public IActionResult Create(CreateProductDto dto)
        {
            var username = User.Claims.First(c => c.Type == "username").Value;

            var product = new Product
            {
                Id = Guid.NewGuid(),
                Nombre = dto.Nombre,
                Description = dto.Description,
                Precio = dto.Precio,
                Estado = dto.Estado,
                UsuarioCreacion = username,
                FechaCreacion = DateTime.UtcNow
            };

            var created = _service.Create(product);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        //update controller
        [HttpPut("{id}")]
        [Authorize]
        public IActionResult Update(Guid id, [FromBody] CreateProductDto dto)
        {
            var product = _service.GetById(id);
            if (product == null) return NotFound();

            var username = User.Claims.First(c => c.Type == "username").Value;

            product.Nombre = dto.Nombre;
            product.Description = dto.Description;
            product.Precio = dto.Precio;
            product.Estado = dto.Estado;
            product.UsuarioModificacion = username;
            product.FechaModificacion = DateTime.UtcNow;

            var updated = _service.Update(product);
            return Ok(updated);
        }

        //delete controller
        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult Delete(Guid id)
        {
            var deleted = _service.Delete(id);
            if (!deleted) return NotFound();

            return NoContent();
        }

        //pdf controller
        [HttpGet("report")]
        [Authorize]
        public IActionResult GetPdfReport()
        {
            var products = _service.GetAll();
            var pdfBytes = _pdfService.GenerateProductsPdf(products);
            return File(pdfBytes, "application/pdf", "ReporteProductos.pdf");
        }
    }
}