import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { createTransaction, fetchTransactions } from "../api/transactionApi";

const defaultFormState = {
  detail: "",
  amount: "",
  type: "debit",
  category: "General",
  transactionDate: "",
};

const creditCategories = [
  "Utilities",
  "Transportation",
  "Entertainment",
  "Groceries",
  "Health",
];

function Transactions() {
  const [formData, setFormData] = useState(defaultFormState);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadTransactions = async () => {
    setIsLoading(true);
    const response = await fetchTransactions();
    if (response?.status === "success") {
      setTransactions(response.transactions || []);
      setErrorMessage("");
    } else {
      setErrorMessage(response?.message || "Unable to load transactions.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      if (name === "type") {
        return {
          ...prev,
          type: value,
          category: value === "credit" ? creditCategories[0] : "General",
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const payload = {
      detail: formData.detail.trim(),
      amount: formData.amount,
      type: formData.type,
      category: formData.category.trim() || "General",
      transactionDate: formData.transactionDate || undefined,
    };

    const response = await createTransaction(payload);
    if (response?.status === "success") {
      setFormData(defaultFormState);
      setErrorMessage("");
      await loadTransactions();
    } else {
      setErrorMessage(response?.message || "Unable to save transaction.");
    }
    setIsSubmitting(false);
  };

  const summary = useMemo(() => {
    const totals = transactions.reduce(
      (acc, item) => {
        if (item.type === "credit") {
          acc.credit += item.amount || 0;
        } else {
          acc.debit += item.amount || 0;
        }
        return acc;
      },
      { credit: 0, debit: 0 }
    );
    return {
      credit: totals.credit,
      debit: totals.debit,
      balance: totals.credit - totals.debit,
    };
  }, [transactions]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(value || 0));

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold">Transactions</h1>
          <p className="text-muted mb-0">
            Track your spending and income in one place.
          </p>
        </Col>
      </Row>
      <Row className="g-4">
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Add Transaction</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="detail">
                  <Form.Label>Detail</Form.Label>
                  <Form.Control
                    type="text"
                    name="detail"
                    placeholder="Groceries, Salary, Rent..."
                    value={formData.detail}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="amount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="type">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="category">
                  <Form.Label>Category</Form.Label>
                  {formData.type === "credit" ? (
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      {creditCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Select>
                  ) : (
                    <Form.Control
                      type="text"
                      name="category"
                      value="General"
                      readOnly
                    />
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="transactionDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="transactionDate"
                    value={formData.transactionDate}
                    onChange={handleChange}
                  />
                </Form.Group>
                {errorMessage ? (
                  <div className="text-danger mb-3">{errorMessage}</div>
                ) : null}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Transaction"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body className="d-flex flex-wrap gap-3">
              <div>
                <div className="text-muted">Total Credit</div>
                <div className="fw-bold">{formatCurrency(summary.credit)}</div>
              </div>
              <div>
                <div className="text-muted">Total Debit</div>
                <div className="fw-bold">{formatCurrency(summary.debit)}</div>
              </div>
              <div>
                <div className="text-muted">Balance</div>
                <div className="fw-bold">{formatCurrency(summary.balance)}</div>
              </div>
            </Card.Body>
          </Card>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Recent Transactions</Card.Title>
              {isLoading ? (
                <div className="text-muted">Loading transactions...</div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Detail</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length ? (
                      transactions.map((item) => (
                        <tr key={item._id}>
                          <td>{item.detail}</td>
                          <td>{item.category || "General"}</td>
                          <td>
                            {item.transactionDate
                              ? new Date(item.transactionDate).toLocaleDateString()
                              : "-"}
                          </td>
                          <td>
                            <Badge bg={item.type === "credit" ? "success" : "danger"}>
                              {item.type}
                            </Badge>
                          </td>
                          <td className="text-end">
                            {formatCurrency(item.amount)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center text-muted py-4">
                          No transactions yet. Add your first one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Transactions;
