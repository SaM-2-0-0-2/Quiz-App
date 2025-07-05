
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { teacherAPI, adminAPI } from "../../services/api";
import toast from "react-hot-toast";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Table,
  Card,
  Spinner,
} from "react-bootstrap";
import { Plus, Edit, Trash2 } from "lucide-react";

const StudentManagement = ({ onUpdate }) => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const res = await adminAPI.getClasses();
      setClasses(res.data);
    } catch (err) {
      toast.error("Failed to fetch classes");
    }
  };

  const fetchStudents = async (classId) => {
    try {
      const res = await teacherAPI.getStudentsByClass(classId);
      setStudents(res.data);
    } catch (err) {
      toast.error("Failed to fetch students");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      fullName: data.fullName,
      motherName: data.motherName,
      rollNo: Number(data.rollNo),
      classId: selectedClass,
    };

    try {
      if (editingStudent) {
        await teacherAPI.updateStudent(editingStudent.id, payload);
        toast.success("Student updated successfully");
      } else {
        await teacherAPI.addStudent(payload);
        toast.success("Student added successfully");
      }
      fetchStudents(selectedClass);
      onUpdate();
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save student");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    reset({
      fullName: student.fullName,
      motherName: student.motherName,
      rollNo: student.rollNo,
    });
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this student?")) {
      try {
        await teacherAPI.deleteStudent(id);
        toast.success("Student deleted");
        fetchStudents(selectedClass);
        onUpdate();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    reset();
  };

  return (
    <div>
      <Row className="mb-4 align-items-center">
        <Col><h4>Student Management</h4></Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            disabled={!selectedClass}
          >
            <Plus size={16} className="me-2" />
            Add Student
          </Button>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Form.Select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </Form.Select>
        </Card.Body>
      </Card>

      {selectedClass && (
        <Card>
          <Card.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Full Name</th>
                  <th>Mother's Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu) => (
                  <tr key={stu.id}>
                    <td>{stu.rollNo}</td>
                    <td>{stu.fullName}</td>
                    <td>{stu.motherName || "-"}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(stu)}
                        className="me-2"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(stu.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingStudent ? "Edit Student" : "Add Student"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Roll Number</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter roll number"
                {...register("rollNo", { required: "Roll number is required" })}
              />
              {errors.rollNo && <small className="text-danger">{errors.rollNo.message}</small>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                {...register("fullName", { required: "Full name is required" })}
              />
              {errors.fullName && <small className="text-danger">{errors.fullName.message}</small>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mother's Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter mother's name"
                {...register("motherName")}
              />
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? <Spinner size="sm" animation="border" /> : editingStudent ? "Update" : "Add"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentManagement;
