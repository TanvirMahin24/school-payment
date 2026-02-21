import React, { useState } from "react";
import { Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import Layout from "../../components/shared/Layout/Layout";
import { getYearlyIncomeReport } from "../../actions/Report.action";
import YearlyIncomeReport from "../../components/Reports/YearlyIncomeReport/YearlyIncomeReport";
import { years } from "../../constants/MonthsAndYears";

const getYearsWithCurrent = () => {
  const currentYear = new Date().getFullYear();
  const base = [...years];
  if (!base.includes(currentYear)) {
    base.push(currentYear);
    base.sort((a, b) => a - b);
  }
  return base;
};

const YearlyIncomeReportPage = ({
  selectedTenant,
  getYearlyIncomeReport,
  yearlyIncomeReport,
  loading,
}) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const componentRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Yearly-Income-Report-${year}`,
    pageStyle: `
      @page { margin: 5mm; size: A4; }
      body { margin: 0 !important; padding: 0 !important; }
      html { margin: 0 !important; padding: 0 !important; }
    `,
  });

  const handleSubmit = () => {
    const tenant = selectedTenant || localStorage.getItem("selectedTenant");
    if (!tenant) {
      toast.error("Please select a tenant first");
      return;
    }
    getYearlyIncomeReport({ tenant, year });
  };

  const hasData =
    yearlyIncomeReport &&
    (yearlyIncomeReport.grades?.length > 0 ||
      yearlyIncomeReport.revenueByCategory?.length > 0 ||
      yearlyIncomeReport.finalTotal > 0);

  return (
    <Layout title="Yearly Income Report">
      <Card className="mb-4 no-print">
        <Card.Header>
          <h5 className="mb-0">Filters</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Year</Form.Label>
                <Form.Select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
                  {getYearsWithCurrent().map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md="auto" className="d-flex align-items-end">
              <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? "Loading..." : "Submit"}
              </Button>
            </Col>
            {hasData && (
              <Col md="auto" className="d-flex align-items-end">
                <Button variant="outline-secondary" onClick={handlePrint}>
                  Print / PDF
                </Button>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : hasData ? (
        <div ref={componentRef}>
          <YearlyIncomeReport
            data={yearlyIncomeReport}
            year={year}
            tenant={selectedTenant || localStorage.getItem("selectedTenant")}
          />
        </div>
      ) : yearlyIncomeReport && !hasData ? (
        <Card>
          <Card.Body>
            <div className="text-center py-5 text-muted">No data for the selected year</div>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <div className="text-center py-5 text-muted">
              Select year and click Submit to view the report
            </div>
          </Card.Body>
        </Card>
      )}
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  selectedTenant: state.tenant?.selectedTenant,
  yearlyIncomeReport: state.report?.yearlyIncomeReport,
  loading: state.report?.loading || false,
});

export default connect(mapStateToProps, { getYearlyIncomeReport })(YearlyIncomeReportPage);
