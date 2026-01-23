import React, { useMemo, useState } from "react";
import { Card, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../constants/URL";
import MonthDetailModal from "./MonthDetailModal";
// import Chart from "react-apexcharts";

const INITIAL_MODAL_STATE = { show: false, type: null, monthLabel: "", items: [], loading: false };

const FilteredChart = ({ data, hasFilter = false, selectedTenant }) => {
  const [modalState, setModalState] = useState(INITIAL_MODAL_STATE);

  const handleOpenModal = async (type, row) => {
    if (!selectedTenant) {
      toast.error("Please select a tenant");
      return;
    }
    setModalState({ show: true, type, monthLabel: row.monthLabel, items: [], loading: true });
    const url = type === "expense" ? `${BASE_URL}/api/expense` : `${BASE_URL}/api/revenue`;
    try {
      const res = await axios.get(url, { params: { tenant: selectedTenant, month: row.month, year: row.year } });
      setModalState((s) => ({ ...s, items: res.data.data, loading: false }));
    } catch (err) {
      toast.error(err.response?.data?.message || `Error fetching ${type}s`);
      setModalState((s) => ({ ...s, loading: false }));
    }
  };

  const handleCloseModal = () => setModalState(INITIAL_MODAL_STATE);

  const totalStats = useMemo(() => {
    if (!data || data.length === 0) return null;
    return data.reduce(
      (acc, d) => ({
        revenue: acc.revenue + parseFloat(d.revenue || 0),
        payment: acc.payment + parseFloat(d.payment || 0),
        extraPayment: acc.extraPayment + parseFloat(d.extraPayment || 0),
        expense: acc.expense + parseFloat(d.expense || 0),
        totalRevenue: acc.totalRevenue + parseFloat(d.totalRevenue || 0),
        profit: acc.profit + parseFloat(d.profit || 0),
      }),
      { revenue: 0, payment: 0, extraPayment: 0, expense: 0, totalRevenue: 0, profit: 0 }
    );
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No data available</p>
      </div>
    );
  }

  // Chart code commented out
  // const profitChartData = {
  //   options: {
  //     chart: {
  //       id: "filtered-profit-chart",
  //       type: "area",
  //       toolbar: {
  //         show: true,
  //       },
  //     },
  //     xaxis: {
  //       categories: data.map((d) => d.monthLabel),
  //       labels: {
  //         rotate: -45,
  //         rotateAlways: false,
  //       },
  //     },
  //     yaxis: {
  //       title: {
  //         text: "Amount",
  //       },
  //       labels: {
  //         formatter: (value) => value.toFixed(2),
  //       },
  //     },
  //     title: {
  //       text: "Profit",
  //       align: "center",
  //       style: {
  //         fontSize: "16px",
  //         fontWeight: 600,
  //       },
  //     },
  //     colors: ["#28a745"],
  //     stroke: {
  //       curve: "smooth",
  //       width: 3,
  //     },
  //     tooltip: {
  //       y: {
  //         formatter: (val) => `${val.toFixed(2)}`,
  //       },
  //     },
  //   },
  //   series: [
  //     {
  //       name: "Profit",
  //       data: data.map((d) => parseFloat(d.profit || 0)),
  //     },
  //   ],
  // };

  // const expenseRevenueChartData = {
  //   options: {
  //     chart: {
  //       id: "filtered-expense-revenue-chart",
  //       type: "area",
  //       toolbar: {
  //         show: true,
  //       },
  //     zoom: {
  //       enabled: true,
  //     },
  //     stacked: false,
  //   },
  //   xaxis: {
  //     categories: data.map((d) => d.monthLabel),
  //     labels: {
  //       rotate: -45,
  //       rotateAlways: false,
  //     },
  //   },
  //   yaxis: {
  //     title: {
  //       text: "Amount",
  //     },
  //     labels: {
  //       formatter: (value) => value.toFixed(2),
  //     },
  //   },
  //   title: {
  //     text: "Expense vs Revenue",
  //     align: "center",
  //     style: {
  //       fontSize: "16px",
  //       fontWeight: 600,
  //     },
  //   },
  //   colors: ["#dc3545", "#28a745"],
  //   stroke: {
  //     curve: "smooth",
  //     width: 3,
  //   },
  //   fill: {
  //     type: "gradient",
  //     gradient: {
  //       shadeIntensity: 1,
  //       opacityFrom: 0.7,
  //       opacityTo: 0.3,
  //       stops: [0, 90, 100],
  //     },
  //   },
  //   legend: {
  //     position: "top",
  //   },
  //   tooltip: {
  //     y: {
  //       formatter: (val) => `${val.toFixed(2)}`,
  //     },
  //   },
  // },
  // series: [
  //   {
  //     name: "Expense",
  //     data: data.map((d) => parseFloat(d.expense || 0)),
  //   },
  //   {
  //     name: "Revenue",
  //     data: data.map((d) => parseFloat(d.totalRevenue || 0)),
  //   },
  // ],
  // };

  return (
    <div>
      <Row>
        <Col md={12} className="mb-4">
          <Card className="border-0">
            <Card.Body>
              <h5 className="mb-3">Profit Breakdown</h5>
              {/* <Chart
                options={profitChartData.options}
                series={profitChartData.series}
                type="area"
                height={350}
              /> */}
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th className="text-end">Payment</th>
                    <th className="text-end">Extra Payment</th>
                    {!hasFilter && <th className="text-end">Revenue</th>}
                    {!hasFilter && <th className="text-end">Expense</th>}
                    <th className="text-end">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((d, index) => (
                    <tr key={index}>
                      <td>{d.monthLabel}</td>
                      <td className="text-end">
                        {parseFloat(d.payment || 0).toFixed(2)}
                      </td>
                      <td className="text-end">
                        {parseFloat(d.extraPayment || 0).toFixed(2)}
                      </td>
                      {!hasFilter && (
                        <td className="text-end">
                          <span
                            role="button"
                            tabIndex={0}
                            className="text-primary"
                            style={{ cursor: "pointer", textDecoration: "underline" }}
                            onClick={() => handleOpenModal("revenue", d)}
                            onKeyDown={(e) => e.key === "Enter" && handleOpenModal("revenue", d)}
                          >
                            {parseFloat(d.revenue || 0).toFixed(2)}
                          </span>
                        </td>
                      )}
                      {!hasFilter && (
                        <td className="text-end">
                          <span
                            role="button"
                            tabIndex={0}
                            className="text-primary"
                            style={{ cursor: "pointer", textDecoration: "underline" }}
                            onClick={() => handleOpenModal("expense", d)}
                            onKeyDown={(e) => e.key === "Enter" && handleOpenModal("expense", d)}
                          >
                            {parseFloat(d.expense || 0).toFixed(2)}
                          </span>
                        </td>
                      )}
                      <td
                        className={`text-end ${
                          parseFloat(d.profit || 0) >= 0
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        {parseFloat(d.profit || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {totalStats && (
                    <tr className="table-info fw-bold">
                      <td>Total</td>
                      <td className="text-end">
                        {totalStats.payment.toFixed(2)}
                      </td>
                      <td className="text-end">
                        {totalStats.extraPayment.toFixed(2)}
                      </td>
                      {!hasFilter && (
                        <td className="text-end">
                          {totalStats.revenue.toFixed(2)}
                        </td>
                      )}
                      {!hasFilter && (
                        <td className="text-end">
                          {totalStats.expense.toFixed(2)}
                        </td>
                      )}
                      <td
                        className={`text-end ${
                          totalStats.profit >= 0
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        {totalStats.profit.toFixed(2)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <MonthDetailModal
        show={modalState.show}
        onHide={handleCloseModal}
        type={modalState.type}
        monthLabel={modalState.monthLabel}
        items={modalState.items}
        loading={modalState.loading}
      />
    </div>
  );
};

export default FilteredChart;
