using API.DTOs;
using API.Entitites;
using API.Helpers;

namespace API.Interfaces
{
    public interface IProductRepository
    {
        void Update(Products product);
        void Delete(Products product);
        void addProduct(Products product);
        Task<bool> SaveAllAsync();

        Task<PagedList<ProductDto>> GetProductsAsync(ProductParams productParams);

        Task<ProductDto> GetProductDtoAsync(int id);
        Task<Products> GetProductByIdAsync(int id);

        Task<PagedList<ProductDto>> getSearchedProductst(ProductParams productParams, string input);

      
     
    }
}