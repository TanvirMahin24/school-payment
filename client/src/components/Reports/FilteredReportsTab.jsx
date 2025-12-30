import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { getFilteredStats } from "../../actions/Report.action";
import { getGradeList } from "../../actions/Grade.action";
import FilteredChart from "./FilteredChart";
import { months, years } from "../../constants/MonthsAndYears";

const FilteredReportsTab = ({
  selectedTenant,
  getFilteredStats,
  getGradeList,
  grades,
  filteredStats,
  loading,
}) => {
  const [grade, setGrade] = useState("");
  const [shift, setShift] = useState("");
  const [batch, setBatch] = useState("");
  const getStartMonth = () => {
    const currentMonth = new Date().getMonth();
    const startMonthIndex = currentMonth - 11;
    return startMonthIndex >= 0 ? months[startMonthIndex] : months[0];
  };
  
  const [startMonth, setStartMonth] = useState(getStartMonth());
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [endMonth, setEndMonth] = useState(months[new Date().getMonth()]);
  const [endYear, setEndYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (selectedTenant) {
      getGradeList(selectedTenant);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTenant]);

  // Don't clear on mount - ReportsPage handles clearing on tab change

  // Clear filtered stats when grade, shift, or batch changes
  useEffect(() => {
    if (filteredStats !== null && filteredStats !== undefined) {
      getFilteredStats({ clear: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, shift, batch]);

  const handleFilter = () => {
    const filters = {
      tenant: selectedTenant,
      ...(grade && { gradeId: grade }),
      ...(shift && { shiftId: shift }),
      ...(batch && { batchId: batch }),
      startMonth,
      startYear,
      endMonth,
      endYear,
    };
    getFilteredStats(filters);
  };

  // Get current grade's shifts and batches
  const currentGrade = grades?.find((g) => g.id === parseInt(grade));
  const currentShifts = currentGrade?.shifts || [];
  const currentShift = currentShifts.find((s) => s.id === parseInt(shift));
  const currentBatches = currentShift?.batches || [];

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Filter Options</h5>
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
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Class (Optional)</Form.Label>
                <Form.Select
                  value={grade}
                  onChange={(e) => {
                    setGrade(e.target.value);
                    setShift("");
                    setBatch("");
                  }}
                >
                  <option value="">All Classes</option>
                  {grades?.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            {grade && (
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Shift (Optional)</Form.Label>
                  <Form.Select
                    value={shift}
                    onChange={(e) => {
                      setShift(e.target.value);
                      setBatch("");
                    }}
                  >
                    <option value="">All Shifts</option>
                    {currentShifts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            )}
            {grade && shift && (
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Batch (Optional)</Form.Label>
                  <Form.Select
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                  >
                    <option value="">All Batches</option>
                    {currentBatches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            )}
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
      ) : filteredStats && filteredStats.length > 0 ? (
        <FilteredChart data={filteredStats} hasFilter={!!(grade || shift || batch)} />
      ) : filteredStats && filteredStats.length === 0 ? (
        <Card>
          <Card.Body>
            <div className="text-center py-5">
              <p className="text-muted">No data found for the selected filters</p>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <div className="text-center py-5">
              <p className="text-muted">Click generate report to view data</p>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  grades: state.grade?.grade || [],
  filteredStats: state.report?.filteredStats || [],
  loading: state.report?.loading || false,
});

export default connect(mapStateToProps, { getFilteredStats, getGradeList })(FilteredReportsTab);

