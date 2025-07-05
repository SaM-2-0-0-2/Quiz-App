import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import { GraduationCap, User, Lock, UserPlus } from "lucide-react";
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

const StudentLogin = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.redirectTo || "/student/dashboard";

  const BASE_URL = "http://localhost:5034/api"; // Adjust as per your backend port

 const onSubmit = async (data) => {
  setLoading(true);
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, data);

    if (response.data.message === "Login successful!") {
      toast.success("Login successful!");

      const userData = {
        id: response.data.userID,
        username: response.data.username,
        email: response.data.email || "student@example.com",
        token: response.data.token,
        role: response.data.role
      };

      localStorage.setItem("user", JSON.stringify(userData));
      login(userData);

      // Role-based redirection
      if (userData.role === "admin" || userData.role === "Admin" || userData.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }

      reset();
    } else {
      toast.error(response.data.message || "Login failed");
    }
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div
                    className="bg-success bg-gradient rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <GraduationCap size={32} className="text-white" />
                  </div>
                  <h2 className="fw-bold text-success">Login</h2>
                  <p className="text-muted">Sign in to continue</p>
                </div>

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <User size={16} className="me-2" />
                      Username
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
                      size="lg"
                      className="rounded-3"
                      {...register("username", {
                        required: "Username is required",
                      })}
                      isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <Lock size={16} className="me-2" />
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      size="lg"
                      className="rounded-3"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Remember me"
                      {...register("rememberMe")}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-100 py-3 fw-semibold rounded-3 mb-3"
                    size="lg"
                    variant="success"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <GraduationCap size={18} className="me-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center">
                  <Button
                    as={Link}
                    to="/Student/register"
                    variant="outline-success"
                    className="w-100 py-2 fw-semibold rounded-3"
                  >
                    <UserPlus size={16} className="me-2" />
                    Create New Account
                  </Button>
                </div>

                <Alert
                  variant="success"
                  className="mt-4 mb-0 bg-success bg-opacity-10 border-success"
                >
                  <small>
                    <strong>New Student?</strong>
                    <br />
                    Register above to get started with your Quiz.
                  </small>
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentLogin;
