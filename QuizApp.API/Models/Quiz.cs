using System.ComponentModel.DataAnnotations;
namespace QuizApp.API.Models
{
    public class Quiz
    {
        [Key]
        public int QuizID { get; set; }

        [Required]
        [MaxLength(50)]
        public string QuizTitle { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int TotalMarks { get; set; }

        public ICollection<Question> Questions { get; set; } = new List<Question>();
        public ICollection<Result> Results { get; set; } = new List<Result>();
    }
}
