// DTOs/UserResultDto.cs
namespace QuizApp.API.DTOs
{
    public class UserResultDto
    {
        public int ResultID { get; set; }
        public string UserName { get; set; }
        public string QuizName { get; set; }
        public int TotalMarks { get; set; }
        public int MarksObtained { get; set; }
    }
}