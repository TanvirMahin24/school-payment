import React from "react";
import { Card } from "react-bootstrap";
import Chart from "react-apexcharts";

const ExpenseRevenueChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No data available</p>
      </div>
    );
  }

  const chartData = {
    options: {
      chart: {
        id: "expense-revenue-chart",
        type: "area",
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
        stacked: false,
      },
      xaxis: {
        categories: data.map((d) => d.monthLabel),
        labels: {
          rotate: -45,
          rotateAlways: false,
        },
      },
      yaxis: {
        title: {
          text: "Amount",
        },
        labels: {
          formatter: (value) => value.toFixed(2),
        },
      },
      title: {
        text: "Expense vs Revenue (Last 12 Months)",
        align: "center",
        style: {
          fontSize: "18px",
          fontWeight: 600,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val.toFixed(2),
      },
      colors: ["#dc3545", "#28a745"],
      stroke: {
        curve: "smooth",
        width: 3,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },
      legend: {
        position: "top",
      },
      tooltip: {
        y: {
          formatter: (val) => `${val.toFixed(2)}`,
        },
      },
    },
    series: [
      {
        name: "Expense",
        data: data.map((d) => parseFloat(d.expense || 0)),
      },
      {
        name: "Revenue (Payments + Revenue)",
        data: data.map((d) => parseFloat(d.totalRevenue || 0)),
      },
    ],
  };

  return (
    <Card className="border-0">
      <Card.Body>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={400}
        />
      </Card.Body>
    </Card>
  );
};

export default ExpenseRevenueChart;

