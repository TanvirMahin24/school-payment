import React, { useMemo, useState, useEffect } from "react";
import { Card, Table, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { getBatchBreakdown } from "../../actions/Report.action";
import { months, years } from "../../constants/MonthsAndYears";

const BatchBreakdown = ({ selectedTenant, batchBreakdown, getBatchBreakdown, loading }) => {
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
    getBatchBreakdown(filters);
  };

  const totalPayment = useMemo(() => {
    if (!batchBreakdown || batchBreakdown === null || batchBreakdown.length === 0) return 0;
    return batchBreakdown.reduce(
      (acc, d) => acc + parseFloat(d.payment || 0),
      0
    );
  }, [batchBreakdown]);

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
      ) : batchBreakdown && Array.isArray(batchBreakdown) && batchBreakdown.length > 0 ? (
        <Card className="border-0">
          <Card.Body>
            <h5 className="mb-3">Batch-wise Payment Breakdown</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Grade</th>
                  <th>Shift</th>
                  <th>Batch</th>
                  <th className="text-end">Payment Amount</th>
                </tr>
              </thead>
              <tbody>
                {batchBreakdown.map((d, index) => (
                  <tr key={index}>
                    <td>{d.gradeName}</td>
                    <td>{d.shiftName}</td>
                    <td>{d.batchName}</td>
                    <td className="text-end">{parseFloat(d.payment || 0).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="table-info fw-bold">
                  <td colSpan="3">Total</td>
                  <td className="text-end">{totalPayment.toFixed(2)}</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ) : batchBreakdown && Array.isArray(batchBreakdown) && batchBreakdown.length === 0 ? (
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
  batchBreakdown: state.report?.batchBreakdown,
  loading: state.report?.loading || false,
  selectedTenant: state.tenant?.selectedTenant,
});

export default connect(mapStateToProps, { getBatchBreakdown })(BatchBreakdown);

