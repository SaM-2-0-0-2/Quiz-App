import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios";
import "./QuizList.css";

const QuizList = () => {
  const [quizList, setQuizList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5034/api/Quiz");
      setQuizList(response.data);
      console.log("Fetched quizzes:", response.data); // For debugging
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-list-bg d-flex align-items-center justify-content-center py-5">
      <Container>
        <h1 className="text-center quiz-heading mb-5">📚 Available Quizzes</h1>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row className="g-4">
            {quizList.length > 0 ? (
              quizList.map((quiz) => (
                <Col lg={6} md={12} key={quiz.quizID}>
                  <Card className="quiz-card h-100 shadow-lg border-0">
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <div>
                        <Card.Title className="fs-4 text-primary fw-bold">
                          {quiz.quizTitle || "Untitled Quiz"}
                        </Card.Title>
                        <Card.Text className="text-secondary">
                          Total Marks: {quiz.totalMarks}
                        </Card.Text>
                      </div>
                      <div className="text-end mt-3">
                        <Button
                          as={Link}
                          to={localStorage.getItem("user") ? `/student/quiz_start_page/${quiz.quizID}` : "/Student/login"}
                          state={
                            localStorage.getItem("user")
                              ? {}
                              : { redirectTo: `/student/quiz_start_page/${quiz.quizID}`, quizId: quiz.quizID }
                          }
                          variant="outline-success"
                          className="start-btn"
                        >
                          🚀 Start Quiz
                        </Button>
                    </div>
                  </Card.Body>
                </Card>
                </Col>
        ))
        ) : (
        <p className="text-center text-muted">No quizzes available.</p>
            )}
      </Row>
        )}

      <div className="text-center mt-5">
        <Button
          as={Link}
          to="/"
          variant="light"
          className="back-btn shadow-sm"
        >
          ⬅️ Back to Home
        </Button>
      </div>
    </Container>
    </div >
  );
};

export default QuizList;
