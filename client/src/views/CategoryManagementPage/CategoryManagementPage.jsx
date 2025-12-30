import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table, Button, Form, Card, Tabs, Tab } from "react-bootstrap";
import { connect } from "react-redux";
import Layout from "../../components/shared/Layout/Layout";
import {
  getExpenseCategories,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
  getRevenueCategories,
  createRevenueCategory,
  updateRevenueCategory,
  deleteRevenueCategory,
} from "../../actions/Category.action";
import { FaEdit, FaTrash } from "react-icons/fa";

const CategoryManagementPage = ({
  expenseCategories,
  revenueCategories,
  selectedTenant,
  getExpenseCategories,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
  getRevenueCategories,
  createRevenueCategory,
  updateRevenueCategory,
  deleteRevenueCategory,
}) => {
  const [activeTab, setActiveTab] = useState("expense");
  const [editingExpenseCategory, setEditingExpenseCategory] = useState(null);
  const [editingRevenueCategory, setEditingRevenueCategory] = useState(null);
  const [expenseFormData, setExpenseFormData] = useState({ name: "", description: "" });
  const [revenueFormData, setRevenueFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    if (selectedTenant) {
      loadCategories();
    }
  }, [selectedTenant]);

  const loadCategories = () => {
    getExpenseCategories(selectedTenant);
    getRevenueCategories(selectedTenant);
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...expenseFormData,
      tenant: selectedTenant,
    };

    let success = false;
    if (editingExpenseCategory) {
      success = await updateExpenseCategory(editingExpenseCategory.id, data);
    } else {
      success = await createExpenseCategory(data);
    }

    if (success) {
      setExpenseFormData({ name: "", description: "" });
      setEditingExpenseCategory(null);
      loadCategories();
    }
  };

  const handleRevenueSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...revenueFormData,
      tenant: selectedTenant,
    };

    let success = false;
    if (editingRevenueCategory) {
      success = await updateRevenueCategory(editingRevenueCategory.id, data);
    } else {
      success = await createRevenueCategory(data);
    }

    if (success) {
      setRevenueFormData({ name: "", description: "" });
      setEditingRevenueCategory(null);
      loadCategories();
    }
  };

  const handleEditExpenseCategory = (category) => {
    setEditingExpenseCategory(category);
    setExpenseFormData({
      name: category.name,
      description: category.description || "",
    });
  };

  const handleEditRevenueCategory = (category) => {
    setEditingRevenueCategory(category);
    setRevenueFormData({
      name: category.name,
      description: category.description || "",
    });
  };

  const handleDeleteExpenseCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const success = await deleteExpenseCategory(id);
      if (success) {
        loadCategories();
      }
    }
  };

  const handleDeleteRevenueCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const success = await deleteRevenueCategory(id);
      if (success) {
        loadCategories();
      }
    }
  };

  const handleCancel = () => {
    setEditingExpenseCategory(null);
    setEditingRevenueCategory(null);
    setExpenseFormData({ name: "", description: "" });
    setRevenueFormData({ name: "", description: "" });
  };

  return (
    <Layout title="Category Management">
      <Container>
        <Card bg="white" text="dark" className="shadow">
          <Card.Body>
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
              <Tab eventKey="expense" title="Expense Categories">
                <Row className="mb-4">
                  <Col md={12}>
                    <Card>
                      <Card.Header>
                        <h5 className="mb-0">
                          {editingExpenseCategory ? "Edit" : "Add"} Expense Category
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <Form onSubmit={handleExpenseSubmit}>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Name *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="name"
                                  value={expenseFormData.name}
                                  onChange={(e) =>
                                    setExpenseFormData({
                                      ...expenseFormData,
                                      name: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="description"
                                  value={expenseFormData.description}
                                  onChange={(e) =>
                                    setExpenseFormData({
                                      ...expenseFormData,
                                      description: e.target.value,
                                    })
                                  }
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <div className="d-flex gap-2">
                            <Button variant="primary" type="submit">
                              {editingExpenseCategory ? "Update" : "Create"}
                            </Button>
                            {editingExpenseCategory && (
                              <Button variant="secondary" onClick={handleCancel}>
                                Cancel
                              </Button>
                            )}
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseCategories && expenseCategories.length > 0 ? (
                      expenseCategories.map((category) => (
                        <tr key={category.id}>
                          <td>{category.name}</td>
                          <td>{category.description || "-"}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditExpenseCategory(category)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteExpenseCategory(category.id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No expense categories found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Tab>
              <Tab eventKey="revenue" title="Revenue Categories">
                <Row className="mb-4">
                  <Col md={12}>
                    <Card>
                      <Card.Header>
                        <h5 className="mb-0">
                          {editingRevenueCategory ? "Edit" : "Add"} Revenue Category
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <Form onSubmit={handleRevenueSubmit}>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Name *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="name"
                                  value={revenueFormData.name}
                                  onChange={(e) =>
                                    setRevenueFormData({
                                      ...revenueFormData,
                                      name: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="description"
                                  value={revenueFormData.description}
                                  onChange={(e) =>
                                    setRevenueFormData({
                                      ...revenueFormData,
                                      description: e.target.value,
                                    })
                                  }
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <div className="d-flex gap-2">
                            <Button variant="primary" type="submit">
                              {editingRevenueCategory ? "Update" : "Create"}
                            </Button>
                            {editingRevenueCategory && (
                              <Button variant="secondary" onClick={handleCancel}>
                                Cancel
                              </Button>
                            )}
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueCategories && revenueCategories.length > 0 ? (
                      revenueCategories.map((category) => (
                        <tr key={category.id}>
                          <td>{category.name}</td>
                          <td>{category.description || "-"}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditRevenueCategory(category)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteRevenueCategory(category.id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No revenue categories found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  expenseCategories: state.category?.expenseCategories || [],
  revenueCategories: state.category?.revenueCategories || [],
  selectedTenant: state.tenant?.selectedTenant,
});

export default connect(mapStateToProps, {
  getExpenseCategories,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
  getRevenueCategories,
  createRevenueCategory,
  updateRevenueCategory,
  deleteRevenueCategory,
})(CategoryManagementPage);




