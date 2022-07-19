
namespace API.DTOs
{
    public class ProductDto
    {
      
        public int Id { get; set; }
        public int Price { get; set; }

        public string PhotoUrl { get; set; } = default!;

        public string ProductName { get; set; }  = default!;
        
        public string ProductDescription{ get; set; } = default!;

        public DateTime Created { get; set; } 

        public ICollection<PhotoDto> ProductPhotos { get; set; } = default!;


    }
}