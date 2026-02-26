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
import { useTransactions } from "../context/TransactionsContext";

const defaultFormState = {
  detail: "",
  amount: "",
  type: "debit",
  category: "General",
  transactionDate: "",
};

function Transactions() {
  const [formData, setFormData] = useState(defaultFormState);
  const [editingTransactionId, setEditingTransactionId] = useState("");
  const [categoryEdit, setCategoryEdit] = useState({
    oldCategory: "",
    newCategory: "",
  });
  const {
    transactions,
    isLoading,
    isSubmitting,
    errorMessage,
    hasLoaded,
    loadTransactions,
    addTransaction,
    editTransaction,
    reassignTransactionCategory,
  } = useTransactions();

  useEffect(() => {
    if (!hasLoaded) {
      loadTransactions();
    }
  }, [hasLoaded, loadTransactions]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(defaultFormState);
    setEditingTransactionId("");
  };

  const handleEditClick = (transaction) => {
    setEditingTransactionId(transaction._id);
    setFormData({
      detail: transaction.detail || "",
      amount: String(transaction.amount || ""),
      type: transaction.type || "debit",
      category: transaction.category || "General",
      transactionDate: transaction.transactionDate
        ? new Date(transaction.transactionDate).toISOString().slice(0, 10)
        : "",
    });
  };

  const handleCategoryEditChange = (event) => {
    const { name, value } = event.target;
    setCategoryEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      detail: formData.detail.trim(),
      amount: formData.amount,
      type: formData.type,
      category: formData.category.trim() || "General",
      transactionDate: formData.transactionDate || undefined,
    };

    const response = editingTransactionId
      ? await editTransaction(editingTransactionId, payload)
      : await addTransaction(payload);

    if (response?.status === "success") {
      resetForm();
    }
  };

  const handleCategoryReassign = async (event) => {
    event.preventDefault();
    const payload = {
      oldCategory: categoryEdit.oldCategory.trim(),
      newCategory: categoryEdit.newCategory.trim(),
    };

    const response = await reassignTransactionCategory(payload);
    if (response?.status === "success") {
      setCategoryEdit({ oldCategory: "", newCategory: "" });
      if (
        editingTransactionId &&
        formData.category.trim() === payload.oldCategory
      ) {
        setFormData((prev) => ({ ...prev, category: payload.newCategory }));
      }
    }
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

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        transactions.map((item) => (item.category || "General").trim() || "General")
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [transactions]);

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
              <Card.Title className="mb-3">
                {editingTransactionId ? "Edit Transaction" : "Add Transaction"}
              </Card.Title>
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
                  <Form.Control
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    list="categories-list"
                    placeholder="e.g. Groceries, Rent, Salary"
                    required
                  />
                  <datalist id="categories-list">
                    {categories.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
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
                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingTransactionId
                        ? "Update Transaction"
                        : "Save Transaction"}
                  </Button>
                  {editingTransactionId ? (
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={resetForm}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </Form>
            </Card.Body>
          </Card>
          <Card className="shadow-sm mt-4">
            <Card.Body>
              <Card.Title className="mb-3">Manage Categories</Card.Title>
              <Form onSubmit={handleCategoryReassign}>
                <Form.Group className="mb-3" controlId="oldCategory">
                  <Form.Label>Category to Reassign</Form.Label>
                  <Form.Select
                    name="oldCategory"
                    value={categoryEdit.oldCategory}
                    onChange={handleCategoryEditChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="newCategory">
                  <Form.Label>New Category Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="newCategory"
                    value={categoryEdit.newCategory}
                    onChange={handleCategoryEditChange}
                    placeholder="Type the new category name"
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="secondary" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Rename & Reassign"}
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
                      <th className="text-end">Actions</th>
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
                          <td className="text-end">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditClick(item)}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-4">
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
