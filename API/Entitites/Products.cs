
namespace API.Entitites
{
    public class Products
    {
        public int Id { get; set; }
        public int Price { get; set; }

        public string ProductName { get; set; }  = default!;
        
        public string ProductDescription{ get; set; } = default!;

        public ICollection<ProductPhotos> ProductPhotos { get; set; } = default!;

        public DateTime Created { get; set; } = DateTime.Now;


            
    }
}