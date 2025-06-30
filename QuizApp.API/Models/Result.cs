using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuizApp.API.Models
{
    public class Result
    {
        [Key]
        public int ResultID { get; set; }

        [Required]
        [MaxLength(50)]
        public string UserName { get; set; }

        [Required]
        public int QuizID { get; set; } 

        [ForeignKey("QuizID")]
        public Quiz Quiz { get; set; }

        [Required]
        public int MarksObtained { get; set; }

    }
}
