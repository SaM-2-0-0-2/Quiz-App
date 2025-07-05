namespace QuizApp.API.DTOs
{
    public class QuizSubmissionDto
    {
        public string UserName { get; set; }
        public int QuizID { get; set; }
        public List<UserAnswerDto> Answers { get; set; }
    }
}
