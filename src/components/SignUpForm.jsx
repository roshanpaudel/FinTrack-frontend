import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

export const SignUpForm = ({ handleSignUpSubmit }) => {
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordMatch, setPasswordMatch] = React.useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (name === "confirmPassword") {
      // Optionally, you can add validation for password match here
      if (value !== formData.password) {
        // Handle password mismatch (e.g., show an error message)
        setPasswordMatch(false);
      } else setPasswordMatch(true);
    }
  };
  return (
    <Form onSubmit={handleSignUpSubmit}>
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
        {console.log(
          "Password:",
          formData.password,
          "Confirm:",
          formData.confirmPassword,
          "Match:",
          passwordMatch
        )}
        {!passwordMatch && (
          <Form.Text className="text-danger">Passwords do not match.</Form.Text>
        )}
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100">
        Sign Up
      </Button>
    </Form>
  );
};
