import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { createCombinedRevenue, updateCombinedRevenue } from "../../actions/CombinedRevenue.action";
import { months, years, getLastMonthAndYear } from "../../constants/MonthsAndYears";

const CombinedRevenueEntry = ({
  show,
  handleClose,
  combinedRevenue = null,
  createCombinedRevenue,
  updateCombinedRevenue,
}) => {
  const { month: defaultMonth, year: defaultYear } = getLastMonthAndYear();
  const [formData, setFormData] = useState({
    amount: "",
    month: defaultMonth,
    year: defaultYear,
    type: "",
    description: "",
    note: "",
  });

  useEffect(() => {
    if (combinedRevenue) {
      setFormData({
        amount: combinedRevenue.amount || "",
        month: combinedRevenue.month || defaultMonth,
        year: combinedRevenue.year || defaultYear,
        type: combinedRevenue.type || "",
        description: combinedRevenue.description || "",
        note: combinedRevenue.note || "",
      });
    } else {
      setFormData({
        amount: "",
        month: defaultMonth,
        year: defaultYear,
        type: "",
        description: "",
        note: "",
      });
    }
  }, [combinedRevenue, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "year" ? parseInt(value) || value : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      amount: parseFloat(formData.amount),
      year: parseInt(formData.year),
    };

    let success = false;
    if (combinedRevenue) {
      success = await updateCombinedRevenue(combinedRevenue.id, data);
    } else {
      success = await createCombinedRevenue(data);
    }

    if (success) {
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{combinedRevenue ? "Edit Combined Revenue" : "Add Combined Revenue"}</Modal.Title>
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
                <Form.Label>Type *</Form.Label>
                <Form.Control
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="Enter type"
                  required
                />
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
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
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
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
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
              {combinedRevenue ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default connect(null, {
  createCombinedRevenue,
  updateCombinedRevenue,
})(CombinedRevenueEntry);
