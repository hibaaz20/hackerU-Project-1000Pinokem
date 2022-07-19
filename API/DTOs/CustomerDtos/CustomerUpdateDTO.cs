
namespace API.DTOs.CustomerDtos
{
    public class CustomerUpdateDTO
    {
        public string UserName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string City { get; set; } = default!;

    }
}