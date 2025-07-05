
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Table, Form, Spinner } from "react-bootstrap";
import { adminAPI } from "../../services/api";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

const ClassManagement = ({ onUpdate }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await adminAPI.getClasses();
      setClasses(response.data);
    } catch (error) {
      toast.error("Failed to fetch classes");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editingClass) {
        await adminAPI.updateClass(editingClass.id, data);
        toast.success("Class updated successfully");
      } else {
        await adminAPI.addClass(data);
        toast.success("Class added successfully");
      }
      fetchClasses();
      onUpdate();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    reset(classItem);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await adminAPI.deleteClass(id);
        toast.success("Class deleted successfully");
        fetchClasses();
        onUpdate();
      } catch (error) {
        toast.error("Failed to delete class");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClass(null);
    reset();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Class Management</h4>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={16} className="me-1" />
          Add Class
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Published</th>
            <th style={{ width: "120px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classItem) => (
            <tr key={classItem.id}>
              <td>{classItem.name}</td>
              <td>{classItem.published ? "Yes" : "No"}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEdit(classItem)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(classItem.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>{editingClass ? "Edit Class" : "Add New Class"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Class Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter class name"
                {...register("name", { required: "Class name is required" })}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Published"
                {...register("published")}
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
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  {" Saving..."}
                </>
              ) : editingClass ? (
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

export default ClassManagement;
