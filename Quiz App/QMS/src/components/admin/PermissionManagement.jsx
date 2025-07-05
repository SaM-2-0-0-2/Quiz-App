
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Modal, 
  Button, 
  Table, 
  Form, 
  Spinner, 
  Badge, 
  Alert,
  Container,
  Card
} from "react-bootstrap";
import { Plus, Check, Trash2, User, Book, Layers } from "lucide-react";
import { adminAPI } from "../../services/api";
import toast from "react-hot-toast";

const PermissionManagement = ({ onUpdate }) => {
  const [permissions, setPermissions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState({
    page: true,
    action: false
  });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(prev => ({ ...prev, page: true }));
      setError(null);
      
      const [permissionsRes, teachersRes, subjectsRes, classesRes] =
        await Promise.all([
          adminAPI.getPermissions(),
          adminAPI.getTeachers(),
          adminAPI.getSubjects(),
          adminAPI.getClasses(),
        ]);

     
      const transformedPermissions = permissionsRes.data.map(permission => ({
        ...permission,
        teacher: permission.teacher || permission.teacherEntity,
        subject: permission.subject || permission.subjectEntity,
        classEntity: permission.classEntity || permission.class
      }));

      setPermissions(transformedPermissions);
      setTeachers(teachersRes.data);
      setSubjects(subjectsRes.data);
      setClasses(classesRes.data);
    } catch (error) {
      setError("Failed to fetch permissions data");
      console.error("Fetch error:", error);
    } finally {
      setLoading(prev => ({ ...prev, page: false }));
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(prev => ({ ...prev, action: true }));
      await adminAPI.addPermission(data);
      toast.success("Permission assigned successfully");
      fetchData();
      onUpdate?.();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign permission");
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleConfirm = async (id) => {
    try {
      setLoading(prev => ({ ...prev, action: true }));
      await adminAPI.confirmPermission(id);
      toast.success("Permission confirmed");
      fetchData();
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to confirm permission");
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleRevoke = async (id) => {
    if (window.confirm("Are you sure you want to revoke this permission?")) {
      try {
        setLoading(prev => ({ ...prev, action: true }));
        await adminAPI.revokePermission(id);
        toast.success("Permission revoked");
        fetchData();
        onUpdate?.();
      } catch (error) {
        toast.error("Failed to revoke permission");
      } finally {
        setLoading(prev => ({ ...prev, action: false }));
      }
    }
  };

  const handleCloseModal = () => {
    reset();
    setShowModal(false);
  };

  const getStatusBadge = (permission) => {
    if (!permission.assigned) return <Badge bg="warning">Pending</Badge>;
    if (permission.confirmed) return <Badge bg="success">Confirmed</Badge>;
    return <Badge bg="primary">Assigned</Badge>;
  };

  if (loading.page) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
          <h4 className="mb-0">
            <User className="me-2" size={20} />
            Permission Management
          </h4>
          <Button 
            variant="primary" 
            onClick={() => setShowModal(true)}
            disabled={loading.action}
          >
            <Plus size={16} className="me-2" />
            Assign Permission
          </Button>
        </Card.Header>

        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Teacher</th>
                  <th>Subject</th>
                  <th>Class</th>
                  <th>Status</th>
                  <th style={{ width: "120px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {permissions.length > 0 ? (
                  permissions.map((permission) => (
                    <tr key={permission.id}>
                     
                     

                      <td>{permission.teacherName || "N/A"}</td>
                      <td>{permission.subjectName || "N/A"}</td>
                      <td>{permission.className || "N/A"}</td>

                     
                      
                      
                      <td>{getStatusBadge(permission)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          {!permission.confirmed && permission.assigned && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleConfirm(permission.id)}
                              disabled={loading.action}
                              title="Confirm"
                            >
                              <Check size={16} />
                            </Button>
                          )}
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRevoke(permission.id)}
                            disabled={loading.action}
                            title="Revoke"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No permissions found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Assign Permission Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <Plus className="me-2" size={20} />
            Assign New Permission
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>
                <User size={16} className="me-2" />
                Teacher
              </Form.Label>
              <Form.Select
                {...register("teacherId", { required: "Teacher is required" })}
                isInvalid={!!errors.teacherId}
                disabled={loading.action}
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.teacherId?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <Book size={16} className="me-2" />
                Subject
              </Form.Label>
              <Form.Select
                {...register("subjectId", { required: "Subject is required" })}
                isInvalid={!!errors.subjectId}
                disabled={loading.action}
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subjectName || subject.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.subjectId?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <Layers size={16} className="me-2" />
                Class
              </Form.Label>
              <Form.Select
                {...register("classId", { required: "Class is required" })}
                isInvalid={!!errors.classId}
                disabled={loading.action}
              >
                <option value="">Select Class</option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.className || classItem.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.classId?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={handleCloseModal}
              disabled={loading.action}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading.action}
            >
              {loading.action ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Assigning...
                </>
              ) : (
                "Assign Permission"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default PermissionManagement;
