using Microsoft.EntityFrameworkCore;
using QuizApp.API.Models;

namespace QuizApp.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Result> Results { get; set; }
        public DbSet<Query> Queries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // 🔹 USER Constraints
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasDefaultValue("USER");

            modelBuilder.Entity<User>()
                .Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<User>()
                .Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<User>()
                .Property(u => u.Password)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .IsRequired()
                .HasMaxLength(20);

            // 🔹 QUIZ Constraints
            modelBuilder.Entity<Quiz>()
                .Property(q => q.QuizTitle)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Quiz>()
                .Property(q => q.TotalMarks)
                .IsRequired();

            // 🔹 QUESTION: One Quiz → Many Questions
            modelBuilder.Entity<Question>()
                .HasOne(q => q.Quiz)
                .WithMany(qz => qz.Questions)
                .HasForeignKey(q => q.QuizID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Question>()
                .Property(q => q.QuestionText)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Question>()
                .Property(q => q.Option1)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Question>()
                .Property(q => q.Option2)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Question>()
                .Property(q => q.Option3)
                .HasMaxLength(50);

            modelBuilder.Entity<Question>()
                .Property(q => q.Option4)
                .HasMaxLength(50);

            modelBuilder.Entity<Question>()
                .Property(q => q.Answer)
                .IsRequired()
                .HasMaxLength(50);

            // 🔹 RESULT: One Quiz → Many Results
            modelBuilder.Entity<Result>()
                .HasOne(r => r.Quiz)
                .WithMany(q => q.Results)
                .HasForeignKey(r => r.QuizID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Result>()
                .Property(r => r.UserName)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Result>()
                .Property(r => r.MarksObtained)
                .IsRequired();

            // 🔹 QUERY Constraints (no FK for Username, string only)
            modelBuilder.Entity<Query>()
                .Property(q => q.Username)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Query>()
                .Property(q => q.Title)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Query>()
            .Property(q => q.QueryText)
            .IsRequired()
            .HasMaxLength(2000);
        }

    }

}
