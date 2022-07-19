
namespace API.DTOs
{
    public class AddProductDto 
    {
      
        public int Price { get; set; }

        public string ProductName { get; set; }  = default!;
        
        public string ProductDescription{ get; set; } = default!;


    }
}