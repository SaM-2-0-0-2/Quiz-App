using System.ComponentModel.DataAnnotations;
namespace QuizApp.API.Models
{
    public class User
    {
        [Key]
        public int UserID { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; }

        [Required]
        [MaxLength(50)]
        public string Email { get; set; }

        [Required]
        [MaxLength(60)]
        public string Password { get; set; }

        [Required]
        [MaxLength(20)]
        public string Role { get; set; } = "USER";
    }
}
