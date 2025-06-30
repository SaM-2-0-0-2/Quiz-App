using System.ComponentModel.DataAnnotations;

namespace QuizApp.API.Models
{
    public class Query
    {
        [Key]
        public int QueryID { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; }

        [Required]
        [MaxLength(50)]
        public string Title { get; set; }

        [Required]
        public string QueryText { get; set; }
    }
}
