import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { checkEmail, insertSignupData } from "../api/authApi.js";

export const SignUpForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [emailExists, setEmailExists] = useState(false);
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
    const emailToCheck = formData.email;
    const responseEmail = await checkEmail(emailToCheck);
    if (responseEmail.status === "error") {
      console.log("Error checking email:", responseEmail.message);
      return;
    } else {
      setEmailExists(responseEmail.userExists);
      console.log("Email check response:", responseEmail);
    }

    if (
      !responseEmail.userExists &&
      formData.password === formData.confirmPassword
    ) {
      const { confirmPassword, ...dataToSend } = formData;
      // send data to API
      const responseSignup = await insertSignupData(dataToSend);
      console.log("Form submitted:", dataToSend);
      if (responseSignup.status === "error") {
        console.log("Error during signup:", responseSignup);
        return;
      }
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
            onFocus={() => setEmailExists(false)}
            required
          />
          {emailExists && (
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
