import React, { useMemo, useState, useEffect } from "react";
import { Card, Table, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { getGradeBreakdown } from "../../actions/Report.action";
import { months, years } from "../../constants/MonthsAndYears";

const GradeBreakdown = ({ selectedTenant, gradeBreakdown, getGradeBreakdown, loading }) => {
  const getStartMonth = () => {
    const currentMonth = new Date().getMonth();
    const startMonthIndex = currentMonth - 11;
    return startMonthIndex >= 0 ? months[startMonthIndex] : months[0];
  };

  const [startMonth, setStartMonth] = useState(getStartMonth());
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [endMonth, setEndMonth] = useState(months[new Date().getMonth()]);
  const [endYear, setEndYear] = useState(new Date().getFullYear());

  // Don't clear on mount - ReportsPage handles clearing on tab change

  const handleFilter = () => {
    const filters = {
      tenant: selectedTenant,
      startMonth,
      startYear,
      endMonth,
      endYear,
    };
    getGradeBreakdown(filters);
  };

  const totalPayment = useMemo(() => {
    if (!gradeBreakdown || !Array.isArray(gradeBreakdown) || gradeBreakdown.length === 0) return { payment: 0, extraPayment: 0, examPayment: 0 };
    return gradeBreakdown.reduce(
      (acc, d) => ({
        payment: acc.payment + parseFloat(d.payment || 0),
        extraPayment: acc.extraPayment + parseFloat(d.extraPayment || 0),
        examPayment: acc.examPayment + parseFloat(d.examPayment || 0),
      }),
      { payment: 0, extraPayment: 0, examPayment: 0 }
    );
  }, [gradeBreakdown]);

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Date Range Filter</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Start Year</Form.Label>
                <Form.Select
                  value={startYear}
                  onChange={(e) => setStartYear(parseInt(e.target.value))}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Start Month</Form.Label>
                <Form.Select
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>End Year</Form.Label>
                <Form.Select
                  value={endYear}
                  onChange={(e) => setEndYear(parseInt(e.target.value))}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>End Month</Form.Label>
                <Form.Select
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
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
            <Col>
              <Button variant="primary" onClick={handleFilter} disabled={loading}>
                {loading ? "Loading..." : "Generate Report"}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : gradeBreakdown && Array.isArray(gradeBreakdown) && gradeBreakdown.length > 0 ? (
        <Card className="border-0">
          <Card.Body>
            <h5 className="mb-3">Class-wise Payment Breakdown</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Class</th>
                  <th className="text-end">Payment</th>
                  <th className="text-end">Extra Payment</th>
                  <th className="text-end">Exam Fee</th>
                </tr>
              </thead>
              <tbody>
                {gradeBreakdown.map((d, index) => (
                  <tr key={index}>
                    <td>{d.gradeName}</td>
                    <td className="text-end">{parseFloat(d.payment || 0).toFixed(2)}</td>
                    <td className="text-end">{parseFloat(d.extraPayment || 0).toFixed(2)}</td>
                    <td className="text-end">{parseFloat(d.examPayment || 0).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="table-info fw-bold">
                  <td>Total</td>
                  <td className="text-end">{totalPayment.payment.toFixed(2)}</td>
                  <td className="text-end">{totalPayment.extraPayment.toFixed(2)}</td>
                  <td className="text-end">{totalPayment.examPayment.toFixed(2)}</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ) : gradeBreakdown && Array.isArray(gradeBreakdown) && gradeBreakdown.length === 0 ? (
        <Card>
          <Card.Body>
            <div className="text-center py-5">
              <p className="text-muted">No data found for the selected date range</p>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <div className="text-center py-5">
              <p className="text-muted">Select date range and click "Generate Report" to view data</p>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  gradeBreakdown: state.report?.gradeBreakdown,
  loading: state.report?.loading || false,
  selectedTenant: state.tenant?.selectedTenant,
});

export default connect(mapStateToProps, { getGradeBreakdown })(GradeBreakdown);

