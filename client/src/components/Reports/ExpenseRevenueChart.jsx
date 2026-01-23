import React, { useMemo, useState } from "react";
import { Card, Table } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../constants/URL";
import MonthDetailModal from "./MonthDetailModal";
// import Chart from "react-apexcharts";

const INITIAL_MODAL_STATE = { show: false, type: null, monthLabel: "", items: [], loading: false };

const ExpenseRevenueChart = ({ data, selectedTenant }) => {
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
        expense: acc.expense + parseFloat(d.expense || 0),
        totalRevenue: acc.totalRevenue + parseFloat(d.totalRevenue || 0),
      }),
      { expense: 0, totalRevenue: 0 }
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
  // const chartData = {
  //   options: {
  //     chart: {
  //       id: "expense-revenue-chart",
  //       type: "area",
  //       toolbar: {
  //         show: true,
  //       },
  //       zoom: {
  //         enabled: true,
  //       },
  //       stacked: false,
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
  //       text: "Expense vs Revenue (Last 12 Months)",
  //       align: "center",
  //       style: {
  //         fontSize: "18px",
  //         fontWeight: 600,
  //       },
  //     },
  //     dataLabels: {
  //       enabled: true,
  //       formatter: (val) => val.toFixed(2),
  //     },
  //     colors: ["#dc3545", "#28a745"],
  //     stroke: {
  //       curve: "smooth",
  //       width: 3,
  //     },
  //     fill: {
  //       type: "gradient",
  //       gradient: {
  //         shadeIntensity: 1,
  //         opacityFrom: 0.7,
  //         opacityTo: 0.3,
  //         stops: [0, 90, 100],
  //       },
  //     },
  //     legend: {
  //       position: "top",
  //     },
  //     tooltip: {
  //       y: {
  //         formatter: (val) => `${val.toFixed(2)}`,
  //       },
  //     },
  //   },
  //   series: [
  //     {
  //       name: "Expense",
  //       data: data.map((d) => parseFloat(d.expense || 0)),
  //     },
  //     {
  //       name: "Revenue (Payments + Revenue)",
  //       data: data.map((d) => parseFloat(d.totalRevenue || 0)),
  //     },
  //   ],
  // };

  return (
    <Card className="border-0">
      <Card.Body>
        <h5 className="mb-3">Expense vs Revenue (Last 12 Months)</h5>
        {/* <Chart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={400}
        /> */}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Month</th>
              <th className="text-end text-danger">Expense</th>
              <th className="text-end text-success">Revenue (Payments + Revenue)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, index) => (
              <tr key={index}>
                <td>{d.monthLabel}</td>
                <td className="text-end text-danger">
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
                <td className="text-end text-success">
                  <span
                    role="button"
                    tabIndex={0}
                    className="text-primary"
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => handleOpenModal("revenue", d)}
                    onKeyDown={(e) => e.key === "Enter" && handleOpenModal("revenue", d)}
                  >
                    {parseFloat(d.totalRevenue || 0).toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
            {totalStats && (
              <tr className="table-info fw-bold">
                <td>Total</td>
                <td className="text-end text-danger">{totalStats.expense.toFixed(2)}</td>
                <td className="text-end text-success">{totalStats.totalRevenue.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
      <MonthDetailModal
        show={modalState.show}
        onHide={handleCloseModal}
        type={modalState.type}
        monthLabel={modalState.monthLabel}
        items={modalState.items}
        loading={modalState.loading}
      />
    </Card>
  );
};

export default ExpenseRevenueChart;

