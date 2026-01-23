import React, { useEffect, useState } from "react";
import { Col, Row, Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
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
import MonthDetailModal from "../../components/Reports/MonthDetailModal";
import { months } from "../../constants/MonthsAndYears";
import { BASE_URL } from "../../constants/URL";

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 12 }, (_, i) => currentYear - 10 + i);

const INITIAL_MODAL_STATE = { show: false, type: null, variant: null, periodLabel: "", month: null, year: null, items: [], loading: false };

const DashboardPage = ({ data, getDashboardData, selectedTenant }) => {
  
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedYearly, setSelectedYearly] = useState(new Date().getFullYear());
  const [modalState, setModalState] = useState(INITIAL_MODAL_STATE);

  useEffect(() => {
    if (selectedTenant) {
      getDashboardData(selectedTenant, { month: selectedMonth, year: selectedYear, yearly: selectedYearly });
    }
  }, [selectedTenant, selectedMonth, selectedYear, selectedYearly, getDashboardData]);

  const handleOpenModal = async (type, variant, month, year, periodLabel) => {
    if (!selectedTenant) {
      toast.error("Please select a tenant");
      return;
    }
    setModalState({ show: true, type, variant, periodLabel, month, year, items: [], loading: true });
    const url = type === "expense" ? `${BASE_URL}/api/expense` : `${BASE_URL}/api/revenue`;
    const params = { tenant: selectedTenant };
    if (variant === "monthly" && month && year) {
      params.month = month;
      params.year = year;
    } else if (variant === "yearly" && year) {
      params.year = year;
    }
    try {
      const res = await axios.get(url, { params });
      setModalState((s) => ({ ...s, items: res.data.data, loading: false }));
    } catch (err) {
      toast.error(err.response?.data?.message || `Error fetching ${type}s`);
      setModalState((s) => ({ ...s, loading: false }));
    }
  };

  const handleCloseModal = () => setModalState(INITIAL_MODAL_STATE);
  return (
    <Layout>
      {data ? (
        <>
          {/* Monthly Stats */}
          <Row>
            <Col md={12} className="py-3">
              <Card className="shadow">
                <Card.Header className="d-flex flex-wrap align-items-center gap-2">
                  <h5 className="mb-0 me-2">Month</h5>
                  <Form.Select
                    style={{ width: "auto" }}
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </Form.Select>
                  <Form.Select
                    style={{ width: "auto" }}
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </Form.Select>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={3} className="py-2">
                      <div className="text-center">
                        <div className="text-muted small">Payments</div>
                        <div className="h4 mb-0">{data.thisMonthPaymentAmount || "0.00"}</div>
                        <div className="text-muted small">{data.thisMonthPayments || 0} entries</div>
                      </div>
                    </Col>
                    <Col md={3} className="py-2">
                      <div className="text-center">
                        <div className="text-muted small">Revenue</div>
                        <span
                          role="button"
                          tabIndex={0}
                          className="h4 mb-0 text-success"
                          style={{ cursor: "pointer", textDecoration: "underline" }}
                          onClick={() => handleOpenModal("revenue", "monthly", selectedMonth, selectedYear, `${selectedMonth} ${selectedYear}`)}
                          onKeyDown={(e) => e.key === "Enter" && handleOpenModal("revenue", "monthly", selectedMonth, selectedYear, `${selectedMonth} ${selectedYear}`)}
                        >
                          {data.thisMonthRevenueAmount || "0.00"}
                        </span>
                        <div className="text-muted small">{data.thisMonthRevenues || 0} entries</div>
                      </div>
                    </Col>
                    <Col md={3} className="py-2">
                      <div className="text-center">
                        <div className="text-muted small">Expenses</div>
                        <span
                          role="button"
                          tabIndex={0}
                          className="h4 mb-0 text-danger"
                          style={{ cursor: "pointer", textDecoration: "underline" }}
                          onClick={() => handleOpenModal("expense", "monthly", selectedMonth, selectedYear, `${selectedMonth} ${selectedYear}`)}
                          onKeyDown={(e) => e.key === "Enter" && handleOpenModal("expense", "monthly", selectedMonth, selectedYear, `${selectedMonth} ${selectedYear}`)}
                        >
                          {data.thisMonthExpenseAmount || "0.00"}
                        </span>
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

          {/* Yearly Stats */}
          <Row>
            <Col md={12} className="py-3">
              <Card className="shadow">
                <Card.Header className="d-flex flex-wrap align-items-center gap-2">
                  <h5 className="mb-0 me-2">Year</h5>
                  <Form.Select
                    style={{ width: "auto" }}
                    value={selectedYearly}
                    onChange={(e) => setSelectedYearly(Number(e.target.value))}
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </Form.Select>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={3} className="py-2">
                      <div className="text-center">
                        <div className="text-muted small">Total Payments</div>
                        <div className="h4 mb-0">{data.thisYearPaymentAmount || "0.00"}</div>
                        <div className="text-muted small">{data.thisYearPayments || 0} entries</div>
                      </div>
                    </Col>
                    <Col md={3} className="py-2">
                      <div className="text-center">
                        <div className="text-muted small">Total Revenue</div>
                        <span
                          role="button"
                          tabIndex={0}
                          className="h4 mb-0 text-success"
                          style={{ cursor: "pointer", textDecoration: "underline" }}
                          onClick={() => handleOpenModal("revenue", "yearly", null, selectedYearly, String(selectedYearly))}
                          onKeyDown={(e) => e.key === "Enter" && handleOpenModal("revenue", "yearly", null, selectedYearly, String(selectedYearly))}
                        >
                          {data.thisYearRevenueAmount || "0.00"}
                        </span>
                        <div className="text-muted small">{data.thisYearRevenues || 0} entries</div>
                      </div>
                    </Col>
                    <Col md={3} className="py-2">
                      <div className="text-center">
                        <div className="text-muted small">Total Expenses</div>
                        <span
                          role="button"
                          tabIndex={0}
                          className="h4 mb-0 text-danger"
                          style={{ cursor: "pointer", textDecoration: "underline" }}
                          onClick={() => handleOpenModal("expense", "yearly", null, selectedYearly, String(selectedYearly))}
                          onKeyDown={(e) => e.key === "Enter" && handleOpenModal("expense", "yearly", null, selectedYearly, String(selectedYearly))}
                        >
                          {data.thisYearExpenseAmount || "0.00"}
                        </span>
                        <div className="text-muted small">{data.thisYearExpenses || 0} entries</div>
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

          

          <MonthDetailModal
            show={modalState.show}
            onHide={handleCloseModal}
            type={modalState.type}
            monthLabel={modalState.periodLabel}
            items={modalState.items}
            loading={modalState.loading}
            showMonthColumn={modalState.variant === "yearly"}
          />
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
