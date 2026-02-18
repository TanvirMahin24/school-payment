import React, { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { createExpense, updateExpense } from "../../actions/Expense.action";
import { getExpenseCategories } from "../../actions/Category.action";
import { months, years } from "../../constants/MonthsAndYears";

const ExpenseEntry = ({
  show,
  handleClose,
  expense = null,
  selectedTenant,
  createExpense,
  updateExpense,
  getExpenseCategories,
  expenseCategories,
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    month: months[new Date().getMonth()],
    year: new Date().getFullYear(),
    categoryId: "",
    description: "",
    note: "",
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount || "",
        month: expense.month || months[new Date().getMonth()],
        year: expense.year || new Date().getFullYear(),
        categoryId: expense.categoryId || "",
        description: expense.description || "",
        note: expense.note || "",
      });
    } else {
      setFormData({
        amount: "",
        month: months[new Date().getMonth()],
        year: new Date().getFullYear(),
        categoryId: "",
        description: "",
        note: "",
      });
    }
  }, [expense, show]);

  useEffect(() => {
    if (selectedTenant) {
      getExpenseCategories(selectedTenant);
    }
  }, [selectedTenant, getExpenseCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "year" || name === "categoryId" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      tenant: selectedTenant,
      amount: parseFloat(formData.amount),
    };

    let success = false;
    if (expense) {
      success = await updateExpense(expense.id, data);
    } else {
      success = await createExpense(data);
    }

    if (success) {
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{expense ? "Edit Expense" : "Add Expense"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Amount *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {expenseCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Year *</Form.Label>
                <Form.Select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Month *</Form.Label>
                <Form.Select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {expense ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  expenseCategories: state.category?.expenseCategories || [],
});

export default connect(mapStateToProps, {
  createExpense,
  updateExpense,
  getExpenseCategories,
})(ExpenseEntry);
