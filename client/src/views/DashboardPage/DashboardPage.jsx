import React, { useEffect } from "react";
import { Col, Row, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  MdPayment,
  MdTrendingUp,
  MdTrendingDown,
  MdAccountBalance,
  MdBarChart,
  MdAddCircle,
  MdSettings,
} from "react-icons/md";
import { connect } from "react-redux";
import { getDashboardData } from "../../actions/Dashboard.action";
import Layout from "../../components/shared/Layout/Layout";
import StatCard from "../../components/shared/StatCard/StatCard";

const DashboardPage = ({ data, getDashboardData, selectedTenant }) => {
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardData(selectedTenant);
  }, [selectedTenant, getDashboardData]);

  const quickLinks = [
    { title: "Payment Entry", link: "/payment-entry", icon: <MdAddCircle />, color: "primary" },
    { title: "Payments", link: "/payments", icon: <MdPayment />, color: "info" },
    { title: "Expenses", link: "/expenses", icon: <MdTrendingDown />, color: "danger" },
    { title: "Revenues", link: "/revenues", icon: <MdTrendingUp />, color: "success" },
    { title: "Reports", link: "/reports", icon: <MdBarChart />, color: "warning" },
    { title: "Categories", link: "/categories", icon: <MdSettings />, color: "secondary" },
  ];

  return (
    <Layout>
      {data ? (
        <>
          {/* Summary Cards */}
          <Row className="pt-0">
            <Col md={3} className="py-3">
              <StatCard
                title="Total Payments"
                icon={<MdPayment />}
                count={data.payments || 0}
              />
            </Col>
            <Col md={3} className="py-3">
              <StatCard
                title="Total Revenue"
                icon={<MdTrendingUp />}
                count={data.totalRevenue || "0.00"}
              />
            </Col>
            <Col md={3} className="py-3">
              <StatCard
                title="Total Expenses"
                icon={<MdTrendingDown />}
                count={data.totalExpenseAmount || "0.00"}
              />
            </Col>
            <Col md={3} className="py-3">
              <StatCard
                title="Total Profit"
                icon={<MdAccountBalance />}
                count={data.totalProfit || "0.00"}
              />
            </Col>
          </Row>

          {/* Current Month Stats */}
          <Row>
            <Col md={12} className="py-3">
              <Card className="shadow">
                <Card.Header>
                  <h5 className="mb-0">Current Month ({new Date().toLocaleString("default", { month: "long", year: "numeric" })})</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={3} className="py-2">
                      <div className="text-center">
                        <div className="text-muted small">Payments</div>
                        <div className="h4 mb-0">{data.thisMonthPayments || 0}</div>
                        <div className="text-muted small">{data.thisMonthPaymentAmount || "0.00"}</div>
                      </div>
                    </Col>
                    <Col md={3} className="py-2">
                      <div className="text-center">
                        <div className="text-muted small">Revenue</div>
                        <div className="h4 mb-0 text-success">{data.thisMonthTotalRevenue || "0.00"}</div>
                        <div className="text-muted small">
                          Payments: {data.thisMonthPaymentAmount || "0.00"} + Revenue: {data.thisMonthRevenueAmount || "0.00"}
                        </div>
                      </div>
                    </Col>
                    <Col md={3} className="py-2">
                      <div className="text-center">
                        <div className="text-muted small">Expenses</div>
                        <div className="h4 mb-0 text-danger">{data.thisMonthExpenseAmount || "0.00"}</div>
                        <div className="text-muted small">{data.thisMonthExpenses || 0} entries</div>
                      </div>
                    </Col>
                    <Col md={3} className="py-2">
                      <div className="text-center">
                        <div className="text-muted small">Profit</div>
                        <div className={`h4 mb-0 ${parseFloat(data.thisMonthProfit || 0) >= 0 ? "text-success" : "text-danger"}`}>
                          {data.thisMonthProfit || "0.00"}
                        </div>
                        <div className="text-muted small">Revenue - Expenses</div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Current Year Stats */}
          <Row>
            <Col md={12} className="py-3">
              <Card className="shadow">
                <Card.Header>
                  <h5 className="mb-0">Current Year ({new Date().getFullYear()})</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={3} className="py-2">
                      <div className="text-center">
                        <div className="text-muted small">Total Payments</div>
                        <div className="h4 mb-0">{data.thisYearPayments || 0}</div>
                        <div className="text-muted small">{data.thisYearPaymentAmount || "0.00"}</div>
                      </div>
                    </Col>
                    <Col md={3} className="py-2">
                      <div className="text-center">
                        <div className="text-muted small">Total Revenue</div>
                        <div className="h4 mb-0 text-success">{data.thisYearTotalRevenue || "0.00"}</div>
                        <div className="text-muted small">
                          Payments: {data.thisYearPaymentAmount || "0.00"} + Revenue: {data.thisYearRevenueAmount || "0.00"}
                        </div>
                      </div>
                    </Col>
                    <Col md={3} className="py-2">
                      <div className="text-center">
                        <div className="text-muted small">Total Expenses</div>
                        <div className="h4 mb-0 text-danger">{data.thisYearExpenseAmount || "0.00"}</div>
                        <div className="text-muted small">All entries this year</div>
                      </div>
                    </Col>
                    <Col md={3} className="py-2">
                      <div className="text-center">
                        <div className="text-muted small">Total Profit</div>
                        <div className={`h4 mb-0 ${parseFloat(data.thisYearProfit || 0) >= 0 ? "text-success" : "text-danger"}`}>
                          {data.thisYearProfit || "0.00"}
                        </div>
                        <div className="text-muted small">Year-to-date</div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Quick Links */}
          <Row>
            <Col md={12} className="py-3">
              <Card className="shadow">
                <Card.Header>
                  <h5 className="mb-0">Quick Links</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {quickLinks.map((link, index) => (
                      <Col md={4} sm={6} key={index} className="mb-3">
                        <Button
                          variant={link.color}
                          className="w-100 d-flex align-items-center justify-content-start"
                          onClick={() => navigate(link.link)}
                          style={{ height: "60px" }}
                        >
                          <div className="me-3" style={{ fontSize: "24px" }}>
                            {link.icon}
                          </div>
                          <div className="fw-bold">{link.title}</div>
                        </Button>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <div className="text-center py-5">
          <p className="text-muted">Loading dashboard data...</p>
        </div>
      )}
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  data: state.auth.dashboard,
  selectedTenant: state.tenant?.selectedTenant,
});

export default connect(mapStateToProps, { getDashboardData })(DashboardPage);
