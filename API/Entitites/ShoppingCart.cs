using API.Entitites;

namespace API.Entities
{
    public class ShoppingCart
    {
        public AppCustomer SourceUser { get; set; } = default!; 
        public int SourceUserId { get; set; }
        
        public Products ProductAdded { get; set; } = default!; 
        public int ProductAddedId { get; set; }

    }
}