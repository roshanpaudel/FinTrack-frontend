import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { checkEmail, loginUserCheck } from "../api/authApi.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [emailExists, setEmailExists] = useState(true);
  const [canLogin, setCanLogin] = useState(true);

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
      setEmailExists(responseEmail.userExists);
    }

    if (responseEmail.userExists) {
      const dataToSend = { email: formData.email, password: formData.password };
      console.log("Data send for Login:", dataToSend);
      // send data to API
      const responseLogin = await loginUserCheck(dataToSend);
      console.log("Login check:", responseLogin);
      if (responseLogin.status === "error") {
        console.log("Error during Login:", responseLogin);
        setCanLogin(false);
        return;
      }
      if (responseLogin.isMatch) {
        // store token and set auth header
        if (responseLogin.accessToken) {
          localStorage.setItem("accessToken", responseLogin.accessToken);
          axios.defaults.headers.common["Authorization"] = `Bearer ${responseLogin.accessToken}`;
        }
        navigate("/dashboard"); // navigate after successful login
        setCanLogin(true);
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
            onFocus={() => setEmailExists(true)}
            required
          />
          {!emailExists && (
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
          {!canLogin && (
            <Form.Text className="text-danger">
              Password doesn't match.
            </Form.Text>
          )}
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>
      </Form>
    </Container>
  );
};
