import React from "react";
import { Card } from "react-bootstrap";
import Chart from "react-apexcharts";

const PaymentsChart = ({ data }) => {
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
        id: "payments-chart",
        type: "area",
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
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
        text: "Monthly Payments (Last 12 Months)",
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
      stroke: {
        curve: "smooth",
        width: 3,
      },
      colors: ["#007bff"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `${val.toFixed(2)}`,
        },
      },
    },
    series: [
      {
        name: "Payments",
        data: data.map((d) => parseFloat(d.payment || 0)),
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

export default PaymentsChart;

