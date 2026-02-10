import React, { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row, Alert } from "react-bootstrap";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updatePayment } from "../../actions/Payment.action";
import { months, years } from "../../constants/MonthsAndYears";

const PaymentEditForm = ({ payment, updatePayment, selectedTenant }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: "",
    extra_amount: "",
    exam_fee: "",
    month: months[new Date().getMonth()],
    year: new Date().getFullYear(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (payment) {
      setFormData({
        amount: payment.amount?.toString() || "",
        extra_amount: payment.extra_amount?.toString() || "0",
        exam_fee: payment.exam_fee?.toString() || "0",
        month: payment.month || months[new Date().getMonth()],
        year: payment.year || new Date().getFullYear(),
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "year" ? parseInt(value) : value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.amount || parseFloat(formData.amount) < 0) {
      setError("Amount is required and must be greater than or equal to 0");
      return;
    }

    if (!formData.month) {
      setError("Month is required");
      return;
    }

    if (!formData.year) {
      setError("Year is required");
      return;
    }

    setSubmitting(true);

    const updateData = {
      amount: parseFloat(formData.amount),
      extra_amount: formData.extra_amount
        ? parseFloat(formData.extra_amount)
        : 0,
      exam_fee: formData.exam_fee ? parseFloat(formData.exam_fee) : 0,
      month: formData.month,
      year: formData.year,
      userId: payment.userId, // Keep existing userId
      tenant: selectedTenant || payment.tenant,
    };

    const success = await updatePayment(payment.id, updateData);

    setSubmitting(false);

    if (success) {
      navigate("/payments");
    }
  };

  const handleCancel = () => {
    navigate("/payments");
  };

  if (!payment) {
    return null;
  }

  // Get student info from meta or display userId
  const studentName =
    payment.meta?.studentName || `Student ID: ${payment.userId}`;
  const studentUid = payment.meta?.studentUid || "";
  const gradeName = payment.meta?.gradeName || "-";
  const shiftName = payment.meta?.shiftName || "-";
  const batchName = payment.meta?.batchName || "-";

  return (
    <Card className="shadow">
      <Card.Header>
        <h5 className="mb-0">Edit Payment</h5>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Read-only Display Fields */}
          <Row className="mb-3">
            <Col md={12}>
              <Card className="bg-light">
                <Card.Body>
                  <h6 className="mb-3">Payment Information (Read-only)</h6>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Student</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            studentUid
                              ? `${studentUid} - ${studentName}`
                              : studentName
                          }
                          readOnly
                          className="bg-white"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Note</Form.Label>
                        <Form.Control
                          type="text"
                          value={payment.note || "-"}
                          readOnly
                          className="bg-white"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Class</Form.Label>
                        <Form.Control
                          type="text"
                          value={gradeName}
                          readOnly
                          className="bg-white"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Shift</Form.Label>
                        <Form.Control
                          type="text"
                          value={shiftName}
                          readOnly
                          className="bg-white"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Batch</Form.Label>
                        <Form.Control
                          type="text"
                          value={batchName}
                          readOnly
                          className="bg-white"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Editable Fields */}
          <Row>
            <Col md={4}>
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
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Extra Amount</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="extra_amount"
                  value={formData.extra_amount}
                  onChange={handleChange}
                  min="0"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Exam Fee</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="exam_fee"
                  value={formData.exam_fee}
                  onChange={handleChange}
                  min="0"
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

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? "Updating..." : "Update Payment"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  selectedTenant: state.tenant?.selectedTenant,
});

export default connect(mapStateToProps, { updatePayment })(PaymentEditForm);
