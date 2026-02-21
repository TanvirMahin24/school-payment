import React from "react";
import { Table, Card } from "react-bootstrap";
import { getTenantInstitutionName } from "../../../constants/Tenant";
import styles from "./YearlyIncomeReport.module.css";

const formatAmount = (n) =>
  (n ?? 0).toLocaleString("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const YearlyIncomeReport = ({ data, year, tenant }) => {
  if (!data) return null;

  const {
    grades = [],
    monthlyData = [],
    gradeYearlyTotals = {},
    tableGrandTotal = 0,
    revenueByCategory = [],
    revenueGrandTotal = 0,
    finalTotal = 0,
  } = data;

  return (
    <Card className={styles.card}>
      <Card.Body className={styles.report}>
        <div className={styles.header}>
          {tenant && (
            <p className={styles.institutionName}>
              {getTenantInstitutionName(tenant)}
            </p>
          )}
          <h5 className={styles.title}>Yearly Income Report</h5>
          <p className={styles.subtitle}>{year}</p>
        </div>

        <Table bordered striped hover size="sm" className={styles.table}>
          <thead>
            <tr>
              <th>Month</th>
              {grades.map((g) => (
                <th key={g.id}>{g.name}</th>
              ))}
              <th>Total</th>
              <th>Students</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((row) => (
              <tr key={row.month}>
                <td>{row.month}</td>
                {grades.map((grade) => (
                  <td key={grade.id} className={styles.amount}>
                    {formatAmount(row.gradeTotals?.[grade.id])}
                  </td>
                ))}
                <td className={styles.amount}>{formatAmount(row.total)}</td>
                <td className={styles.amount}>{row.totalStudents ?? 0}</td>
              </tr>
            ))}
            <tr className={styles.totalRow}>
              <td>Total</td>
              {grades.map((grade) => (
                <td key={grade.id} className={styles.amount}>
                  {formatAmount(gradeYearlyTotals[grade.id])}
                </td>
              ))}
              <td
                className={`${styles.amount} ${styles.grandTotal}`}
                colSpan={2}
              >
                {formatAmount(tableGrandTotal)}
              </td>
            </tr>
          </tbody>
        </Table>

        {revenueByCategory.length > 0 && (
          <div className={styles.revenueSection}>
            <h6 className={styles.revenueTitle}>Revenue by Category</h6>
            <div className={styles.revenueList}>
              {revenueByCategory.map((r, idx) => (
                <div key={idx} className={styles.revenueRow}>
                  <span>{r.categoryName}</span>
                  <span className={styles.amount}>
                    {formatAmount(r.yearlyTotal)}
                  </span>
                </div>
              ))}
              <div className={`${styles.revenueRow} ${styles.revenueTotal}`}>
                <span>Total Revenue</span>
                <span className={styles.amount}>
                  {formatAmount(revenueGrandTotal)}
                </span>
              </div>
            </div>
            <div className={styles.finalTotal}>
              <span>Final Total</span>
              <span className={styles.amount}>{formatAmount(finalTotal)}</span>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default YearlyIncomeReport;
