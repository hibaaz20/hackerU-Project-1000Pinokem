using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entitites
{
    [Table("ProductPhotos")]
    public class ProductPhotos
    {

        public int Id { get; set; }

        public string Url { get; set; } = default!;

        public bool isMain { get; set; }
        
        public string PublicId { get; set; } = default!;
         
        public Products Product { get; set; } = default!;
        public int ProductId { get; set; }


    }
}