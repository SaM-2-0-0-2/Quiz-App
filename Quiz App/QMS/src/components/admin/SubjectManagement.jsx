
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Table, Form, Spinner } from "react-bootstrap";
import { adminAPI } from "../../services/api";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

const SubjectManagement = ({ onUpdate }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await adminAPI.getSubjects();
      setSubjects(response.data);
    } catch (error) {
      toast.error("Failed to fetch subjects");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Convert string to boolean explicitly if needed
      const preparedData = {
        ...data,
        isActive: data.isActive === "true" || data.isActive === true,
        maxMarks: parseInt(data.maxMarks),
      };

      if (editingSubject) {
        await adminAPI.updateSubject(editingSubject.id, preparedData);
        toast.success("Subject updated successfully");
      } else {
        await adminAPI.addSubject(preparedData);
        toast.success("Subject added successfully");
      }

      fetchSubjects();
      onUpdate();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    reset(subject);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await adminAPI.deleteSubject(id);
        toast.success("Subject deleted successfully");
        fetchSubjects();
        onUpdate();
      } catch (error) {
        toast.error("Failed to delete subject");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSubject(null);
    reset();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Subject Management</h4>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={16} className="me-2" />
          Add Subject
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Max Marks</th>
            <th>Active</th>
            <th style={{ width: "120px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.id}>
              <td>{subject.name}</td>
              <td>{subject.maxMarks}</td>
              <td>{subject.isActive ? "Yes" : "No"}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEdit(subject)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(subject.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>{editingSubject ? "Edit Subject" : "Add New Subject"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Subject Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subject name"
                {...register("name", { required: "Subject name is required" })}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Max Marks</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter max marks"
                {...register("maxMarks", {
                  required: "Max marks is required",
                  min: { value: 1, message: "Must be at least 1" },
                })}
                isInvalid={!!errors.maxMarks}
              />
              <Form.Control.Feedback type="invalid">
                {errors.maxMarks?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                {...register("isActive")}
                defaultChecked={editingSubject?.isActive ?? true}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  {" Saving..."}
                </>
              ) : editingSubject ? (
                "Update"
              ) : (
                "Add"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default SubjectManagement;
