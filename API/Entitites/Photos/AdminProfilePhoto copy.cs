using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entitites
{
    [Table("AdminProfilePhoto")]

    public class AdminProfilePhoto
    {
        public int Id { get; set; }

        public string Url { get; set; } = default!;

        public bool IsMain { get; set; }

        public string PublicId { get; set; } = default!;

        public AppAdmin AppAdmin { get; set; } = default!;
        public int AppAdminId { get; set; }

    }
}