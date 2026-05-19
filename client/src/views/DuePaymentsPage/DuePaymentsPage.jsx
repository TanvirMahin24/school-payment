import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/shared/ConfirmModal/ConfirmModal";
import Layout from "../../components/shared/Layout/Layout";
import { clearPaymentDue, getDuePayments } from "../../actions/Payment.action";
import { getGradeList } from "../../actions/Grade.action";
import { months } from "../../constants/MonthsAndYears";

const DuePaymentsPage = ({
  duePayments,
  grades,
  selectedTenant,
  getDuePayments,
  clearPaymentDue,
  getGradeList,
}) => {
  const [year, setYear] = useState(`${new Date().getFullYear()}`);
  const [month, setMonth] = useState("");
  const [grade, setGrade] = useState("");
  const [shift, setShift] = useState("");
  const [batch, setBatch] = useState("");
  const [paymentToClear, setPaymentToClear] = useState(null);

  useEffect(() => {
    getGradeList(selectedTenant);
    setGrade("");
    setShift("");
    setBatch("");
    setMonth("");
    getDuePayments({ clear: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTenant]);

  const currentGrade = grades?.find((item) => item.id === parseInt(grade));
  const currentShifts = currentGrade?.shifts || [];
  const currentShift = currentShifts.find(
    (item) => item.id === parseInt(shift),
  );
  const currentBatches = currentShift?.batches || [];

  const gradeMap = useMemo(() => {
    const map = new Map();
    grades?.forEach((gradeItem) => {
      map.set(gradeItem.id, gradeItem);
    });
    return map;
  }, [grades]);

  const getGradeName = (payment) =>
    gradeMap.get(payment.gradePrimaryId)?.name || "-";

  const getShiftName = (payment) => {
    const gradeItem = gradeMap.get(payment.gradePrimaryId);
    return (
      gradeItem?.shifts?.find(
        (shiftItem) => shiftItem.id === payment.shiftPrimaryId,
      )?.name || "-"
    );
  };

  const getBatchName = (payment) => {
    const gradeItem = gradeMap.get(payment.gradePrimaryId);
    const shiftItem = gradeItem?.shifts?.find(
      (item) => item.id === payment.shiftPrimaryId,
    );
    return (
      shiftItem?.batches?.find(
        (batchItem) => batchItem.id === payment.batchPrimaryId,
      )?.name || "-"
    );
  };

  const handleSelect = () => {
    if (!selectedTenant || !year || !month) {
      toast.error("Tenant, year, and month are required");
      return;
    }

    getDuePayments({
      tenant: selectedTenant,
      year,
      month,
      ...(grade && { gradeId: grade }),
      ...(shift && { shiftId: shift }),
      ...(batch && { batchId: batch }),
    });
  };

  const handleClearDue = async () => {
    if (!paymentToClear) return;
    await clearPaymentDue(paymentToClear.id);
  };

  const totalDue = (payments) => {
    let total = 0;
    if (payments && payments.length > 0) {
      payments.map((item) => {
        if (!item.due_amount) {
          return item;
        }
        total += item?.due_amount ? parseFloat(item?.due_amount) : 0;
        return item;
      });
    }

    return total.toFixed(2);
  };

  return (
    <Layout title="Due Payments">
      <Card bg="white" text="dark" className="shadow mb-4">
        <Card.Body>
          <Row>
            <Col md={3} className="py-3">
              <label htmlFor="due-year" className="d-block pb-2">
                Year
              </label>
              <Form.Select
                id="due-year"
                name="year"
                value={year}
                onChange={(event) => setYear(event.target.value)}
              >
                <option value="">Select Year</option>
                {Array.from({ length: 20 }, (_, index) => index + 2010)
                  .reverse()
                  .map((item) => (
                    <option key={item} value={`${item}`}>
                      {item}
                    </option>
                  ))}
              </Form.Select>
            </Col>
            <Col md={3} className="py-3">
              <label htmlFor="due-month" className="d-block pb-2">
                Month
              </label>
              <Form.Select
                id="due-month"
                name="month"
                value={month}
                onChange={(event) => setMonth(event.target.value)}
              >
                <option value="">Select Month</option>
                {months.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3} className="py-3">
              <label htmlFor="due-grade" className="d-block pb-2">
                Class
              </label>
              <Form.Select
                id="due-grade"
                value={grade}
                onChange={(event) => {
                  setGrade(event.target.value);
                  setShift("");
                  setBatch("");
                }}
              >
                <option value="">Select Class</option>
                {grades?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3} className="d-flex align-items-end py-3">
              <Button
                onClick={handleSelect}
                variant="primary"
                className="w-100"
              >
                Select
              </Button>
            </Col>
          </Row>
          <Row>
            {grade !== "" && (
              <Col md={3} className="py-3">
                <label htmlFor="due-shift" className="d-block pb-2">
                  Shift
                </label>
                <Form.Select
                  id="due-shift"
                  value={shift}
                  onChange={(event) => {
                    setShift(event.target.value);
                    setBatch("");
                  }}
                >
                  <option value="">Select Shift</option>
                  {currentShifts.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            )}
            {grade !== "" && shift !== "" && (
              <Col md={3} className="py-3">
                <label htmlFor="due-batch" className="d-block pb-2">
                  Batch
                </label>
                <Form.Select
                  id="due-batch"
                  value={batch}
                  onChange={(event) => setBatch(event.target.value)}
                >
                  <option value="">Select Batch</option>
                  {currentBatches.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      {duePayments && duePayments.length > 0 ? (
        <>
          <Table striped bordered hover responsive width={"100%"}>
            <thead>
              <tr>
                <th>Roll</th>
                <th>Student Name</th>
                <th>Phone</th>
                <th>Month</th>
                <th>Year</th>
                <th>Service Charge</th>
                <th>Extra/Session</th>
                <th>Exam/Admission</th>
                <th>Total</th>
                <th>Due Amount</th>
                <th>Class</th>
                <th>Shift</th>
                <th>Batch</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="table-responsive">
              {duePayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.student?.uid || "-"}</td>
                  <td>{payment.student?.name || "-"}</td>
                  <td>{payment.student?.phone || "-"}</td>
                  <td>{payment.month}</td>
                  <td>{payment.year || "-"}</td>
                  <td>{parseFloat(payment.amount || 0).toFixed(2)}</td>
                  <td>{parseFloat(payment.extra_amount || 0).toFixed(2)}</td>
                  <td>{parseFloat(payment.exam_fee || 0).toFixed(2)}</td>
                  <td>
                    {parseFloat(
                      payment.total_amount || payment.amount || 0,
                    ).toFixed(2)}
                  </td>
                  <td className="fw-bold text-danger">
                    {parseFloat(
                      payment.due_amount || payment.due_amount || 0,
                    ).toFixed(2)}
                  </td>
                  <td>{getGradeName(payment)}</td>
                  <td>{getShiftName(payment)}</td>
                  <td>{getBatchName(payment)}</td>
                  <td>{payment.note}</td>
                  <td>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => setPaymentToClear(payment)}
                    >
                      Clear Due
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="container pt-4">
            <h4 className="text-center text-danger fw-bold">
              Total Due Amount: {totalDue(duePayments)}
            </h4>
          </div>
        </>
      ) : (
        <div className="text-center py-5">
          <p className="mb-0">
            Select a year and month to view students with due payments.
          </p>
        </div>
      )}

      <ConfirmModal
        show={!!paymentToClear}
        onHide={() => setPaymentToClear(null)}
        onConfirm={handleClearDue}
        title="Clear Due Payment"
        confirmLabel="Clear Due"
        confirmVariant="success"
      >
        {paymentToClear && (
          <p className="mb-0">
            Mark the due payment for{" "}
            <strong>{paymentToClear.student?.name || "this student"}</strong> (
            {paymentToClear.month} {paymentToClear.year}) as paid?
          </p>
        )}
      </ConfirmModal>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  duePayments: state.payment.duePayments,
  grades: state.grade.grade,
  selectedTenant: state.tenant?.selectedTenant,
});

export default connect(mapStateToProps, {
  getDuePayments,
  clearPaymentDue,
  getGradeList,
})(DuePaymentsPage);
