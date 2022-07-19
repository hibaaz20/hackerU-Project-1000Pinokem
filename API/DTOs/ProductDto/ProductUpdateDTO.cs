
namespace API.DTOs.CustomerDtos
{
    public class ProductUpdateDTO
    {
        public int Price { get; set; }

        public string ProductName { get; set; }  = default!;
        
        public string ProductDescription{ get; set; } = default!;


    }
}