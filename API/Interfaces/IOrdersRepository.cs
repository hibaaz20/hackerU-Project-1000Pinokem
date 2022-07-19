using API.DTOs;
using API.Entitites;
using API.Helpers;

namespace API.Interfaces
{
    public interface IOrdersRepository
    {
        Task<bool> SaveAllAsync();
        Task<Orders> GetOrder(int OrderId);
        Task<PagedList<OrderDto>> GetOrdersAsync(OrderParams orderParams);
        Task<OrderDto> GetOrderDtoAsync(int id);
       
        Task<AppCustomer> GetUserWithOrder(int userId);
        Task<PagedList<OrderDto>> GetUserOrders( OrderParams orderParams);
        Task<Orders> GetOrderByIdAsync(int id);
      

    }
}