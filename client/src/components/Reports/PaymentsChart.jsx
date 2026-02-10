import React, { useMemo } from "react";
import { Card, Table } from "react-bootstrap";
// import Chart from "react-apexcharts";

const PaymentsChart = ({ data }) => {
  const totals = useMemo(() => {
    if (!data || data.length === 0) return { payment: 0, extraPayment: 0, examPayment: 0, total: 0 };
    return data.reduce(
      (acc, d) => ({
        payment: acc.payment + parseFloat(d.payment || 0),
        extraPayment: acc.extraPayment + parseFloat(d.extraPayment || 0),
        examPayment: acc.examPayment + parseFloat(d.examPayment || 0),
        total: acc.total + parseFloat(d.payment || 0) + parseFloat(d.extraPayment || 0) + parseFloat(d.examPayment || 0),
      }),
      { payment: 0, extraPayment: 0, examPayment: 0, total: 0 }
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
  //       id: "payments-chart",
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
  //       text: "Monthly Payments (Last 12 Months)",
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
  //     colors: ["#007bff"],
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
  //       name: "Payments",
  //       data: data.map((d) => parseFloat(d.payment || 0)),
  //     },
  //   ],
  // };

  return (
    <Card className="border-0">
      <Card.Body>
        <h5 className="mb-3">Monthly Payments (Last 12 Months)</h5>
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
              <th className="text-end">Payment</th>
              <th className="text-end">Extra Payment</th>
              <th className="text-end">Exam Fee</th>
              <th className="text-end">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, index) => (
              <tr key={index}>
                <td>{d.monthLabel}</td>
                <td className="text-end">{parseFloat(d.payment || 0).toFixed(2)}</td>
                <td className="text-end">{parseFloat(d.extraPayment || 0).toFixed(2)}</td>
                <td className="text-end">{parseFloat(d.examPayment || 0).toFixed(2)}</td>
                <td className="text-end">
                  {(parseFloat(d.payment || 0) + parseFloat(d.extraPayment || 0) + parseFloat(d.examPayment || 0)).toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="table-info fw-bold">
              <td>Total</td>
              <td className="text-end">{totals.payment.toFixed(2)}</td>
              <td className="text-end">{totals.extraPayment.toFixed(2)}</td>
              <td className="text-end">{totals.examPayment.toFixed(2)}</td>
              <td className="text-end">{totals.total.toFixed(2)}</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default PaymentsChart;

