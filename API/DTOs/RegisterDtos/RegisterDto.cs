using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required] public string Username { get; set; } = default!;
        [Required] public string Email { get; set; } = default!;
        [Required] public string City { get; set; } = default!;

        [Required]
        [StringLength(10, MinimumLength = 4, ErrorMessage = "You must specify password between 4 and 10 chars")]
        public string Password { get; set; } = default!;

    }
}