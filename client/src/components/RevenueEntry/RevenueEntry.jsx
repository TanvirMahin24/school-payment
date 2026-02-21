import React, { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { createRevenue, updateRevenue } from "../../actions/Revenue.action";
import { getRevenueCategories } from "../../actions/Category.action";
import { months, years, getLastMonthAndYear } from "../../constants/MonthsAndYears";

const RevenueEntry = ({
  show,
  handleClose,
  revenue = null,
  selectedTenant,
  createRevenue,
  updateRevenue,
  getRevenueCategories,
  revenueCategories,
}) => {
  const { month: defaultMonth, year: defaultYear } = getLastMonthAndYear();
  const [formData, setFormData] = useState({
    amount: "",
    month: defaultMonth,
    year: defaultYear,
    categoryId: "",
    description: "",
    note: "",
  });

  useEffect(() => {
    if (revenue) {
      setFormData({
        amount: revenue.amount || "",
        month: revenue.month || defaultMonth,
        year: revenue.year || defaultYear,
        categoryId: revenue.categoryId || "",
        description: revenue.description || "",
        note: revenue.note || "",
      });
    } else {
      setFormData({
        amount: "",
        month: defaultMonth,
        year: defaultYear,
        categoryId: "",
        description: "",
        note: "",
      });
    }
  }, [revenue, show]);

  useEffect(() => {
    if (selectedTenant) {
      getRevenueCategories(selectedTenant);
    }
  }, [selectedTenant, getRevenueCategories]);

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
    if (revenue) {
      success = await updateRevenue(revenue.id, data);
    } else {
      success = await createRevenue(data);
    }

    if (success) {
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{revenue ? "Edit Revenue" : "Add Revenue"}</Modal.Title>
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
                  {revenueCategories.map((cat) => (
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
              {revenue ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  revenueCategories: state.category?.revenueCategories || [],
});

export default connect(mapStateToProps, {
  createRevenue,
  updateRevenue,
  getRevenueCategories,
})(RevenueEntry);
