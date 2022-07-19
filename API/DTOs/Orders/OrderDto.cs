using API.Entitites;

namespace API.DTOs
{
    public class OrderDto
    {
      
        public int OrderId { get; set; }
        public DateTime OrderDate {get; set;} = DateTime.Now;
        public ProductDto Product { get; set; } = default!;
        public UserDto Customer { get; set; } = default!;
        public int Quantity{ get; set; }
        
    }
}