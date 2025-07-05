import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { adminAPI } from "../../services/api";
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
} from "react-bootstrap";
import { Shield, User, Lock } from "lucide-react";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  //const { login } = useAuth()
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      //const response = await adminAPI.login(data)
      //const userData = { ...response.data, role: "admin" }
      //login(userData)
      toast.success("Login successful!");
      navigate("/admin_create_quiz");
    } catch (error) {
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
                    className="bg-primary bg-gradient rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <Shield size={32} className="text-white" />
                  </div>
                  <h2 className="fw-bold text-primary">Admin Portal</h2>
                  <p className="text-muted">
                    Sign in to access admin dashboard
                  </p>
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

                  <Form.Group className="mb-4">
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
                      })}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="submit"
                    as={Link}
                    to="/admin/Dashboard"
                    disabled={loading}
                    className="w-100 py-3 fw-semibold rounded-3"
                    size="lg"
                    variant="primary"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <Shield size={18} className="me-2" />
                        Sign In to Admin Panel
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLogin;
