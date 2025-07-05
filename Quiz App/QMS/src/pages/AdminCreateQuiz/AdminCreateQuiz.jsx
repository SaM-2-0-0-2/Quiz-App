import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import { Plus, Trash, Upload } from "lucide-react";

const AdminCreateQuiz = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isPublished, setIsPublished] = useState(false);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = parseInt(value);
    setQuestions(newQuestions);
  };

  const handlePublish = () => {
    if (!quizTitle || questions.length === 0) {
      alert("Please provide a title and at least one question.");
      return;
    }
    setIsPublished(true);
    alert("Quiz published successfully!");
    console.log({
      title: quizTitle,
      description,
      questions,
      published: true,
    });
  };

  return (
    <Container className="py-4">
      <Card className="shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-4 text-primary">Create New Quiz</h2>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Quiz Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter quiz title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter quiz description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <h4 className="text-success mb-3">Add Questions</h4>

            {questions.map((q, index) => (
              <Card key={index} className="mb-4">
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Question {index + 1}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter question"
                      value={q.question}
                      onChange={(e) =>
                        handleQuestionChange(index, e.target.value)
                      }
                    />
                  </Form.Group>

                  {q.options.map((opt, oIndex) => (
                    <InputGroup className="mb-2" key={oIndex}>
                      <InputGroup.Text>Option {oIndex + 1}</InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(index, oIndex, e.target.value)
                        }
                      />
                    </InputGroup>
                  ))}

                  <Form.Group className="mb-3">
                    <Form.Label>Select Correct Answer</Form.Label>
                    <Form.Select
                      value={q.correctAnswer}
                      onChange={(e) =>
                        handleCorrectAnswerChange(index, e.target.value)
                      }
                    >
                      {q.options.map((_, i) => (
                        <option value={i} key={i}>
                          Option {i + 1}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Button
                    variant="danger"
                    onClick={() => handleRemoveQuestion(index)}
                  >
                    <Trash size={16} className="me-2" />
                    Remove Question
                  </Button>
                </Card.Body>
              </Card>
            ))}

            <Button variant="outline-primary" onClick={handleAddQuestion}>
              <Plus size={16} className="me-2" />
              Add Question
            </Button>

            <div className="text-center mt-4">
              <Button
                variant="success"
                onClick={handlePublish}
                disabled={isPublished}
              >
                <Upload size={16} className="me-2" />
                {isPublished ? "Quiz Published" : "Publish Quiz"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminCreateQuiz;
