import React, { useEffect, useState, useMemo } from "react";
import {
  Col,
  Container,
  Row,
  Table,
  Button,
  ButtonGroup,
  Form,
  Card,
} from "react-bootstrap";
import { connect } from "react-redux";
import Layout from "../../components/shared/Layout/Layout";
import ConfirmModal from "../../components/shared/ConfirmModal/ConfirmModal";
import { getPayments, deletePayment } from "../../actions/Payment.action";
import { getGradeList } from "../../actions/Grade.action";
import { useNavigate } from "react-router-dom";
import {
  TENANT_LIST,
  DEFAULT_TENANT,
  getTenantLabel,
} from "../../constants/Tenant";
import { months } from "../../constants/MonthsAndYears";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const PaymentsPage = ({
  payments,
  getPayments,
  deletePayment,
  loading,
  grades,
  getGradeList,
  selectedTenant,
}) => {
  const navigate = useNavigate();
  const [year, setYear] = useState(`${new Date().getFullYear()}`);
  const [month, setMonth] = useState("");
  const [grade, setGrade] = useState("");
  const [shift, setShift] = useState("");
  const [batch, setBatch] = useState("");
  const [sortColumn, setSortColumn] = useState("roll");
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' or 'desc'
  const [paymentToDelete, setPaymentToDelete] = useState(null);

  // Fetch grades when tenant changes and clear payments
  useEffect(() => {
    getGradeList(selectedTenant);
    // Reset filters when tenant changes
    setGrade("");
    setShift("");
    setBatch("");
    setMonth("");
    // Clear payments when tenant changes (dispatch empty array)
    getPayments({ clear: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTenant]);

  const handleDeleteClick = (payment) => setPaymentToDelete(payment);
  const handleDeleteClose = () => setPaymentToDelete(null);
  const handleDeleteConfirm = () => {
    if (paymentToDelete) deletePayment(paymentToDelete.id);
  };

  const selectHandler = () => {
    const filters = {
      tenant: selectedTenant,
      ...(year && { year }),
      ...(month && { month }),
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

  // Handle column sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new column and default to ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Get sort icon for column header
  const getSortIcon = (column) => {
    if (sortColumn !== column) {
      return <FaSort className="ms-1" style={{ opacity: 0.3 }} />;
    }
    return sortDirection === "asc" ? (
      <FaSortUp className="ms-1" />
    ) : (
      <FaSortDown className="ms-1" />
    );
  };

  // Sort payments based on selected column and direction
  const sortedPayments = useMemo(() => {
    if (!payments || !sortColumn) return payments || [];

    const sorted = [...payments].sort((a, b) => {
      let aValue, bValue;

      switch (sortColumn) {
        case "roll":
          aValue = a.student?.uid ?? 0;
          bValue = b.student?.uid ?? 0;
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;

        case "studentName":
          aValue = (a.student?.name || "").toLowerCase();
          bValue = (b.student?.name || "").toLowerCase();
          if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
          if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
          return 0;

        case "amount":
          aValue = parseFloat(a.amount) || 0;
          bValue = parseFloat(b.amount) || 0;
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;

        case "extraAmount":
          aValue = parseFloat(a.extra_amount) || 0;
          bValue = parseFloat(b.extra_amount) || 0;
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;

        case "examFee":
          aValue = parseFloat(a.exam_fee) || 0;
          bValue = parseFloat(b.exam_fee) || 0;
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;

        case "totalAmount":
          aValue = parseFloat(a.total_amount) || 0;
          bValue = parseFloat(b.total_amount) || 0;
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;

        case "month":
          // Convert month names to numbers for proper sorting
          const monthNames = [
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december",
          ];
          aValue = monthNames.indexOf((a.month || "").toLowerCase());
          bValue = monthNames.indexOf((b.month || "").toLowerCase());
          // If not found in month names, try parsing as number
          if (aValue === -1) aValue = parseInt(a.month) || 0;
          if (bValue === -1) bValue = parseInt(b.month) || 0;
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;

        case "class":
          const gradeA = grades?.find((g) => g.id === a.gradePrimaryId);
          const gradeB = grades?.find((g) => g.id === b.gradePrimaryId);
          aValue = (gradeA?.name || "").toLowerCase();
          bValue = (gradeB?.name || "").toLowerCase();
          if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
          if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
          return 0;

        case "shift":
          const gradeAForShift = grades?.find((g) => g.id === a.gradePrimaryId);
          const gradeBForShift = grades?.find((g) => g.id === b.gradePrimaryId);
          const shiftA = gradeAForShift?.shifts?.find(
            (s) => s.id === a.shiftPrimaryId,
          );
          const shiftB = gradeBForShift?.shifts?.find(
            (s) => s.id === b.shiftPrimaryId,
          );
          aValue = (shiftA?.name || "").toLowerCase();
          bValue = (shiftB?.name || "").toLowerCase();
          if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
          if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
          return 0;

        case "batch":
          const gradeAForBatch = grades?.find((g) => g.id === a.gradePrimaryId);
          const gradeBForBatch = grades?.find((g) => g.id === b.gradePrimaryId);
          const shiftAForBatch = gradeAForBatch?.shifts?.find(
            (s) => s.id === a.shiftPrimaryId,
          );
          const shiftBForBatch = gradeBForBatch?.shifts?.find(
            (s) => s.id === b.shiftPrimaryId,
          );
          const batchA = shiftAForBatch?.batches?.find(
            (batch) => batch.id === a.batchPrimaryId,
          );
          const batchB = shiftBForBatch?.batches?.find(
            (batch) => batch.id === b.batchPrimaryId,
          );
          aValue = (batchA?.name || "").toLowerCase();
          bValue = (batchB?.name || "").toLowerCase();
          if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
          if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
          return 0;

        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;

        default:
          return 0;
      }
    });

    return sorted;
  }, [payments, sortColumn, sortDirection, grades]);

  return (
    <Layout title="Payment">
      <Container>
        <Row className="mb-3">
          <Col md={12} className="text-end">
            <Button
              variant="primary"
              onClick={() => navigate("/payment-entry")}
            >
              Add Payment
            </Button>
          </Col>
        </Row>

        <Card bg="white" text="dark" className="shadow mb-4">
          <Card.Body>
            <Row>
              <Col md={3} className="py-3">
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
              <Col md={3} className="py-3">
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <label htmlFor="month" className="d-block">
                    Month
                  </label>
                </div>
                <Form.Select
                  onChange={(e) => setMonth(e.target.value)}
                  id="month"
                  name="month"
                  value={month}
                >
                  <option value={""}>Select Month</option>
                  {months.map((m, i) => (
                    <option key={i} value={m}>
                      {m}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col
                md={6}
                className="d-flex justify-content-end align-items-end py-3"
              >
                <Button onClick={selectHandler} variant="primary" type="submit">
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
                    <th
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort("roll")}
                    >
                      Roll {getSortIcon("roll")}
                    </th>
                    <th
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort("studentName")}
                    >
                      Student Name {getSortIcon("studentName")}
                    </th>
                    <th
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort("amount")}
                    >
                      Service Charge {getSortIcon("amount")}
                    </th>
                    <th
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort("extraAmount")}
                    >
                      Session Charge/ Extra Cost {getSortIcon("extraAmount")}
                    </th>
                    <th
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort("examFee")}
                    >
                      Admission Fee/ Exam Fee {getSortIcon("examFee")}
                    </th>
                    <th
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort("totalAmount")}
                    >
                      Total {getSortIcon("totalAmount")}
                    </th>
                    <th
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort("month")}
                    >
                      Month {getSortIcon("month")}
                    </th>
                    <th
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort("class")}
                    >
                      Class {getSortIcon("class")}
                    </th>
                    <th
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort("shift")}
                    >
                      Shift {getSortIcon("shift")}
                    </th>
                    <th
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort("batch")}
                    >
                      Batch {getSortIcon("batch")}
                    </th>
                    <th
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort("createdAt")}
                    >
                      Created At {getSortIcon("createdAt")}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.student?.uid || "-"}</td>
                      <td>{payment.student?.name || "-"}</td>
                      <td>{parseFloat(payment.amount || 0).toFixed(2)}</td>
                      <td>
                        {parseFloat(payment.extra_amount || 0).toFixed(2)}
                      </td>
                      <td>{parseFloat(payment.exam_fee || 0).toFixed(2)}</td>
                      <td>
                        {parseFloat(
                          payment.total_amount || payment.amount || 0,
                        ).toFixed(2)}
                      </td>
                      <td>{payment.month}</td>
                      <td>
                        {payment.gradePrimaryId
                          ? (() => {
                              const gradeObj = grades?.find(
                                (g) => g.id === payment.gradePrimaryId,
                              );
                              return gradeObj?.name || "-";
                            })()
                          : "-"}
                      </td>
                      <td>
                        {payment.shiftPrimaryId
                          ? (() => {
                              const gradeObj = grades?.find(
                                (g) => g.id === payment.gradePrimaryId,
                              );
                              const shiftObj = gradeObj?.shifts?.find(
                                (s) => s.id === payment.shiftPrimaryId,
                              );
                              return shiftObj?.name || "-";
                            })()
                          : "-"}
                      </td>
                      <td>
                        {payment.batchPrimaryId
                          ? (() => {
                              const gradeObj = grades?.find(
                                (g) => g.id === payment.gradePrimaryId,
                              );
                              const shiftObj = gradeObj?.shifts?.find(
                                (s) => s.id === payment.shiftPrimaryId,
                              );
                              const batchObj = shiftObj?.batches?.find(
                                (b) => b.id === payment.batchPrimaryId,
                              );
                              return batchObj?.name || "-";
                            })()
                          : "-"}
                      </td>
                      <td>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            navigate(`/payments/${payment.id}/edit`)
                          }
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(payment)}
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
                  {(year || month || grade || shift || batch) &&
                    " Try adjusting your filters."}
                  {!year &&
                    !month &&
                    !grade &&
                    !shift &&
                    !batch &&
                    " Select filters and click 'Select' to search for payments."}
                </p>
              </div>
            )}
          </Col>
        </Row>

        <ConfirmModal
          show={!!paymentToDelete}
          onHide={handleDeleteClose}
          onConfirm={handleDeleteConfirm}
          title="Delete Payment"
        >
          {paymentToDelete && (
            <p className="mb-0">
              Are you sure you want to delete this payment for{" "}
              <strong>{paymentToDelete.student?.name || "student"}</strong> (
              {paymentToDelete.month} {paymentToDelete.year})? This action
              cannot be undone.
            </p>
          )}
        </ConfirmModal>
      </Container>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  payments: state.payment.payments,
  loading: state.payment.loading,
  grades: state.grade.grade,
  selectedTenant: state.tenant?.selectedTenant,
});

export default connect(mapStateToProps, {
  getPayments,
  deletePayment,
  getGradeList,
})(PaymentsPage);
