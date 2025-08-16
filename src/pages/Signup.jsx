import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FinancialTips } from "../components/FinancialTips";
import { SignUpForm } from "../components/SignUpForm";
import React from "react";

const handleSignUpSubmit = (e) => {
  e.preventDefault();
  // Handle sign up logic here
};

const Signup = () => {
  return (
    <Container className="p-5">
      <Row className="bg-dark p-5 rounded">
        <Col>
          <FinancialTips />
        </Col>
        <Col>
          <SignUpForm handleSignUpSubmit={handleSignUpSubmit} ></SignUpForm>
        </Col>
      </Row>
    </Container>
  );
};
export default Signup;
