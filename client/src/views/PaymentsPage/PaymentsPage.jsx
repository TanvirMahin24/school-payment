import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table, Button, ButtonGroup, Form, Card } from "react-bootstrap";
import { connect } from "react-redux";
import Layout from "../../components/shared/Layout/Layout";
import { getPayments } from "../../actions/Payment.action";
import { getGradeList } from "../../actions/Grade.action";
import { useNavigate } from "react-router-dom";
import { TENANT_LIST, DEFAULT_TENANT, getTenantLabel } from "../../constants/Tenant";

const PaymentsPage = ({ payments, getPayments, loading, grades, getGradeList }) => {
  const navigate = useNavigate();
  const [selectedTenant, setSelectedTenant] = useState(DEFAULT_TENANT);
  const [year, setYear] = useState(`${new Date().getFullYear()}`);
  const [grade, setGrade] = useState("");
  const [shift, setShift] = useState("");
  const [batch, setBatch] = useState("");

  // Fetch grades when tenant changes and clear payments
  useEffect(() => {
    getGradeList(selectedTenant);
    // Reset filters when tenant changes
    setGrade("");
    setShift("");
    setBatch("");
    // Clear payments when tenant changes (dispatch empty array)
    getPayments({ clear: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTenant]);

  const selectHandler = () => {
    const filters = {
      tenant: selectedTenant,
      ...(year && { year }),
      ...(grade && { gradeId: grade }),
      ...(shift && { shiftId: shift }),
      ...(batch && { batchId: batch }),
    };
    getPayments(filters);
  };

  // Get current grade's shifts and batches
  const currentGrade = grades?.find((g) => g.id === parseInt(grade));
  const currentShifts = currentGrade?.shifts || [];
  const currentShift = currentShifts.find((s) => s.id === parseInt(shift));
  const currentBatches = currentShift?.batches || [];

  return (
    <Layout title="Payments">
      <Container>
        <Row className="mb-3">
          <Col md={6}>
            <div className="d-flex align-items-center gap-3">
              <label className="mb-0 fw-bold">Tenant:</label>
              <ButtonGroup>
                {TENANT_LIST.map((tenant) => (
                  <Button
                    key={tenant.value}
                    variant={selectedTenant === tenant.value ? "primary" : "outline-primary"}
                    onClick={() => setSelectedTenant(tenant.value)}
                  >
                    {tenant.label}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          </Col>
          <Col md={6} className="text-end">
            <Button
              variant="primary"
              onClick={() => navigate("/payments/add")}
            >
              Add Payment
            </Button>
          </Col>
        </Row>

        <Card bg="white" text="dark" className="shadow mb-4">
          <Card.Body>
            <Row>
              <Col md={6} className="py-3">
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <label htmlFor="year" className="d-block">
                    Year
                  </label>
                </div>
                <Form.Select
                  onChange={(e) => setYear(e.target.value)}
                  id="year"
                  name="year"
                  value={year}
                >
                  <option value={""}>Select Year</option>
                  {Array.from({ length: 20 }, (_, i) => i + 2010)
                    .reverse()
                    .map((item, i) => (
                      <option key={i} value={`${item}`}>
                        {item}
                      </option>
                    ))}
                </Form.Select>
              </Col>
              <Col md={6} className="d-flex justify-content-end align-items-end py-3">
                <Button
                  onClick={selectHandler}
                  variant="primary"
                  type="submit"
                >
                  Select
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md={3} className="py-3">
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <label htmlFor="grade" className="d-block">
                    Class
                  </label>
                </div>
                <Form.Select
                  onChange={(e) => {
                    setBatch("");
                    setShift("");
                    setGrade(e.target.value);
                  }}
                >
                  <option value={""}>Select Class</option>
                  {grades &&
                    grades.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </Form.Select>
              </Col>
              {grade !== "" ? (
                <Col md={3} className="py-3">
                  <div className="d-flex justify-content-between align-items-center pb-2">
                    <label htmlFor="shift" className="d-block">
                      Shift
                    </label>
                  </div>
                  <Form.Select
                    onChange={(e) => {
                      setBatch("");
                      setShift(e.target.value);
                    }}
                  >
                    <option value={""}>Select Shift</option>
                    {currentShifts.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              ) : (
                <></>
              )}
              {grade !== "" && shift !== "" ? (
                <Col md={3} className="py-3">
                  <div className="d-flex justify-content-between align-items-center pb-2">
                    <label htmlFor="batch" className="d-block">
                      Batch
                    </label>
                  </div>
                  <Form.Select onChange={(e) => setBatch(e.target.value)}>
                    <option value={""}>Select Batch</option>
                    {currentBatches.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              ) : (
                <></>
              )}
            </Row>
          </Card.Body>
        </Card>

        <Row>
          <Col>
            {loading ? (
              <div className="text-center py-5">Loading...</div>
            ) : payments && payments.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Month</th>
                    <th>Tenant</th>
                    <th>Class</th>
                    <th>Shift</th>
                    <th>Batch</th>
                    <th>User</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.id}</td>
                      <td>{payment.amount}</td>
                      <td>{payment.month}</td>
                      <td>
                        {payment.tenant ? getTenantLabel(payment.tenant) : "-"}
                      </td>
                      <td>
                        {payment.gradePrimaryId
                          ? (() => {
                              const gradeObj = grades?.find((g) => g.id === payment.gradePrimaryId);
                              return gradeObj?.name || "-";
                            })()
                          : "-"}
                      </td>
                      <td>
                        {payment.shiftPrimaryId
                          ? (() => {
                              const gradeObj = grades?.find((g) => g.id === payment.gradePrimaryId);
                              const shiftObj = gradeObj?.shifts?.find((s) => s.id === payment.shiftPrimaryId);
                              return shiftObj?.name || "-";
                            })()
                          : "-"}
                      </td>
                      <td>
                        {payment.batchPrimaryId
                          ? (() => {
                              const gradeObj = grades?.find((g) => g.id === payment.gradePrimaryId);
                              const shiftObj = gradeObj?.shifts?.find((s) => s.id === payment.shiftPrimaryId);
                              const batchObj = shiftObj?.batches?.find((b) => b.id === payment.batchPrimaryId);
                              return batchObj?.name || "-";
                            })()
                          : "-"}
                      </td>
                      <td>
                        {payment.user ? payment.user.name : `User ${payment.userId}`}
                      </td>
                      <td>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/payments/${payment.id}/edit`)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            // Handle delete
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : payments === null || payments === undefined ? (
              <div className="text-center py-5">
                <p>Select filters and click "Select" to view payments.</p>
              </div>
            ) : (
              <div className="text-center py-5">
                <p>
                  No payments found. 
                  {(year || grade || shift || batch) && " Try adjusting your filters."}
                  {!year && !grade && !shift && !batch && " Select filters and click 'Select' to search for payments."}
                </p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  payments: state.payment.payments,
  loading: state.payment.loading,
  grades: state.grade.grade,
});

export default connect(mapStateToProps, { getPayments, getGradeList })(PaymentsPage);


