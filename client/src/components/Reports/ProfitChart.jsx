import React, { useMemo } from "react";
import { Card, Table } from "react-bootstrap";
// import Chart from "react-apexcharts";

const ProfitChart = ({ data }) => {
  const totalStats = useMemo(() => {
    if (!data || data.length === 0) return null;
    return data.reduce(
      (acc, d) => ({
        revenue: acc.revenue + parseFloat(d.revenue || 0),
        payment: acc.payment + parseFloat(d.payment || 0),
        expense: acc.expense + parseFloat(d.expense || 0),
        profit: acc.profit + parseFloat(d.profit || 0),
      }),
      { revenue: 0, payment: 0, expense: 0, profit: 0 }
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
  //       id: "profit-chart",
  //       type: "area",
  //       toolbar: {
  //         show: true,
  //       },
  //       zoom: {
  //         enabled: true,
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
  //       text: "Monthly Profit (Last 12 Months)",
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
  //     stroke: {
  //       curve: "smooth",
  //       width: 3,
  //     },
  //     colors: ["#28a745"],
  //     fill: {
  //       type: "gradient",
  //       gradient: {
  //         shadeIntensity: 1,
  //         opacityFrom: 0.7,
  //         opacityTo: 0.3,
  //         stops: [0, 90, 100],
  //       },
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

  return (
    <Card className="border-0">
      <Card.Body>
        <h5 className="mb-3">Monthly Profit (Last 12 Months)</h5>
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
              <th className="text-end">Revenue</th>
              <th className="text-end">Payments</th>
              <th className="text-end">Expense</th>
              <th className="text-end">Profit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, index) => (
              <tr key={index}>
                <td>{d.monthLabel}</td>
                <td className="text-end">{parseFloat(d.revenue || 0).toFixed(2)}</td>
                <td className="text-end">{parseFloat(d.payment || 0).toFixed(2)}</td>
                <td className="text-end">{parseFloat(d.expense || 0).toFixed(2)}</td>
                <td className={`text-end ${parseFloat(d.profit || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                  {parseFloat(d.profit || 0).toFixed(2)}
                </td>
              </tr>
            ))}
            {totalStats && (
              <tr className="table-info fw-bold">
                <td>Total</td>
                <td className="text-end">{totalStats.revenue.toFixed(2)}</td>
                <td className="text-end">{totalStats.payment.toFixed(2)}</td>
                <td className="text-end">{totalStats.expense.toFixed(2)}</td>
                <td className={`text-end ${totalStats.profit >= 0 ? 'text-success' : 'text-danger'}`}>
                  {totalStats.profit.toFixed(2)}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default ProfitChart;
