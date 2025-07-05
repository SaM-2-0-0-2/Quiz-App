using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizApp.API.Data;
using QuizApp.API.DTOs;
using QuizApp.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResultsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ResultsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Results
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Result>>> GetResults()
        {
            return await _context.Results.ToListAsync();
        }

        // GET: api/Results/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Result>> GetResult(int id)
        {
            var result = await _context.Results.FindAsync(id);

            if (result == null)
            {
                return NotFound();
            }

            return result;
        }

        /*
        // PUT: api/Results/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutResult(int id, Result result)
        {
            if (id != result.ResultID)
            {
                return BadRequest();
            }

            _context.Entry(result).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ResultExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        */

        // POST: api/Results
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Result>> PostResult(Result result)
        {
            _context.Results.Add(result);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetResult", new { id = result.ResultID }, result);
        }

        // DELETE: api/Results/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResult(int id)
        {
            var result = await _context.Results.FindAsync(id);
            if (result == null)
            {
                return NotFound();
            }

            _context.Results.Remove(result);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ResultExists(int id)
        {
            return _context.Results.Any(e => e.ResultID == id);
        }

        //Evaluation
        [HttpPost("evaluate")]
        public async Task<IActionResult> EvaluateQuiz([FromBody] QuizSubmissionDto submission)
        {
            var questions = await _context.Questions
                .Where(q => q.QuizID == submission.QuizID)
                .ToListAsync();

            int totalScore = 0;

            foreach (var answer in submission.Answers)
            {
                var correctQuestion = questions.FirstOrDefault(q => q.QuesID == answer.QuesID);
                if (correctQuestion != null &&
                    correctQuestion.Answer.Trim().Equals(answer.SelectedOption.Trim(), StringComparison.OrdinalIgnoreCase))
                {
                    totalScore++;
                }
            }

            var result = new Result
            {
                UserName = submission.UserName,
                QuizID = submission.QuizID,
                MarksObtained = totalScore
            };

            Console.WriteLine(result);
            _context.Results.Add(result);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Quiz evaluated successfully",
                Score = totalScore,
                Total = questions.Count
            });
        }

        // GET: api/Results/user/{username}
        [HttpGet("user/{username}")]
        public async Task<ActionResult<IEnumerable<UserResultDto>>> GetResultsByUsername(string username)
        {
            var userResults = await _context.Results
                .Where(r => r.UserName.ToLower() == username.ToLower())
                .ToListAsync(); // Fetch to memory first (client-side grouping)

            var latestResults = userResults
                .GroupBy(r => r.QuizID)
                .Select(g => g.OrderByDescending(r => r.ResultID).First()) // or by AttemptDate
                .ToList();

            var quizIds = latestResults.Select(r => r.QuizID).ToList();
            var quizzes = await _context.Quizzes
                .Where(q => quizIds.Contains(q.QuizID))
                .ToListAsync();

            var finalResults = latestResults
                .Join(
                    quizzes,
                    result => result.QuizID,
                    quiz => quiz.QuizID,
                    (result, quiz) => new UserResultDto
                    {
                        ResultID = result.ResultID,
                        UserName = result.UserName,
                        QuizName = quiz.QuizTitle,
                        TotalMarks = quiz.TotalMarks,
                        MarksObtained = result.MarksObtained
                    })
                .ToList();



            if (finalResults == null || !finalResults.Any())
            {
                return NotFound(new { Message = "No results found for this user." });
            }

            return Ok(finalResults);
        }


        // GET: api/Results/all-distinct
        [HttpGet("all-distinct")]
        public async Task<ActionResult<IEnumerable<UserResultDto>>> GetAllDistinctResults()
        {
            var allResults = await _context.Results
                .Include(r => r.Quiz) 
                .ToListAsync();

            var latestDistinctResults = allResults
                .GroupBy(r => new { r.UserName, r.QuizID }) 
                .Select(g => g.OrderByDescending(r => r.ResultID).First()) 
                .ToList();

            var formattedResults = latestDistinctResults
                .Select(r => new UserResultDto
                {
                    ResultID = r.ResultID,
                    UserName = r.UserName,
                    QuizName = r.Quiz.QuizTitle,
                    MarksObtained = r.MarksObtained,
                    TotalMarks = r.Quiz.TotalMarks
                })
                .ToList();

            return Ok(formattedResults);
        }

    }
}
