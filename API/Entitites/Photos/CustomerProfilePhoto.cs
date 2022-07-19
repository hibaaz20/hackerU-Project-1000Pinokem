using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entitites
{
   
    [Table("CustomerProfilePhoto")]
    public class CustomerProfilePhoto
    {
        public int Id { get; set; }

        public string Url { get; set; } = default!;
        
        public bool IsMain { get; set; }

        public string PublicId { get; set; } = default!;

        public AppCustomer AppCustomer { get; set; } = default!;
        public int AppCustomerId { get; set; }
    }
}