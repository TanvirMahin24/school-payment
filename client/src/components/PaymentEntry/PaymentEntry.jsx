import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Spinner,
  Table,
  Col,
  Row,
  Form,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { getStudentList } from "../../actions/Student.action";
import { getGradeList } from "../../actions/Grade.action";
import {
  createPayments,
  getPaymentsByStudents,
} from "../../actions/Payment.action";
import { months, years } from "../../constants/MonthsAndYears";

const PaymentEntry = ({
  list,
  getStudentList,
  grades,
  getGradeList,
  selectedTenant,
}) => {
  const [rawList, setRawList] = useState([]);
  const [grade, setGrade] = useState("");
  const [batch, setBatch] = useState("");
  const [shift, setShift] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(months[new Date().getMonth()]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Bulk fill values
  const [bulkAmount, setBulkAmount] = useState("");
  const [bulkExtraAmount, setBulkExtraAmount] = useState("");
  const [bulkExamFee, setBulkExamFee] = useState("");
  const [bulkNote, setBulkNote] = useState("");

  // Student payment data
  const [studentPayments, setStudentPayments] = useState({});
  // Payment status for each student (created/updated/failed/existing/new)
  const [paymentStatus, setPaymentStatus] = useState({});
  // Selected students for submission
  const [selectedStudents, setSelectedStudents] = useState(new Set());

  useEffect(() => {
    if (list !== null && list.length > 0) {
      setRawList(list);
      // Fetch existing payments when list changes (if we have filter context)
      const fetchExistingPayments = async () => {
        // Only fetch if we have the necessary filter context
        if (grade && shift && batch) {
          const studentIds = list.map((s) => s.id);
          const existingPayments = await getPaymentsByStudents({
            tenant: selectedTenant,
            year: year,
            gradeId: grade,
            shiftId: shift,
            batchId: batch,
            studentIds: studentIds,
            month: month,
          });

          // Initialize payment data for each student
          const initialPayments = {};
          const initialStatus = {};

          list.forEach((student) => {
            const existingPayment = existingPayments[student.id];

            if (existingPayment) {
              // Pre-fill with existing payment data
              initialPayments[student.id] = {
                amount: existingPayment.amount?.toString() || "",
                extra_amount: existingPayment.extra_amount?.toString() || "",
                exam_fee: existingPayment.exam_fee?.toString() || "",
                note: existingPayment.note || "",
              };
              initialStatus[student.id] = "existing";
            } else {
              // New payment - use bulk values or empty
              initialPayments[student.id] = {
                amount: "",
                extra_amount: "",
                exam_fee: "",
                note: "",
              };
              initialStatus[student.id] = "new";
            }
          });

          setStudentPayments(initialPayments);
          setPaymentStatus(initialStatus);
          // Select all students by default
          setSelectedStudents(new Set(list.map((s) => s.id)));
        } else {
          // No filter context yet, just initialize with empty values
          const initialPayments = {};
          list.forEach((student) => {
            initialPayments[student.id] = {
              amount: "",
              extra_amount: "",
              exam_fee: "",
              note: "",
            };
          });
          setStudentPayments(initialPayments);
          setPaymentStatus({});
          // Select all students by default
          setSelectedStudents(new Set(list.map((s) => s.id)));
        }
      };

      fetchExistingPayments();
    } else if (list !== null && list.length === 0) {
      // Empty list
      setRawList([]);
      setStudentPayments({});
      setPaymentStatus({});
      setSelectedStudents(new Set());
    }

    if (grades === null) {
      getGradeList(selectedTenant);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, grades, getGradeList, selectedTenant]);

  const selectHandler = async () => {
    setLoading(true);
    const result = await getStudentList(
      year,
      grade,
      shift,
      batch,
      selectedTenant,
    );

    if (result && result.length > 0) {
      // Fetch existing payments for these students
      // Match by: userId, year, gradeId, shiftId, batchId, and month
      const studentIds = result.map((s) => s.id);
      const existingPayments = await getPaymentsByStudents({
        tenant: selectedTenant,
        year: year,
        gradeId: grade,
        shiftId: shift,
        batchId: batch,
        studentIds: studentIds,
        month: month,
      });

      // Initialize payment data for loaded students
      const initialPayments = {};
      const initialStatus = {};

      result.forEach((student) => {
        const existingPayment = existingPayments[student.id];

        if (existingPayment) {
          // Pre-fill with existing payment data
          initialPayments[student.id] = {
            amount: existingPayment.amount?.toString() || "",
            extra_amount: existingPayment.extra_amount?.toString() || "",
            exam_fee: existingPayment.exam_fee?.toString() || "",
            note: existingPayment.note || "",
          };
          initialStatus[student.id] = "existing";
        } else {
          // New payment - use bulk values or empty
          initialPayments[student.id] = {
            amount: "",
            extra_amount: "",
            exam_fee: "",
            note: "",
          };
          initialStatus[student.id] = "new";
        }
      });

      setStudentPayments(initialPayments);
      setPaymentStatus(initialStatus);
      // Select all students by default
      setSelectedStudents(new Set(result.map((s) => s.id)));
    } else {
      // No students found
      setStudentPayments({});
      setPaymentStatus({});
      setSelectedStudents(new Set());
    }

    setLoading(false);
  };

  const applyBulkFill = () => {
    if (selectedStudents.size === 0) {
      toast.warning("Please select at least one student to apply bulk values");
      return;
    }
    const updatedPayments = { ...studentPayments };
    rawList
      .filter((student) => selectedStudents.has(student.id))
      .forEach((student) => {
        updatedPayments[student.id] = {
          ...updatedPayments[student.id],
          amount: bulkAmount || updatedPayments[student.id]?.amount || "",
          extra_amount:
            bulkExtraAmount || updatedPayments[student.id]?.extra_amount || "",
          exam_fee: bulkExamFee || updatedPayments[student.id]?.exam_fee || "",
          note: bulkNote || updatedPayments[student.id]?.note || "",
        };
      });
    setStudentPayments(updatedPayments);
    toast.success(
      `Bulk values applied to ${selectedStudents.size} selected student(s)`,
    );
  };

  const updateStudentPayment = (studentId, field, value) => {
    setStudentPayments((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedStudents(new Set(rawList.map((s) => s.id)));
  };

  const handleUnselectAll = () => {
    setSelectedStudents(new Set());
  };

  const validatePayments = () => {
    const errors = [];

    // Validate filters are selected
    if (!grade || grade === "") {
      errors.push("Please select a Class");
    }
    if (!shift || shift === "") {
      errors.push("Please select a Shift");
    }
    if (!batch || batch === "") {
      errors.push("Please select a Batch");
    }

    if (!month || month === "") {
      errors.push("Please select a Month");
    }

    // Check if at least one student is selected
    if (selectedStudents.size === 0) {
      errors.push("Please select at least one student to submit");
    }

    // Only validate selected students - amount can be empty or 0 (treated as 0); only reject negative or invalid numbers
    rawList.forEach((student) => {
      if (selectedStudents.has(student.id)) {
        const payment = studentPayments[student.id];
        if (!payment) {
          errors.push(`Student ${student.uid} (${student.name}): Exam Fee / Admission Fee data missing`);
          return;
        }
        const amountStr = payment.amount;
        if (amountStr !== "" && amountStr !== undefined && amountStr !== null) {
          const amountNum = parseFloat(amountStr);
          if (Number.isNaN(amountNum) || amountNum < 0) {
            errors.push(
              `Student ${student.uid} (${student.name}): Amount must be a number >= 0`,
            );
          }
        }
      }
    });

    if (errors.length > 0) {
      toast.error(`Validation errors:\n${errors.join("\n")}`);
      return false;
    }
    return true;
  };

  const submitPayments = async () => {
    if (rawList.length === 0) {
      toast.error("No students selected. Please filter students first.");
      return;
    }

    if (!validatePayments()) {
      return;
    }

    setSubmitting(true);

    // Get current grade, shift, batch info
    const gradeNum = grade && grade !== "" ? parseInt(grade) : null;
    const shiftNum = shift && shift !== "" ? parseInt(shift) : null;
    const batchNum = batch && batch !== "" ? parseInt(batch) : null;

    const currentGrade = gradeNum
      ? grades?.find((g) => g.id === gradeNum)
      : null;
    const currentShift =
      currentGrade && shiftNum
        ? currentGrade.shifts?.find((s) => s.id === shiftNum)
        : null;
    const currentBatch =
      currentGrade && batchNum && shiftNum
        ? currentGrade.batches?.find(
            (b) => b.id === batchNum && b.shiftId === shiftNum,
          )
        : null;

    const finalGradeId =
      currentGrade?.id || (gradeNum && !isNaN(gradeNum) ? gradeNum : null);
    const finalShiftId =
      currentShift?.id || (shiftNum && !isNaN(shiftNum) ? shiftNum : null);
    const finalBatchId =
      currentBatch?.id || (batchNum && !isNaN(batchNum) ? batchNum : null);

    if (!finalGradeId || !finalShiftId || !finalBatchId) {
      toast.error(
        "Grade, Shift, and Batch must be selected before submitting payments",
      );
      setSubmitting(false);
      return;
    }

    // Prepare payment data - only for selected students
    const paymentsToSubmit = rawList
      .filter((student) => selectedStudents.has(student.id))
      .map((student) => {
        const payment = studentPayments[student.id];
        return {
          userId: student.id, // Use student primaryId as userId
          amount: parseFloat(payment.amount || 0),
          extra_amount: payment.extra_amount
            ? parseFloat(payment.extra_amount)
            : 0,
          exam_fee: payment.exam_fee ? parseFloat(payment.exam_fee) : 0,
          month: month,
          year: year,
          tenant: selectedTenant,
          note: payment.note || "",
          meta: {
            note: payment.note || "",
            studentId: student.id,
            studentUid: student.uid,
            studentName: student.name,
            gradeId: finalGradeId,
            shiftId: finalShiftId,
            batchId: finalBatchId,
            gradeName: currentGrade?.name,
            shiftName: currentShift?.name,
            batchName: currentBatch?.name,
          },
          gradeId: finalGradeId,
          shiftId: finalShiftId,
          batchId: finalBatchId,
        };
      });

    // Submit payments
    const results = await createPayments(paymentsToSubmit);

    setSubmitting(false);

    // Update payment status for each student (only for selected ones)
    const newStatus = { ...paymentStatus };
    rawList
      .filter((student) => selectedStudents.has(student.id))
      .forEach((student) => {
        const status = results.statusMap[student.id];
        if (status) {
          newStatus[student.id] = status;
        }
      });
    setPaymentStatus(newStatus);

    // Show results with created/updated breakdown
    const createdCount = results.successful.filter(
      (r) => r.status === "created",
    ).length;
    const updatedCount = results.successful.filter(
      (r) => r.status === "updated",
    ).length;

    if (results.successful.length > 0) {
      const messageParts = [];
      if (createdCount > 0) messageParts.push(`${createdCount} created`);
      if (updatedCount > 0) messageParts.push(`${updatedCount} updated`);
      toast.success(
        `Successfully processed ${
          results.successful.length
        } payment(s): ${messageParts.join(", ")}`,
      );
    }

    if (results.failed.length > 0) {
      const failedNames = results.failed
        .map((f) => f.studentName || `Student ${f.studentId}`)
        .join(", ");
      toast.error(
        `Failed to process ${results.failed.length} payment(s): ${failedNames}`,
      );
    }

    // Clear form if all successful (but keep status visible)
    if (results.failed.length === 0 && results.successful.length > 0) {
      // Reset payment data
      const clearedPayments = {};
      rawList.forEach((student) => {
        clearedPayments[student.id] = {
          amount: "",
          extra_amount: "",
          exam_fee: "",
          note: "",
        };
      });
      setStudentPayments(clearedPayments);
      // Clear bulk fill
      setBulkAmount("");
      setBulkExtraAmount("");
      setBulkExamFee("");
      setBulkNote("");
    }
  };

  // Get current grade's shifts and batches
  const currentGrade = grades?.find((g) => g.id === parseInt(grade));
  const currentShifts = currentGrade?.shifts || [];
  const currentShift = currentShifts.find((s) => s.id === parseInt(shift));
  const currentBatches = currentShift?.batches || [];

  return (
    <Container className="pb-4">
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
                onChange={(e) => {
                  setYear(parseInt(e.target.value));
                }}
                id="year"
                name="year"
                value={year}
              >
                <option value={""}>Select Year</option>
                {years.map((y, i) => (
                  <option key={i} value={y}>
                    {y}
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
                onChange={(e) => {
                  setMonth(e.target.value);
                }}
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
          </Row>
          <Row>
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
            <Col
              md={grade !== "" && shift !== "" ? 9 : 12}
              className="d-flex justify-content-end align-items-end py-3"
            >
              <Button
                onClick={selectHandler}
                variant="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading..." : "Select"}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Bulk Fill Section */}
      {rawList.length > 0 && (
        <Card bg="light" text="dark" className="shadow mb-4">
          <Card.Body>
            <h5 className="mb-3">Bulk Fill (Apply to Selected Students)</h5>
            <Row>
              <Col md={2} className="py-2">
                <label htmlFor="bulkAmount" className="d-block pb-1">
                  Amount
                </label>
                <Form.Control
                  type="number"
                  id="bulkAmount"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={bulkAmount}
                  onChange={(e) => setBulkAmount(e.target.value)}
                />
              </Col>
              <Col md={2} className="py-2">
                <label htmlFor="bulkExtraAmount" className="d-block pb-1">
                  Extra / Service Charge
                </label>
                <Form.Control
                  type="number"
                  id="bulkExtraAmount"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={bulkExtraAmount}
                  onChange={(e) => setBulkExtraAmount(e.target.value)}
                />
              </Col>
              <Col md={2} className="py-2">
                <label htmlFor="bulkExamFee" className="d-block pb-1">
                  Exam Fee
                </label>
                <Form.Control
                  type="number"
                  id="bulkExamFee"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={bulkExamFee}
                  onChange={(e) => setBulkExamFee(e.target.value)}
                />
              </Col>
              <Col md={2} className="py-2">
                <label htmlFor="bulkNote" className="d-block pb-1">
                  Note
                </label>
                <Form.Control
                  type="text"
                  id="bulkNote"
                  placeholder="Note..."
                  value={bulkNote}
                  onChange={(e) => setBulkNote(e.target.value)}
                />
              </Col>
              <Col md={2} className="py-2 d-flex align-items-end">
                <Button
                  variant="success"
                  onClick={applyBulkFill}
                  className="w-100"
                >
                  Apply
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Card className="shadow p-md-4 pb-md-0 p-2">
        <Card.Body>
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: 400 }}
            >
              <Spinner variant="dark" animation="grow" />
            </div>
          ) : rawList.length === 0 ? (
            <span className="text-center fs-4 d-block pb-3">
              No Student Found. Please select filters and click "Select".
            </span>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="mb-1">
                    Payment Entry ({rawList.length} students)
                  </h5>
                  <h6 className="text-muted mb-0">
                    {month} {year}
                  </h6>
                  <small className="text-muted">
                    {selectedStudents.size} of {rawList.length} selected
                  </small>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <ButtonGroup>
                    <Button
                      variant="outline-secondary"
                      onClick={handleSelectAll}
                      size="sm"
                    >
                      Check All
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={handleUnselectAll}
                      size="sm"
                    >
                      Uncheck All
                    </Button>
                  </ButtonGroup>
                  <Button
                    variant="primary"
                    onClick={submitPayments}
                    disabled={submitting || selectedStudents.size === 0}
                    size="lg"
                  >
                    {submitting
                      ? "Submitting..."
                      : `Submit Selected (${selectedStudents.size})`}
                  </Button>
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <Table
                  striped
                  bordered
                  hover
                  responsive
                  size="sm"
                  style={{ fontSize: "0.875rem" }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          width: "3%",
                          padding: "0.5rem",
                          textAlign: "center",
                        }}
                      >
                        <Form.Check
                          type="checkbox"
                          checked={
                            selectedStudents.size === rawList.length &&
                            rawList.length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleSelectAll();
                            } else {
                              handleUnselectAll();
                            }
                          }}
                        />
                      </th>
                      <th style={{ width: "5%", padding: "0.5rem" }}>Roll</th>
                      <th style={{ width: "15%", padding: "0.5rem" }}>Name</th>
                      <th style={{ width: "10%", padding: "0.5rem" }}>
                        Amount *
                      </th>
                      <th style={{ width: "10%", padding: "0.5rem" }}>Extra / Service Charge</th>
                      <th style={{ width: "10%", padding: "0.5rem" }}>
                        Exam Fee
                      </th>
                      <th style={{ width: "22%", padding: "0.5rem" }}>Note</th>
                      <th
                        style={{
                          width: "10%",
                          padding: "0.5rem",
                          textAlign: "center",
                        }}
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawList
                      .sort(function (a, b) {
                        if (a.uid < b.uid) return -1;
                        if (a.uid > b.uid) return 1;
                        return 0;
                      })
                      .map((student) => {
                        const payment = studentPayments[student.id] || {
                          amount: "",
                          extra_amount: "",
                          exam_fee: "",
                          note: "",
                        };
                        const status = paymentStatus[student.id];
                        const getStatusBadge = () => {
                          if (!status) return null;
                          if (status === "existing") {
                            return (
                              <span
                                className="badge bg-info"
                                style={{ fontSize: "0.7rem" }}
                              >
                                Existing
                              </span>
                            );
                          } else if (status === "new") {
                            return (
                              <span
                                className="badge bg-secondary"
                                style={{ fontSize: "0.7rem" }}
                              >
                                Not Paid Yet
                              </span>
                            );
                          } else if (status === "created") {
                            return (
                              <span
                                className="badge bg-success"
                                style={{ fontSize: "0.7rem" }}
                              >
                                Paid
                              </span>
                            );
                          } else if (status === "updated") {
                            return (
                              <span
                                className="badge bg-warning text-dark"
                                style={{ fontSize: "0.7rem" }}
                              >
                                Paid
                              </span>
                            );
                          } else if (status === "failed") {
                            return (
                              <span
                                className="badge bg-danger"
                                style={{ fontSize: "0.7rem" }}
                              >
                                Failed
                              </span>
                            );
                          }
                          return null;
                        };
                        return (
                          <tr key={student.id}>
                            <td
                              style={{
                                padding: "0.5rem",
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              <Form.Check
                                type="checkbox"
                                checked={selectedStudents.has(student.id)}
                                onChange={() => handleStudentSelect(student.id)}
                              />
                            </td>
                            <td
                              style={{
                                padding: "0.5rem",
                                verticalAlign: "middle",
                              }}
                            >
                              {student.uid}
                            </td>
                            <td
                              style={{
                                padding: "0.5rem",
                                verticalAlign: "middle",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "150px",
                              }}
                              title={student.name}
                            >
                              {student.name}
                            </td>
                            <td style={{ padding: "0.5rem" }}>
                              <Form.Control
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                value={payment.amount}
                                onChange={(e) =>
                                  updateStudentPayment(
                                    student.id,
                                    "amount",
                                    e.target.value,
                                  )
                                }
                                size="sm"
                                style={{
                                  fontSize: "0.875rem",
                                  padding: "0.25rem 0.5rem",
                                }}
                              />
                            </td>
                            <td style={{ padding: "0.5rem" }}>
                              <Form.Control
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                value={payment.extra_amount}
                                onChange={(e) =>
                                  updateStudentPayment(
                                    student.id,
                                    "extra_amount",
                                    e.target.value,
                                  )
                                }
                                size="sm"
                                style={{
                                  fontSize: "0.875rem",
                                  padding: "0.25rem 0.5rem",
                                }}
                              />
                            </td>
                            <td style={{ padding: "0.5rem" }}>
                              <Form.Control
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                value={payment.exam_fee}
                                onChange={(e) =>
                                  updateStudentPayment(
                                    student.id,
                                    "exam_fee",
                                    e.target.value,
                                  )
                                }
                                size="sm"
                                style={{
                                  fontSize: "0.875rem",
                                  padding: "0.25rem 0.5rem",
                                }}
                              />
                            </td>
                            <td style={{ padding: "0.5rem" }}>
                              <Form.Control
                                type="text"
                                placeholder="Note..."
                                value={payment.note}
                                onChange={(e) =>
                                  updateStudentPayment(
                                    student.id,
                                    "note",
                                    e.target.value,
                                  )
                                }
                                size="sm"
                                style={{
                                  fontSize: "0.875rem",
                                  padding: "0.25rem 0.5rem",
                                }}
                              />
                            </td>
                            <td
                              style={{
                                padding: "0.5rem",
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              {getStatusBadge()}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
              <div className="mt-3">
                <small className="text-muted">
                  * Required fields. Click "Submit All Exam Fees / Admission Fees" to create
                  payments in the payment system.
                </small>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  list: state.student?.student,
  grades: state.grade?.grade,
  selectedTenant: state.tenant?.selectedTenant,
});

const PaymentEntryConnected = connect(mapStateToProps, {
  getStudentList,
  getGradeList,
})(PaymentEntry);

export { PaymentEntry };
export default PaymentEntryConnected;
