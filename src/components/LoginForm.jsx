import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { checkEmail, insertSignupData } from "../api/authApi.js";

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [emailAvailable, setEmailAvailable] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailToCheck = formData.email;
    const responseEmail = await checkEmail(emailToCheck);
    if (responseEmail.status === "error") {
      console.log("Error checking email:", responseEmail.message);
      return;
    } else {
      setEmailAvailable(responseEmail.available);
      console.log("Email check response:", responseEmail);
    }

    if (!responseEmail.available) {
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
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            autoComplete="username"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => setEmailAvailable(true)}
            required
          />
          {!emailAvailable && (
            <Form.Text className="text-danger">
              Email does not exists.
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            autoComplete="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>
      </Form>
    </Container>
  );
};
