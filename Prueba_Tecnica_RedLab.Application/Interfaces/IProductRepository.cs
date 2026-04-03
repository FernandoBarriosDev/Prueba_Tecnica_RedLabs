using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Prueba_Tecnica_RedLab.Domain.Entities;

namespace Prueba_Tecnica_RedLab.Application.Interfaces
{
    public interface IProductRepository
    {
        List<Product> GetAll();
        Product? GetById(Guid id);
        void Add(Product product);
        void Update(Product product);
        void Delete(Product product);
    }
}