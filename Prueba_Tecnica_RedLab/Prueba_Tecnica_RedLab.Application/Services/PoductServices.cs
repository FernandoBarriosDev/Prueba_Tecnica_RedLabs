using Prueba_Tecnica_RedLab.Application.Interfaces;
using Prueba_Tecnica_RedLab.Domain.Entities;

namespace Prueba_Tecnica_RedLab.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repo;
        //constructor
        public ProductService(IProductRepository repo)
        {
            _repo = repo;
        }
        //get all
        public List<Product> GetAll()
        {
            return _repo.GetAll();
        }
        //get by id
        public Product? GetById(Guid id)
        {
            return _repo.GetById(id);
        }
        //create
        public Product Create(Product product)
        {
            _repo.Add(product);
            return product;
        }
        //update
        public Product? Update(Product product)
        {
            var existing = _repo.GetById(product.Id);
            if (existing == null) return null;

            existing.Nombre = product.Nombre;
            existing.Description = product.Description;
            existing.Precio = product.Precio;
            existing.Estado = product.Estado;
            existing.UsuarioModificacion = product.UsuarioModificacion;
            existing.FechaModificacion = DateTime.UtcNow;

            _repo.Update(existing);
            return existing;
        }

        //delete
        public bool Delete(Guid id)
        {
            var product = _repo.GetById(id);
            if (product == null) return false;

            _repo.Delete(product);
            return true;
        }
    }
}