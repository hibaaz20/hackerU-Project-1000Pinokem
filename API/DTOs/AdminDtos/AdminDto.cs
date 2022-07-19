using API.DTOs;

namespace API.Entitites
{
    public class AdminDto
    {
        public int Id { get; set; }
        public string Token { get; set; } = default!;

        public string UserName { get; set; } = default!;
        public string PhotoUrl { get; set; } = default!;
        public string Email { get; set; } = default!;

        public ICollection<PhotoDto> AdminProfilePhoto { get; set; } = default!;

       
    }
}