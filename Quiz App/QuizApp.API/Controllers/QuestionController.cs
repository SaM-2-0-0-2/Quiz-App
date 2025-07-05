using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizApp.API.Data;
using QuizApp.API.Models;

namespace QuizApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuestionController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Question
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestions()
        {
            return await _context.Questions.ToListAsync();
        }

        // GET: api/Question/quiz/3
        [HttpGet("quiz/{quizId}")]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestionsByQuizId(int quizId)
        {
            var questions = await _context.Questions
                .Where(q => q.QuizID == quizId)
                .ToListAsync();

            if (!questions.Any())
                return NotFound("No questions found for the given quiz.");

            return questions;
        }


        // GET: api/Question/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Question>> GetQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);

            if (question == null)
            {
                return NotFound();
            }

            return question;
        }


        /*
        // PUT: api/Question/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuestion(int id, Question question)
        {
            if (id != question.QuesID)
            {
                return BadRequest();
            }

            _context.Entry(question).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionExists(id))
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
        
        // POST: api/Question
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Question>> PostQuestion(Question question)
        {
            if (!_context.Quizzes.Any(q => q.QuizID == question.QuizID))
                return BadRequest("Invalid Quiz ID.");

            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuestion", new { id = question.QuesID }, question);
        }
        */

        // DELETE: api/Question/quiz/3
        [HttpDelete("quiz/{quizId}")]
        public async Task<IActionResult> DeleteQuestionsByQuizId(int quizId)
        {
            var questions = await _context.Questions
                .Where(q => q.QuizID == quizId)
                .ToListAsync();


            if (!questions.Any())
            {
                return NotFound($"No questions found for quiz ID {quizId}.");
            }

            _context.Questions.RemoveRange(questions);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"{questions.Count} question(s) deleted for quiz ID {quizId}."
            });
        }


        // POST: api/Question/quiz/3
        [HttpPost("quiz/{quizId}")]
        public async Task<ActionResult> AddQuestionsByQuizId(int quizId, [FromBody] List<Question> questions)
        {
            // Ensure the quiz exists
            var quizExists = await _context.Quizzes.AnyAsync(q => q.QuizID == quizId);
            if (!quizExists)
                return BadRequest($"Quiz with ID {quizId} does not exist.");

            // Assign QuizID to all questions
            foreach (var question in questions)
            {
                question.QuizID = quizId;
            }

            // Add all questions at once
            await _context.Questions.AddRangeAsync(questions);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"{questions.Count} question(s) added to quiz ID {quizId}."
            });
        }

    }
}
