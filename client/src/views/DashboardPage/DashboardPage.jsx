import React, { useEffect, useState } from "react";
import { Col, Row, Card, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { getDashboardData } from "../../actions/Dashboard.action";
import Layout from "../../components/shared/Layout/Layout";
import MonthDetailModal from "../../components/Reports/MonthDetailModal";
import { months } from "../../constants/MonthsAndYears";
import { BASE_URL } from "../../constants/URL";

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 12 }, (_, i) => currentYear - 10 + i);

const INITIAL_MODAL_STATE = {
  show: false,
  type: null,
  variant: null,
  periodLabel: "",
  month: null,
  year: null,
  items: [],
  loading: false,
};

const DashboardPage = ({ data, getDashboardData, selectedTenant }) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    months[currentDate.getMonth()],
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [modalState, setModalState] = useState(INITIAL_MODAL_STATE);

  const isAllMonths = selectedMonth === "All Months";

  useEffect(() => {
    if (selectedTenant) {
      const filters = isAllMonths
        ? { yearly: selectedYear }
        : { month: selectedMonth, year: selectedYear };
      getDashboardData(selectedTenant, filters);
    }
  }, [selectedTenant, selectedMonth, selectedYear, getDashboardData]);

  const handleOpenModal = async (type, variant, month, year, periodLabel) => {
    if (!selectedTenant) {
      toast.error("Please select a tenant");
      return;
    }
    setModalState({
      show: true,
      type,
      variant,
      periodLabel,
      month,
      year,
      items: [],
      loading: true,
    });
    const url =
      type === "expense"
        ? `${BASE_URL}/api/expense`
        : `${BASE_URL}/api/revenue`;
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

  const getDisplayData = () => {
    if (isAllMonths) {
      return {
        paymentAmount: data.thisYearPaymentAmount || "0.00",
        extraPaymentAmount: data.thisYearExtraPaymentAmount || "0.00",
        examFeeAmount: data.thisYearExamFeeAmount || "0.00",
        payments: data.thisYearPayments || 0,
        revenueAmount: data.thisYearRevenueAmount || "0.00",
        revenues: data.thisYearRevenues || 0,
        expenseAmount: data.thisYearExpenseAmount || "0.00",
        expenses: data.thisYearExpenses || 0,
        profit: data.thisYearProfit || "0.00",
        periodLabel: String(selectedYear),
        variant: "yearly",
      };
    }
    return {
      paymentAmount: data.thisMonthPaymentAmount || "0.00",
      extraPaymentAmount: data.thisMonthExtraPaymentAmount || "0.00",
      examFeeAmount: data.thisMonthExamFeeAmount || "0.00",
      payments: data.thisMonthPayments || 0,
      revenueAmount: data.thisMonthRevenueAmount || "0.00",
      revenues: data.thisMonthRevenues || 0,
      expenseAmount: data.thisMonthExpenseAmount || "0.00",
      expenses: data.thisMonthExpenses || 0,
      profit: data.thisMonthProfit || "0.00",
      periodLabel: `${selectedMonth} ${selectedYear}`,
      variant: "monthly",
    };
  };

  const handleCloseModal = () => setModalState(INITIAL_MODAL_STATE);
  return (
    <Layout>
      {data ? (
        <>
          {/* Unified Stats View */}
          <Row>
            <Col md={12} className="py-3">
              <Card className="shadow">
                <Card.Header className="d-flex flex-wrap align-items-center gap-2">
                  <h5 className="mb-0 me-2">Period</h5>
                  <Form.Select
                    style={{ width: "auto" }}
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Select
                    style={{ width: "auto" }}
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="All Months">All Months</option>
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </Form.Select>
                </Card.Header>
                <Card.Body>
                  {(() => {
                    const displayData = getDisplayData();
                    return (
                      <Row>
                        <Col md={2} className="py-2">
                          <div className="text-center">
                            <div className="text-muted small">
                              {isAllMonths
                                ? "Total Service Charge"
                                : "Service Charge"}
                            </div>
                            <div className="h4 mb-0">
                              {displayData.paymentAmount}
                            </div>
                            <div className="text-muted small">
                              Paid Students {displayData.payments}
                            </div>
                          </div>
                        </Col>
                        <Col md={2} className="py-2">
                          <div className="text-center">
                            <div className="text-muted small">
                              {isAllMonths
                                ? "Total Session Charge/ Extra Cost"
                                : "Session Charge/ Extra Cost"}
                            </div>
                            <div className="h4 mb-0">
                              {displayData.extraPaymentAmount}
                            </div>
                            <div className="text-muted small">
                              Paid Students {displayData.payments}
                            </div>
                          </div>
                        </Col>
                        <Col md={2} className="py-2">
                          <div className="text-center">
                            <div className="text-muted small">
                              {isAllMonths
                                ? "Total Admission Fee/ Exam Fee"
                                : "Admission Fee/ Exam Fee"}
                            </div>
                            <div className="h4 mb-0">
                              {displayData.examFeeAmount}
                            </div>
                            <div className="text-muted small">
                              Paid Students {displayData.payments}
                            </div>
                          </div>
                        </Col>
                        <Col md={2} className="py-2">
                          <div className="text-center">
                            <div className="text-muted small">
                              {isAllMonths ? "Total Revenue" : "Revenue"}
                            </div>
                            <span
                              role="button"
                              tabIndex={0}
                              className="h4 mb-0 text-success"
                              style={{
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              onClick={() =>
                                handleOpenModal(
                                  "revenue",
                                  displayData.variant,
                                  isAllMonths ? null : selectedMonth,
                                  selectedYear,
                                  displayData.periodLabel,
                                )
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                handleOpenModal(
                                  "revenue",
                                  displayData.variant,
                                  isAllMonths ? null : selectedMonth,
                                  selectedYear,
                                  displayData.periodLabel,
                                )
                              }
                            >
                              {displayData.revenueAmount}
                            </span>
                            <div className="text-muted small">
                              {displayData.revenues} entries
                            </div>
                          </div>
                        </Col>
                        <Col md={2} className="py-2">
                          <div className="text-center">
                            <div className="text-muted small">
                              {isAllMonths ? "Total Expenses" : "Expenses"}
                            </div>
                            <span
                              role="button"
                              tabIndex={0}
                              className="h4 mb-0 text-danger"
                              style={{
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              onClick={() =>
                                handleOpenModal(
                                  "expense",
                                  displayData.variant,
                                  isAllMonths ? null : selectedMonth,
                                  selectedYear,
                                  displayData.periodLabel,
                                )
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                handleOpenModal(
                                  "expense",
                                  displayData.variant,
                                  isAllMonths ? null : selectedMonth,
                                  selectedYear,
                                  displayData.periodLabel,
                                )
                              }
                            >
                              {displayData.expenseAmount}
                            </span>
                            <div className="text-muted small">
                              {displayData.expenses} entries
                            </div>
                          </div>
                        </Col>
                        <Col md={2} className="py-2">
                          <div className="text-center">
                            <div className="text-muted small">
                              {isAllMonths ? "Total Profit" : "Profit"}
                            </div>
                            <div
                              className={`h4 mb-0 ${parseFloat(displayData.profit || 0) >= 0 ? "text-success" : "text-danger"}`}
                            >
                              {displayData.profit}
                            </div>
                            <div className="text-muted small">
                              {isAllMonths
                                ? "Year-to-date"
                                : "Revenue - Expenses"}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    );
                  })()}
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
