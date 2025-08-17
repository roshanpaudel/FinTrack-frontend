import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Card, Button } from "react-bootstrap";

function SimpleBootstrapPage() {
  const [message, setMessage] = useState(
    "This is a simple card styled with React Bootstrap."
  );

  const handleClick = () => {
    setMessage("You clicked the button! Greetings from Japan.");
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "25rem" }}>
        <Card.Body className="text-center">
          <Card.Title as="h1">Welcome!</Card.Title>
          <Card.Text>{message}</Card.Text>
          <Button variant="primary" onClick={handleClick}>
            Click Me
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SimpleBootstrapPage;
