using API.DTOs;
using API.Entitites;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class ProductRepository : IProductRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ProductRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<Products> GetProductByIdAsync(int id)
        {
          return await _context.Products
            .Include(x => x.ProductPhotos)
            .SingleOrDefaultAsync(x => x.Id == id);
        }

       

        public async Task<ProductDto> GetProductDtoAsync(int id)
        {
            return await _context.Products
           .Where(x => x.Id == id)
           .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
           .SingleOrDefaultAsync();
        }
 
        public async Task<PagedList<ProductDto>> GetProductsAsync(ProductParams productParams)
        {
           
            var query = _context.Products.AsQueryable();

            query = query.Where(x => x.Price >= productParams.MinPrice && x.Price <= productParams.MaxPrice);
          

            query = productParams.OrderBy switch
            {
                "created" => query.OrderBy(x => x.Created),
                _ => query.OrderByDescending(x => x.Price),
            };

            return await PagedList<ProductDto>.CreateAsync
            (
                query.ProjectTo<ProductDto>(_mapper.ConfigurationProvider).AsNoTracking(),
                productParams.PageNumber,
                productParams.PageSize
            );
        }

        public void addProduct(Products product)
        {
            _context.Products.Add(product);

        }

         
        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(Products product)
        {
            _context.Entry<Products>(product).State = EntityState.Modified;

        }

         public void Delete(Products product)
        {
            _context.Products.Remove(product);

        }

        public async Task<PagedList<ProductDto>> getSearchedProductst(ProductParams productParams, string input)
        {
            var products = _context.Products.AsQueryable();

            products = products.Where(o => o.ProductName.ToLower().Contains(input.ToLower()));

            products = products.Where(x => x.Price >= productParams.MinPrice && x.Price <= productParams.MaxPrice);
 
            products = productParams.OrderBy switch
            {
                "created" => products.OrderBy(x => x.Created),
                _ => products.OrderByDescending(x => x.Price),
            };

    
            
            return await PagedList<ProductDto>.CreateAsync
            (
                products.ProjectTo<ProductDto>(_mapper.ConfigurationProvider).AsNoTracking(),
                productParams.PageNumber,
                productParams.PageSize
            );

        }
    }
}