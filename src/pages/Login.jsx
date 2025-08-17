import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FinancialTips } from "../components/FinancialTips";
import { LoginForm } from "../components/LoginForm.jsx";

const Login = () => {
  return (
    <Container className="p-5">
      <Row className="bg-dark p-5 rounded">
        <Col md={7}>
          <FinancialTips />
        </Col>
        <Col md={5}>
          <LoginForm></LoginForm>
        </Col>
      </Row>
    </Container>
  );
};
export default Login;
