using System.ComponentModel.DataAnnotations.Schema;


namespace API.Entitites
{
    [Table("Orders")]
    public class Orders
    {
        public int OrderId { get; set; }

        public DateTime OrderDate {get; set;} = DateTime.Now;

        public AppCustomer Customer { get; set; } = default!; 
        public int CustomerId { get; set; }

        public Products Product{ get; set; } = default!;
        public int ProductId { get; set; }

        public int Total { get; set; } 
        public int Quantity { get; set; }
        public int Price { get; set; }

        
    }
}