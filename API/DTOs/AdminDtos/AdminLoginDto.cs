using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class AdminLoginDto
    {
        [Required]
        public string UserName { get; set; } = default!;

        [Required]
        public string Password { get; set; } = default!;
        
    }
}