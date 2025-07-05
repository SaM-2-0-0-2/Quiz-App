import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Navbar,
  Nav,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "./CreateQuiz.css";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [quizName, setQuizName] = useState("");
  const [numQuestions, setNumQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [quizId, setQuizId] = useState(null);

  const addQuestion = () => {
    if (questions.length < parseInt(numQuestions)) {
      setQuestions([
        ...questions,
        { text: "", options: ["", "", "", ""], rightAnswer: "" },
      ]);
    }
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].text = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleRightAnswerChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].rightAnswer = value;
    setQuestions(updated);
  };

  const handleCreateQuiz = async () => {
    if (!quizName.trim() || parseInt(numQuestions) <= 0) {
      alert("Please enter a valid quiz name and number of questions.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5034/api/Quiz", {
        quizTitle: quizName.trim(),       
        totalMarks: parseInt(numQuestions) 
      });


      const newQuizId = response.data.quizID;
      setQuizId(newQuizId);
      setShowQuestions(true);
    } catch (error) {
      console.error("Error creating quiz:", error.response?.data || error);
      alert("Failed to create quiz.");
    }
  };

  const handleSubmitQuestions = async () => {
    if (!quizId) return alert("Quiz ID missing!");

    const formatted = questions.map((q) => ({
      questionText: q.text,
      option1: q.options[0] || "",
      option2: q.options[1] || "",
      option3: q.options[2] || "",
      option4: q.options[3] || "",
      answer: q.rightAnswer,
    }));

    try {
      await axios.post(
        `http://localhost:5034/api/Question/quiz/${quizId}`,
        formatted,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Questions submitted successfully!");
      navigate("/admin/quizlist");
    } catch (error) {
      console.error("Error submitting questions:", error.response?.data || error.message);
      alert("Failed to submit questions.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow sticky-top">
        <Container>
          <Navbar.Brand style={{ cursor: "pointer" }} onClick={() => navigate("/admin/Dashboard")}>
            Admin Portal
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate("/admin/resultList")}>Results</Nav.Link>
              <Nav.Link onClick={() => navigate("/admin/quizlist")}>Quizzes</Nav.Link>
              <Nav.Link onClick={() => navigate("/admin/Dashboard")}>Dashboard</Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <div className="quiz-page-background">
        <Container>
          <h2 className="text-center page-title">Create a New Quiz</h2>

          <Card className="mb-4 quiz-card shadow">
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Quiz Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={quizName}
                        onChange={(e) => setQuizName(e.target.value)}
                        placeholder="Enter quiz name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Number of Questions</Form.Label>
                      <Form.Control
                        type="number"
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(e.target.value)}
                        min={1}
                        placeholder="Enter total questions"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="text-center mt-3">
                  <Button
                    variant="primary"
                    onClick={handleCreateQuiz}
                    disabled={showQuestions}
                  >
                    Create Quiz
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Questions Form */}
          {showQuestions && (
            <>
              {questions.map((q, index) => (
                <Card className="mb-3 shadow-sm" key={index}>
                  <Card.Body>
                    <h5>Question {index + 1}</h5>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        value={q.text}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                        placeholder="Enter question text"
                      />
                    </Form.Group>

                    {q.options.map((opt, i) => (
                      <Form.Group className="mb-2" key={i}>
                        <Form.Control
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(index, i, e.target.value)}
                          placeholder={`Option ${i + 1}${i > 1 ? " (optional)" : ""}`}
                        />
                      </Form.Group>
                    ))}

                    <Form.Group>
                      <Form.Label>Right Answer</Form.Label>
                      <Form.Select
                        value={q.rightAnswer}
                        onChange={(e) => handleRightAnswerChange(index, e.target.value)}
                      >
                        <option value="">Select correct answer</option>
                        {q.options
                          .filter((opt) => opt.trim() !== "")
                          .map((opt, i) => (
                            <option key={i} value={opt}>
                              Option {i + 1}: {opt}
                            </option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                  </Card.Body>
                </Card>
              ))}

              {/* Add / Submit Buttons */}
              {questions.length < parseInt(numQuestions) && (
                <div className="text-center mb-4">
                  <Button variant="success" onClick={addQuestion}>
                    Add Question
                  </Button>
                </div>
              )}

              {questions.length === parseInt(numQuestions) && (
                <div className="text-center mb-4">
                  <Button variant="primary" onClick={handleSubmitQuestions}>
                    Submit All Questions
                  </Button>
                </div>
              )}
            </>
          )}
        </Container>
      </div>

      {/* Footer */}
      <footer className="footer-custom text-center py-3">
        Copyright &copy; QuizApp @2025
      </footer>
    </>
  );
};

export default CreateQuiz;
