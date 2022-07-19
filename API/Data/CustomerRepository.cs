using API.Entitites;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public CustomerRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

         public async Task<PagedList<CustomerDto>> getSearchedCustomers(UserParams userParams, string input)
        {
            var customers = _context.Customers.AsQueryable();
           
            customers = customers.Where(o => o.UserName.ToLower().Contains(input.ToLower()));
            
            return await PagedList<CustomerDto>.CreateAsync
            (
                customers.ProjectTo<CustomerDto>(_mapper.ConfigurationProvider).AsNoTracking(),
                userParams.PageNumber,
                userParams.PageSize
            );

        }

        public async Task<AppCustomer> GetUserByUserNameAsync(string username)
        {
            return await _context.Customers
            .Include(x => x.CustomerProfilePhoto)
            .SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<PagedList<CustomerDto>> GetCustomersAsync(UserParams userParams)
        {

            var query = _context.Customers.AsQueryable();

            query = userParams.OrderBy switch
            {
         
                "username" => query.OrderBy(x => x.UserName),
                _ => query.OrderBy(x => x.Id),
        
            };

            return await PagedList<CustomerDto>.CreateAsync
            (
                query.ProjectTo<CustomerDto>(_mapper.ConfigurationProvider).AsNoTracking(),
                userParams.PageNumber,
                userParams.PageSize
            );
        }


        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

    
        public void Delete(AppCustomer customer)
        {
            _context.Customers.Remove(customer);

        }

        public async Task<CustomerDto> GetCustomerDtoAsync(string username)
        {
            return await _context.Customers
           .Where(x => x.UserName == username)
           .ProjectTo<CustomerDto>(_mapper.ConfigurationProvider)
           .SingleOrDefaultAsync();
        }

         public void Update(AppCustomer customer)
        {
            _context.Entry<AppCustomer>(customer).State = EntityState.Modified;

        }

     
        
    }
}