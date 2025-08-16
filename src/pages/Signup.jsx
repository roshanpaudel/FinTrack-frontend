import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FinancialTips } from "../components/FinancialTips";
import { SignUpForm } from "../components/SignUpForm";

const Signup = () => {
  return (
    <Container className="p-5">
      <Row className="bg-dark p-5 rounded">
        <Col md={7}>
          <FinancialTips />
        </Col>
        <Col md={5}>
          <SignUpForm></SignUpForm>
        </Col>
      </Row>
    </Container>
  );
};
export default Signup;
