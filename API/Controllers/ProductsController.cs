using API.Data;
using API.DTOs;
using API.DTOs.CustomerDtos;
using API.Entitites;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class ProductsController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IProductRepository _productRepository;
        private readonly IPhotoService _photoService;
        private readonly IMapper _mapper;


        public ProductsController(DataContext context, IProductRepository productRepository, IPhotoService photoService, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
            _productRepository = productRepository;
            _photoService = photoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> getProducts([FromQuery] ProductParams productParams)
        {  
           var products = await _productRepository.GetProductsAsync(productParams);
                Response.AddPaginationHeader(
                products.CurrentPage,
                products.PageSize,
                products.TotalCount,
                products.TotalPages
            );
            return Ok(products);
        }
        
        [HttpGet("search/{input}")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> getSearchedProducts([FromQuery] ProductParams productParams, string input)
        {  
           var products = await _productRepository.getSearchedProductst(productParams, input);
                Response.AddPaginationHeader(
                products.CurrentPage,
                products.PageSize,
                products.TotalCount,
                products.TotalPages
            );
            return Ok(products);
        }


       
       

        [HttpGet("{id}")]
         public async Task<ActionResult<ProductDto>> getProduct(int id)
        {
            var productToReturn = await _productRepository.GetProductDtoAsync(id);
            return productToReturn;

        }



        [HttpPut("{productId}")]
        public async Task<ActionResult> UpdateProduct(int id, ProductUpdateDTO productUpdateDTO)
        {
           
            var product = await _productRepository.GetProductByIdAsync(id);

            if(product == null) return NotFound();

            _mapper.Map(productUpdateDTO, product);

            _productRepository.Update(product);
            

            if (await _productRepository.SaveAllAsync())
            {
                return NoContent();
            }
         
            return BadRequest("Failed to update product");
        }




        [HttpPost("add-product")]
        public async Task<ActionResult<Products>> AddProduct(AddProductDto productDto)
        {
            var product = new Products
            {
                ProductName = productDto.ProductName,
                ProductDescription = productDto.ProductDescription,
                Price = productDto.Price,
            };


         
            _productRepository.addProduct(product);

            
            await _productRepository.SaveAllAsync();

            return product;
            
          
        }


        [HttpPost("{productId}/add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file, int productId)
        {
           var product = await _productRepository.GetProductByIdAsync(productId);
           
          
            var result = await _photoService.UploadPhotoAsync(file);

             if (product == null)
            {
                return NotFound();
            }
            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }
        
            var photo = new ProductPhotos
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                
            };
        
            if(product.ProductPhotos.Count == 0)
            {
                 photo.isMain = true;
            }
           
         
            product.ProductPhotos.Add(photo);
          

            if (await _productRepository.SaveAllAsync())
            {
                 return _mapper.Map<PhotoDto>(photo);
            }

            return BadRequest("Problem adding Photos");
        }



        [HttpDelete("delete-product/{productId}")]
        public async Task<ActionResult> DeleteProduct(int productId)
        {

            var product = await _productRepository.GetProductByIdAsync(productId);
          
            
            if(product == null) return NotFound();
            
            foreach(var photo in product.ProductPhotos){
            
            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);

                if (result.Error != null) return BadRequest(result.Error.Message);
            };
            }
          

            _productRepository.Delete(product);


            if (await _productRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to delete product");
        }





        
     
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int productId,int photoId)
        {
         
            var product = await _productRepository.GetProductByIdAsync(productId);
            var photo = product.ProductPhotos.FirstOrDefault(p => p.Id == photoId);


            if (photo == null) return BadRequest("Photo not found");

            if (photo.isMain) return BadRequest("U can't delete the main photo");

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
               
                if (result.Error != null) return BadRequest(result.Error.Message);
            }
           
            product.ProductPhotos.Remove(photo);

            if (await _productRepository.SaveAllAsync()) return Ok();
            return BadRequest("Failed to delete photo");
        }
    

        
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int productId, int photoId)
        {
         
            var product = await _productRepository.GetProductByIdAsync(productId);

            var photo = product.ProductPhotos.FirstOrDefault(x => x.Id == photoId);

            if (photo == null) return BadRequest("Photo not found");

            if (photo.isMain) return BadRequest("this is already the main photo");

            var currentMain = product.ProductPhotos.FirstOrDefault(x => x.isMain);

            if (currentMain != null) currentMain.isMain = false;
            photo.isMain = true;

            if (await _productRepository.SaveAllAsync()) return NoContent();

            return BadRequest(" Failed to set photo to main");
        }
    }
}

    
