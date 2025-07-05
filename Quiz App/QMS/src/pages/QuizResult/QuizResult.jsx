import React, { useEffect, useState } from "react";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./QuizResult.css";

const QuizResult = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [quizTitle, setQuizTitle] = useState("");
  const [totalMarks, setTotalMarks] = useState(0);
  const [scoredMarks, setScoredMarks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { userAnswers, userName, quizID } = location.state || {};

  useEffect(() => {
    if (!userAnswers || !userName || !quizID) {
      setError("Missing submission data. Please complete the quiz first.");
      setLoading(false);
      return;
    }

    evaluateQuiz();
  }, []);

  const evaluateQuiz = async () => {
    try {
      const payload = {
        UserName: userName,
        QuizID: parseInt(quizID),
        Answers: userAnswers.map((ans) => ({
          QuesID: parseInt(ans.QuesID),
          SelectedOption: ans.SelectedOption,
        })),
      };

      console.log("Evaluating Quiz, Payload:", payload);

      const res = await axios.post("http://localhost:5034/api/Results/evaluate", payload);

      setQuizTitle(`Quiz ID: ${quizID}`);
      setTotalMarks(res.data.total);
      setScoredMarks(res.data.score);

      console.log("Evaluation Result:", res.data);

      // After successful evaluation, store result in DB
      await saveResultToDB(userName, quizID, res.data.score);

    } catch (err) {
      console.error("Error evaluating quiz:", err);
      setError("Failed to evaluate quiz result.");
    } finally {
      setLoading(false);
    }
  };

  const saveResultToDB = async (userName, quizID, marksObtained) => {
    try {
      const resultPayload = {
        UserName: userName,
        QuizID: parseInt(quizID),
        MarksObtained: marksObtained,
      };

      console.log("Saving result to DB:", resultPayload);

      const res = await axios.post("http://localhost:5034/api/Results", resultPayload);

      console.log("Result stored in DB:", res.data);
    } catch (err) {
      console.error("Error saving result to DB:", err);
    }
  };

  const handleHome = () => {
    navigate("/student/dashboard");
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="info" />
        <p className="text-muted">Calculating result...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-5 text-center">
        {error}
      </Alert>
    );
  }

  return (
    <div className="result-bg d-flex align-items-center">
      <Container className="text-center">
        <h2 className="mb-4 result-heading">🎉 Quiz Result 🎉</h2>

        <Card className="result-card shadow-lg mx-auto p-4">
          <h4 className="quiz-title mb-3">{quizTitle}</h4>
          <p className="text-muted">You have secured:</p>

          <Card className="score-box mb-3 bg-white border-0">
            <h5 className="score-text">
              {scoredMarks} / {totalMarks} Marks
            </h5>
          </Card>

          <Button variant="info" className="home-btn" onClick={handleHome}>
            ⬅️ Home
          </Button>
        </Card>
      </Container>
    </div>
  );
};

export default QuizResult;
