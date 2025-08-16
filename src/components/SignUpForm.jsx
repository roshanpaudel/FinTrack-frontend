import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { checkEmail } from "../api/authApi.js";

export const SignUpForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setPasswordMatch(false);
      } else setPasswordMatch(true);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("event submitted:", e);
    const emailToCheck = formData.email;
    const response = await checkEmail(emailToCheck);
    setEmailAvailable(response.available);
    console.log("Email check response:", response);

    if (response.available && formData.password === formData.confirmPassword) {
      const { confirmPassword, ...dataToSend } = formData;
      // send data to API
      console.log("Form submitted:", dataToSend);

      return;
    }
  };

  return (
    <Container className="signup-form rounded p-5 ">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formFullName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            autoComplete="username"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {!emailAvailable && (
            <Form.Text className="text-danger">
              Email already exists. Please login or use a different email.
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          {!passwordMatch && (
            <Form.Text className="text-danger">
              Passwords do not match.
            </Form.Text>
          )}
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Sign Up
        </Button>
      </Form>
    </Container>
  );
};
