import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { teacherAPI } from "../../services/api";
import toast from "react-hot-toast";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  ProgressBar,
  InputGroup,
} from "react-bootstrap";
import {
  UserPlus,
  User,
  Lock,
  Phone,
  Shield,
  Mail,
  HelpCircle,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

const StudentRegister = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      console.log(data);
      const response = await axios.post("http://localhost:5034/api/user", {
        username: data.username,
        password: data.password,
        email: data.email

      });
      if (response.data.message === "Registration successful!") {
        toast.success("Registration successful! Please login.");
        
        // Optional: Save user data in context if needed
        // login(response.data);

        navigate("/Student/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const pwd = watch("password") || "";
    if (pwd.length < 4)
      return { strength: 0, label: "Very Weak", variant: "danger" };
    if (pwd.length < 6)
      return { strength: 25, label: "Weak", variant: "warning" };
    if (pwd.length < 8) return { strength: 50, label: "Fair", variant: "info" };
    if (pwd.length < 10)
      return { strength: 75, label: "Good", variant: "primary" };
    return { strength: 100, label: "Strong", variant: "success" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div
                    className="bg-success bg-gradient rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <UserPlus size={32} className="text-white" />
                  </div>
                  <h2 className="fw-bold text-success">User Registration</h2>
                  <p className="text-muted">
                    Create your account to get started
                  </p>
                </div>

                <Form onSubmit={handleSubmit(onSubmit)}>
                  {/* Username */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <User  size={16} className="me-2" />
                      Username
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
                      size="lg"
                      className="rounded-3"
                      {...register("username", { required: "Name is required" })}
                      isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Username */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <Mail size={16} className="me-2" />
                      Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      size="lg"
                      className="rounded-3"
                      {...register("email", {
                        required: "Email is required",
                      })}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <Lock size={16} className="me-2" />
                      Password
                    </Form.Label>
                    <InputGroup size="lg">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="rounded-start-3"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Minimum 6 characters required",
                          },
                        })}
                        isInvalid={!!errors.password}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="rounded-end-3"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {errors.password?.message}
                      </Form.Control.Feedback>
                    </InputGroup>

                    {/* Password Strength */}
                    {watch("password") && (
                      <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">
                            Password Strength
                          </small>
                          <small className={`text-${passwordStrength.variant}`}>
                            {passwordStrength.label}
                          </small>
                        </div>
                        <ProgressBar
                          now={passwordStrength.strength}
                          variant={passwordStrength.variant}
                          style={{ height: "4px" }}
                          className="rounded-pill"
                        />
                      </div>
                    )}
                  </Form.Group>

                  {/* Confirm Password */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <Lock size={16} className="me-2" />
                      Confirm Password
                    </Form.Label>
                    <InputGroup size="lg">
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        className="rounded-start-3"
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === password || "Passwords do not match",
                        })}
                        isInvalid={!!errors.confirmPassword}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="rounded-end-3"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword?.message}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-100 py-3 fw-semibold rounded-3 mb-3"
                    size="lg"
                    variant="success"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} className="me-2" />
                        Create Student Account
                      </>
                    )}
                  </Button>

                  {/* Back to login */}
                  <div className="text-center">
                    <Button
                      as={Link}
                      to="/teacher/login"
                      variant="outline-success"
                      className="w-100 py-2 rounded-3"
                    >
                      <ArrowLeft size={16} className="me-2" />
                      Back to Login
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentRegister;
