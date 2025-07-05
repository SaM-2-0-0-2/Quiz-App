import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./QuizPage.css";

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  // ⏰ Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch quiz data
  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  const fetchQuizData = async () => {
    try {
      const [quizRes, questionsRes] = await Promise.all([
        axios.get(`http://localhost:5034/api/Quiz/${quizId}`),
        axios.get(`http://localhost:5034/api/Question/quiz/${quizId}`),
      ]);

      setQuizTitle(quizRes.data.quizTitle);

      // Format questions
      const formattedQuestions = questionsRes.data.map((q) => ({
        ...q,
        options: {
          a: q.option1 || "",
          b: q.option2 || "",
          c: q.option3 || "",
          d: q.option4 || "",
        },
      }));

      setQuestions(formattedQuestions);
    } catch (err) {
      console.error("Error fetching quiz or questions:", err);
      setError("Failed to load quiz or questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (quesID, optionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [quesID]: optionKey,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const unanswered = questions.filter(q => !answers[q.quesID]);
    if (unanswered.length > 0) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const submissionData = Object.entries(answers).map(([quesID, selectedOptionKey]) => {
      const question = questions.find(q => q.quesID === parseInt(quesID));
      const selectedOptionText = question.options[selectedOptionKey];

      return {
        QuesID: parseInt(quesID),
        SelectedOption: selectedOptionText, 
      };
    });

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userName = storedUser?.username || "student123";

    console.log("Submission Data:", submissionData);
    console.log("quizId:", quizId);

    navigate(`/student/quizTest/quizResult/${quizId}`, {
      state: {
        userAnswers: submissionData,
        userName: userName,
        quizID: quizId, 
      },
    });
  };




  const handleTimeUp = () => {
    console.log("Time's up! Auto-submitting...");
    handleSubmit(new Event("submit"));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading quiz...</p>
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
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{quizTitle}</h2>
        <h5 className="text-danger">⏳ Time Left: {formatTime(timeLeft)}</h5>
      </div>

      <Form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <Card key={question.quesID} className="mb-4 shadow-sm">
            <Card.Body>
              <Row>
                <Col xs={12} md={8}>
                  <h5>
                    Q{index + 1}. {question.questionText}
                  </h5>
                </Col>
                <Col xs={12} md={4} className="text-md-end">
                  <span className="badge bg-info text-dark">
                    {question.marks} Mark
                  </span>
                </Col>
              </Row>

              <Form.Group className="mt-3">
                {Object.entries(question.options).map(([key, value]) =>
                  value ? (
                    <Form.Check
                      key={`${question.quesID}-${key}`} // ✅ UNIQUE key for each option
                      type="radio"
                      label={value}
                      name={`question-${question.quesID}`} // ✅ UNIQUE name per question
                      id={`q${question.quesID}-${key}`}
                      checked={answers[question.quesID] === key}
                      onChange={() =>
                        handleOptionChange(question.quesID, key)

                      }
                      required
                    />
                  ) : null
                )}
              </Form.Group>

              <div className="text-end mt-2">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleClearSelection(question.quesID)}
                >
                  Clear Selection
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}

        <div className="text-center">
          <Button type="submit" variant="success" size="lg">
            Submit Quiz
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default QuizPage;