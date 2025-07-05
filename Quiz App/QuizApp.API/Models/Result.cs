using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization; // <-- make sure this is added

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

        [ValidateNever]
        [ForeignKey("QuizID")]
        public Quiz Quiz { get; set; }

        [Required]
        public int MarksObtained { get; set; }
    }
}
