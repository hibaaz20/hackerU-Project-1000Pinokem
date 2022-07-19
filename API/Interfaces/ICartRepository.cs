using API.DTOs;
using API.Entities;
using API.Entitites;
using API.Helpers;

namespace API.Interfaces
{
    public interface ICartRepository
    {
        Task<ShoppingCart> GetProduct(int sourceUserId, int addedProductId);

        Task<AppCustomer> GetUserWithAddedProducts(int userId);
        Task<PagedList<ProductDto>> GetUserAddedProducts(CartParams cartParams);
      

    }
}