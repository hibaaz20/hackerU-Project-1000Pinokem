using API.Entitites;
using API.Helpers;

namespace API.Interfaces
{
    public interface ICustomerRepository
    {
        void Update(AppCustomer customer);
        void Delete(AppCustomer customer);

        Task<bool> SaveAllAsync();

       Task<PagedList<CustomerDto>> GetCustomersAsync(UserParams userParams);
       Task<AppCustomer> GetUserByUserNameAsync(string username);

       Task<CustomerDto> GetCustomerDtoAsync(string username);
        Task<PagedList<CustomerDto>> getSearchedCustomers(UserParams userParams, string input);
      
     
    }
}