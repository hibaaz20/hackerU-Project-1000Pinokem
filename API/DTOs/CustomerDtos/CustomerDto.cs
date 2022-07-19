using API.DTOs;

namespace API.Entitites
{
    public class CustomerDto
    {
        public int Id { get; set; }
        public string UserName { get; set; } = default!;
        public string PhotoUrl { get; set; } = default!;
        public string Email { get; set; } = default!;

        public string City { get; set; } = default!;
       
        public ICollection<PhotoDto> CustomerProfilePhoto { get; set; } = default!;

       
    }
}