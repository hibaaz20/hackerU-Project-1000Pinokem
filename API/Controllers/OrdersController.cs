using API.DTOs;
using API.Entitites;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class OrdersController : BaseApiController
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        private readonly ICustomerRepository _customerRepository;
        private readonly IOrdersRepository _ordersRepository;

        public OrdersController(IProductRepository productRepository, ICustomerRepository customerRepository, IOrdersRepository ordersRepository, IMapper mapper)
        {
            _ordersRepository = ordersRepository;
            _customerRepository = customerRepository;
            _mapper = mapper;
            _productRepository = productRepository;
        }


        [HttpPost]
        public async Task<ActionResult> AddOrder(string username, int productId, int quantity = 1)
        {

            var user = await _customerRepository.GetUserByUserNameAsync(username);
            int sourceUserId = user.Id;
            var orderedroduct = await _productRepository.GetProductByIdAsync(productId);
            var sourceUser = await _ordersRepository.GetUserWithOrder(sourceUserId);

            if (orderedroduct == null) return NotFound();


            var product = await _ordersRepository.GetOrder(orderedroduct.Id);



            product = new Orders
            {
                CustomerId = sourceUserId,
                ProductId = orderedroduct.Id,
                Price = orderedroduct.Price,
                Quantity = quantity,
                Total = quantity * orderedroduct.Price
                
            };

            sourceUser.Orders.Add(product);

            if (await _customerRepository.SaveAllAsync()) return Ok();
            return BadRequest("Failed to order product");
        }



        [HttpGet("{username}/orders")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetUserOrders([FromQuery] OrderParams orderParams, string username)
        {
            var user = await _customerRepository.GetUserByUserNameAsync(username);
            orderParams.UserId = user.Id;
   
            var orders = await _ordersRepository.GetUserOrders(orderParams);
            Response.AddPaginationHeader(orders.CurrentPage, orders.PageSize, orders.TotalCount, orders.TotalPages);
          
            return Ok(orders);
        }


        
        [HttpDelete("remove-order/{orderId}")]
        public async Task<ActionResult> CancelOrder(int orderId, string username)
        {
            var user = await _customerRepository.GetUserByUserNameAsync(username);
            int sourceUserId = user.Id;
            var order = await _ordersRepository.GetOrderByIdAsync(orderId);
            var sourceUser = await _ordersRepository.GetUserWithOrder(sourceUserId);

            if (order == null) return NotFound();
          
            var userOrder = await _ordersRepository.GetOrder(order.OrderId);

            if (userOrder == null) return NotFound();
            
          
            sourceUser.Orders.Remove(userOrder);

            if (await _productRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to cancel order");
        }



        
        [HttpGet]
         public async Task<ActionResult<IEnumerable<OrderDto>>> getOrders([FromQuery] OrderParams orderParams)
        {  
           
           var orders = await _ordersRepository.GetOrdersAsync(orderParams);
                Response.AddPaginationHeader(
                orders.CurrentPage,
                orders.PageSize,
                orders.TotalCount,
                orders.TotalPages
            );
            return Ok(orders);
        }


        
        [HttpGet("{orderId}")]
        public async Task<ActionResult<OrderDto>> getOrder(int orderId)
        {  
           var order = await _ordersRepository.GetOrderDtoAsync(orderId);
            return order;
        }
    }
}