import React, { useEffect, useState } from "react";
import { Container, Card, Tabs, Tab, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import Layout from "../../components/shared/Layout/Layout";
import { getMonthlyStats } from "../../actions/Report.action";
import ProfitChart from "../../components/Reports/ProfitChart";
import ExpenseRevenueChart from "../../components/Reports/ExpenseRevenueChart";
import PaymentsChart from "../../components/Reports/PaymentsChart";
import FilteredReportsTab from "../../components/Reports/FilteredReportsTab";

const ReportsPage = ({ monthlyStats, getMonthlyStats, selectedTenant, loading }) => {
  const [activeTab, setActiveTab] = useState("profit");

  useEffect(() => {
    if (selectedTenant) {
      getMonthlyStats(selectedTenant);
    }
  }, [selectedTenant, getMonthlyStats]);

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
                  <ProfitChart data={monthlyStats} />
                </Tab>
                <Tab eventKey="expense-revenue" title="Expense vs Revenue">
                  <ExpenseRevenueChart data={monthlyStats} />
                </Tab>
                <Tab eventKey="payments" title="Payments (Last 12 Months)">
                  <PaymentsChart data={monthlyStats} />
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

export default connect(mapStateToProps, { getMonthlyStats })(ReportsPage);

