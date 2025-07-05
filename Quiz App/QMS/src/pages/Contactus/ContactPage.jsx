import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import toast from "react-hot-toast";


const ContactPage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    username: storedUser?.username || "",
    title: "",
    querytext: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5034/api/Query", formData);

      console.log(response.data); // For debugging

      if (response.data.message === "Query Submitted") {
        toast.success("Your query has been submitted successfully!");
        setFormData(prev => ({
          ...prev,
          title: "",
          querytext: ""
        }));
      }
      else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit query");
    }
  };

  return (
    <div className="bg-light">
      <Container
        className="py-5"
        style={{
          background:
            "linear-gradient(0deg,rgba(34, 193, 195, 1) 0%, rgba(253, 187, 45, 1) 100%)",
        }}
      >
        <h1 className="text-primary text-center mb-5">CONTACT US</h1>

        <Row className="g-4 align-items-center">
          {/* Form Column */}
          <Col lg={6} md={12}>
            <div className="bg-white p-4 p-md-5 rounded shadow-sm">
              <h2 className="text-danger mb-4">Get in Touch</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formusername">
                  <Form.Label>Your username*</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter your username"
                    readOnly
                  />
                </Form.Group>


                <Form.Group className="mb-3" controlId="formtitle">
                  <Form.Label>Title*</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter title"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formMessage">
                  <Form.Label>Your Query*</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="querytext"
                    value={formData.querytext}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Enter querytext"
                  />
                </Form.Group>

                <div className="text-end">
                  <Button variant="danger" type="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </div>
          </Col>

          <Col lg={6} md={12} className="text-center">
            <img
              src="/contact.jpeg"
              alt="Contact Illustration"
              className="img-fluid rounded shadow"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "450px",
                objectFit: "contain",
              }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactPage;
