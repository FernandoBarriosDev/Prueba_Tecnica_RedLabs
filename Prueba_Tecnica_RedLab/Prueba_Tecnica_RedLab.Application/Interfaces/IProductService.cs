using Prueba_Tecnica_RedLab.Domain.Entities;

namespace Prueba_Tecnica_RedLab.Application.Interfaces
{
    public interface IProductService
    {
        List<Product> GetAll();
        Product? GetById(Guid id);
        Product Create(Product product);
        Product? Update(Product product);
        bool Delete(Guid id);
    }
}
