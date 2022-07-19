using API.DTOs;
using API.Entities;
using API.Entitites;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class CartController : BaseApiController
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        private readonly ICustomerRepository _customerRepository;
        private readonly ICartRepository _cartRepository;

        public CartController(IProductRepository productRepository, ICustomerRepository customerRepository, ICartRepository cartRepository, IMapper mapper)
        {
            _cartRepository = cartRepository;
            _customerRepository = customerRepository;
            _mapper = mapper;
            _productRepository = productRepository;
        }

        [HttpPost("{productId}")]
        public async Task<ActionResult> AddToCart(int productId, string username)
        {

            var user = await _customerRepository.GetUserByUserNameAsync(username);
            int sourceUserId = user.Id;
            var addedProduct = await _productRepository.GetProductByIdAsync(productId);
            var sourceUser = await _cartRepository.GetUserWithAddedProducts(sourceUserId);

            if (addedProduct == null) return NotFound();


            var product = await _cartRepository.GetProduct(sourceUserId, addedProduct.Id);
            if (product != null) return BadRequest("you already have this product in your cart");


            product = new ShoppingCart
            {
                SourceUserId = sourceUserId,
                ProductAddedId = addedProduct.Id
            };

            sourceUser.ShoppingCart.Add(product);

            if (await _customerRepository.SaveAllAsync()) return Ok();
            return BadRequest("Failed to like product");
        }

        

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetUserCart([FromQuery] CartParams cartParams, string username)
        {
           AppCustomer user = await _customerRepository.GetUserByUserNameAsync(username);

            cartParams.UserId = user.Id;

            var products = await _cartRepository.GetUserAddedProducts(cartParams);
            Response.AddPaginationHeader(products.CurrentPage, products.PageSize, products.TotalCount, products.TotalPages);
            return Ok(products);
        }


        
        [HttpDelete("remove-product/{productId}")]
        public async Task<ActionResult> RemoveProduct(int productId, string username)
        {
            var user = await _customerRepository.GetUserByUserNameAsync(username);
            int sourceUserId = user.Id;
            var addedProduct = await _productRepository.GetProductByIdAsync(productId);
            var sourceUser = await _cartRepository.GetUserWithAddedProducts(sourceUserId);

            if (addedProduct == null) return NotFound();
            
            var product = await _cartRepository.GetProduct(sourceUserId, addedProduct.Id);
          
            sourceUser.ShoppingCart.Remove(product);

            if (await _productRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to delete product");
        }
        

    }
}