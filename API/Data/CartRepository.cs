using API.DTOs;
using API.Entities;
using API.Entitites;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class CartRepository : ICartRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public CartRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<ShoppingCart> GetProduct(int sourceUserId, int addedProductId)
        {
            return await _context.ShoppingCart.FindAsync(addedProductId, sourceUserId);
        }

        public async Task<PagedList<ProductDto>> GetUserAddedProducts(CartParams cartParams)
        {
           
            IQueryable<Products> products;
            
            var cart  = _context.ShoppingCart.AsQueryable();

           
                cart = cart.Where(c => c.SourceUserId == cartParams.UserId);
                products = cart.Select(c => c.ProductAdded);
           

            var likedProducts = products.Select(p => new ProductDto {
                ProductName = p.ProductName,
                ProductDescription = p.ProductDescription,
                Price = p.Price,
                Id = p.Id,
                PhotoUrl = p.ProductPhotos.First(p => p.isMain).Url,
            });

            return await PagedList<ProductDto>.CreateAsync(likedProducts,cartParams.PageNumber, cartParams.PageSize);
        }

         public async Task<AppCustomer> GetUserWithAddedProducts(int userId)
        {
            return await _context.Customers
            .Include(u => u.ShoppingCart)
            .FirstOrDefaultAsync(u => u.Id == userId);
        }

    }
}