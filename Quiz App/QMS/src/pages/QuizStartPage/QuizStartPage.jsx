import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import axios from "axios";
import "./QuizPage.css";
import { useNavigate, useParams } from "react-router-dom";

const QuizStartPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams(); // Extract quizID from URL

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`http://localhost:5034/api/Quiz/${id}`);
      setQuiz(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    navigate(`/student/quizTest/${id}`);
  };


  return (
    <div className="quiz-background d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" variant="light" />
                <p className="text-light">Loading Quiz...</p>
              </div>
            ) : error ? (
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            ) : (
              <Card className="quiz-card shadow-lg">
                <Card.Body>
                  <Card.Title className="text-center">
                    <h2 className="quiz-title">{quiz.quizTitle}</h2>
                  </Card.Title>
                  <div className="text-center mb-3">
                    <Badge bg="info" className="quiz-badge">
                      Total Marks: {quiz.totalMarks}
                    </Badge>
                  </div>
                  <div className="d-grid mt-4">
                    <Button
                      variant="success"
                      size="lg"
                      className="start-btn"
                      onClick={handleStartQuiz}
                    >
                      🚀 Start Quiz
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default QuizStartPage;
