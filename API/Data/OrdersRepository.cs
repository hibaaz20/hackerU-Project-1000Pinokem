using API.DTOs;
using API.Entitites;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class OrdersRepository : IOrdersRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly ICustomerRepository _customerRepository;

        public OrdersRepository(DataContext context, IMapper mapper, ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
            _mapper = mapper;
            _context = context;
        }


        public async Task<Orders> GetOrderByIdAsync(int id)
        {
            return await _context.Orders
             .Include(x => x.Product)
             .SingleOrDefaultAsync(x => x.OrderId == id);
        }


        public async Task<Orders> GetOrder(int orderedroductId)
        {
            return await _context.Orders.FindAsync(orderedroductId);
        }



        public async Task<PagedList<OrderDto>> GetOrdersAsync(OrderParams orderParams)
        {
            var query = _context.Orders.AsQueryable();

            query.Include(x => x.Customer.UserName);

            query = orderParams.OrderBy switch
            {
                "OrderDate" => query.OrderByDescending(x => x.OrderDate),
                _ => query.OrderByDescending(x => x.Total),
            };

          
            return await PagedList<OrderDto>.CreateAsync
            (
                query.ProjectTo<OrderDto>(_mapper.ConfigurationProvider).AsNoTracking(),
                orderParams.PageNumber,
                orderParams.PageSize

            );
        }

        public async Task<Orders> GetProductByOrderIdAsync(int id)
        {
            return await _context.Orders
              .SingleOrDefaultAsync(x => x.OrderId == id);

        }

        public async Task<PagedList<OrderDto>> GetUserOrders(OrderParams orderParams)
        {
       
            var orders = _context.Orders.AsQueryable();

           orders = orders.Where(x=> x.CustomerId == orderParams.UserId);
           
            orders = orderParams.OrderBy switch
            {
                "OrderDate" => orders.OrderByDescending(x => x.OrderDate),
                _ => orders.OrderByDescending(x => x.OrderDate),
            };

            return await PagedList<OrderDto>.CreateAsync
            (
                orders.ProjectTo<OrderDto>(_mapper.ConfigurationProvider).AsNoTracking(),
                orderParams.PageNumber,
                orderParams.PageSize
            );
        }

        public async Task<AppCustomer> GetUserWithOrder(int userId)
        {
            return await _context.Customers
             .Include(u => u.Orders)
             .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<OrderDto> GetOrderDtoAsync(int id)
        {
            return await _context.Orders
            .Where(x => x.OrderId == id)
            .ProjectTo<OrderDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
        }

      
    }
}