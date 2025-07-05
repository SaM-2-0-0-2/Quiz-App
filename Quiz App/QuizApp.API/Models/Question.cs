using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuizApp.API.Models
{
    public class Question
    {
        [Key]
        public int QuesID { get; set; }

        [Required]
        [MaxLength(200)]
        public string QuestionText { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Option1 { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Required]
        [MaxLength(200)]
        public string Option2 { get; set; }

        [MaxLength(200)]
        public string Option3 { get; set; }

        [MaxLength(200)]
        public string Option4 { get; set; }

        [Required]
        [MaxLength(200)]
        public string Answer { get; set; }

        [Required]
        public int QuizID { get; set; }

        [ValidateNever]
        [ForeignKey("QuizID")]
        public Quiz Quiz { get; set; } // EF infers FK automatically
    }
}
