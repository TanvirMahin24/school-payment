import React, { useEffect, useState, useRef } from "react";
import { Container, Card, Tabs, Tab, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import Layout from "../../components/shared/Layout/Layout";
import { getMonthlyStats, getFilteredStats, getGradeBreakdown, getShiftBreakdown, getBatchBreakdown } from "../../actions/Report.action";
import ProfitChart from "../../components/Reports/ProfitChart";
import PaymentsChart from "../../components/Reports/PaymentsChart";
import FilteredReportsTab from "../../components/Reports/FilteredReportsTab";
import GradeBreakdown from "../../components/Reports/GradeBreakdown";
import ShiftBreakdown from "../../components/Reports/ShiftBreakdown";
import BatchBreakdown from "../../components/Reports/BatchBreakdown";

const ReportsPage = ({ monthlyStats, getMonthlyStats, selectedTenant, loading, getFilteredStats, getGradeBreakdown, getShiftBreakdown, getBatchBreakdown }) => {
  const [activeTab, setActiveTab] = useState("profit");

  useEffect(() => {
    if (selectedTenant) {
      getMonthlyStats(selectedTenant);
    }
  }, [selectedTenant, getMonthlyStats]);

  // Clear data when switching tabs (only clear when tab actually changes, not on function reference changes)
  const prevTabRef = useRef(activeTab);
  useEffect(() => {
    // Only clear if tab actually changed
    if (prevTabRef.current !== activeTab) {
      getFilteredStats({ clear: true });
      getGradeBreakdown({ clear: true });
      getShiftBreakdown({ clear: true });
      getBatchBreakdown({ clear: true });
      prevTabRef.current = activeTab;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <Layout title="Reports">
      <Container>
        <Card bg="white" text="dark" className="shadow">
          <Card.Body>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
                <Tab eventKey="profit" title="Profit (Last 12 Months)">
                  <ProfitChart data={monthlyStats} selectedTenant={selectedTenant} />
                </Tab>
                <Tab eventKey="payments" title="Payments (Last 12 Months)">
                  <PaymentsChart data={monthlyStats} />
                </Tab>
                <Tab eventKey="grade" title="Grade Breakdown">
                  <GradeBreakdown selectedTenant={selectedTenant} />
                </Tab>
                <Tab eventKey="shift" title="Shift Breakdown">
                  <ShiftBreakdown selectedTenant={selectedTenant} />
                </Tab>
                <Tab eventKey="batch" title="Batch Breakdown">
                  <BatchBreakdown selectedTenant={selectedTenant} />
                </Tab>
                <Tab eventKey="filtered" title="Filtered Reports">
                  <FilteredReportsTab selectedTenant={selectedTenant} />
                </Tab>
              </Tabs>
            )}
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  monthlyStats: state.report?.monthlyStats || [],
  selectedTenant: state.tenant?.selectedTenant,
  loading: state.report?.loading || false,
});

export default connect(mapStateToProps, { 
  getMonthlyStats, 
  getFilteredStats, 
  getGradeBreakdown, 
  getShiftBreakdown, 
  getBatchBreakdown 
})(ReportsPage);



