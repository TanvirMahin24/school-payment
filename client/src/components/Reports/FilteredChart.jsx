import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import Chart from "react-apexcharts";

const FilteredChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No data available</p>
      </div>
    );
  }

  const profitChartData = {
    options: {
      chart: {
        id: "filtered-profit-chart",
        type: "line",
        toolbar: {
          show: true,
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
        text: "Profit",
        align: "center",
        style: {
          fontSize: "16px",
          fontWeight: 600,
        },
      },
      colors: ["#28a745"],
      stroke: {
        curve: "smooth",
        width: 3,
      },
      tooltip: {
        y: {
          formatter: (val) => `${val.toFixed(2)}`,
        },
      },
    },
    series: [
      {
        name: "Profit",
        data: data.map((d) => parseFloat(d.profit || 0)),
      },
    ],
  };

  const expenseRevenueChartData = {
    options: {
      chart: {
        id: "filtered-expense-revenue-chart",
        type: "bar",
        toolbar: {
          show: true,
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
        text: "Expense vs Revenue",
        align: "center",
        style: {
          fontSize: "16px",
          fontWeight: 600,
        },
      },
      colors: ["#dc3545", "#28a745"],
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
        name: "Revenue",
        data: data.map((d) => parseFloat(d.totalRevenue || 0)),
      },
    ],
  };

  return (
    <div>
      <Row>
        <Col md={12} className="mb-4">
          <Card className="border-0">
            <Card.Body>
              <Chart
                options={profitChartData.options}
                series={profitChartData.series}
                type="line"
                height={350}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={12}>
          <Card className="border-0">
            <Card.Body>
              <Chart
                options={expenseRevenueChartData.options}
                series={expenseRevenueChartData.series}
                type="bar"
                height={350}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FilteredChart;

