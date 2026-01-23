import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table, Button, Form, Card } from "react-bootstrap";
import { connect } from "react-redux";
import Layout from "../../components/shared/Layout/Layout";
import { getExpenses, deleteExpense } from "../../actions/Expense.action";
import ExpenseEntry from "../../components/ExpenseEntry/ExpenseEntry";
import { months, years } from "../../constants/MonthsAndYears";
import { FaEdit, FaTrash } from "react-icons/fa";

const ExpensePage = ({ expenses, getExpenses, deleteExpense, selectedTenant }) => {
  const [showEntry, setShowEntry] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [month, setMonth] = useState(months[new Date().getMonth()]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (selectedTenant) {
      loadExpenses();
    }
  }, [selectedTenant, month, year]);

  const loadExpenses = () => {
    const filters = {
      tenant: selectedTenant,
      month,
      year,
    };
    getExpenses(filters);
  };

  const handleAdd = () => {
    setEditingExpense(null);
    setShowEntry(true);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowEntry(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      const success = await deleteExpense(id);
      if (success) {
        loadExpenses();
      }
    }
  };

  const handleClose = () => {
    setShowEntry(false);
    setEditingExpense(null);
    loadExpenses();
  };

  const totalAmount = expenses?.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0) || 0;

  return (
    <Layout title="Expense Management">
      <Container>
        <Card bg="white" text="dark" className="shadow mb-4">
          <Card.Body>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Year</Form.Label>
                  <Form.Select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Month</Form.Label>
                  <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Button variant="primary" onClick={handleAdd}>
                  Add Expense
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card bg="white" text="dark" className="shadow">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Expenses</h5>
            <div className="fw-bold">Total: {totalAmount.toFixed(2)}</div>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses && expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>{expense.month} {expense.year}</td>
                      <td>{expense.category?.name || "N/A"}</td>
                      <td>{parseFloat(expense.amount || 0).toFixed(2)}</td>
                      <td>{expense.description || "-"}</td>
                      <td>{expense.note || "-"}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(expense)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(expense.id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No expenses found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <ExpenseEntry
          show={showEntry}
          handleClose={handleClose}
          expense={editingExpense}
          selectedTenant={selectedTenant}
        />
      </Container>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  expenses: state.expense?.expenses || [],
  selectedTenant: state.tenant?.selectedTenant,
});

export default connect(mapStateToProps, { getExpenses, deleteExpense })(ExpensePage);


