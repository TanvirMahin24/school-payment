import React from "react";
import { Table, Card } from "react-bootstrap";
import { getTenantInstitutionName } from "../../../constants/Tenant";
import styles from "./YearlyExpenseReport.module.css";

const formatAmount = (n) =>
  (n ?? 0).toLocaleString("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const YearlyExpenseReport = ({ data, year, tenant }) => {
  if (!data) return null;

  const {
    categories = [],
    monthlyData = [],
    categoryYearlyTotals = {},
    grandTotal = 0,
  } = data;

  return (
    <Card className={styles.card}>
      <Card.Body className={styles.report}>
        <div className={styles.header}>
          {tenant && (
            <p className={styles.institutionName}>{getTenantInstitutionName(tenant)}</p>
          )}
          <h5 className={styles.title}>Yearly Expense Report</h5>
          <p className={styles.subtitle}>{year}</p>
        </div>

        <Table bordered striped hover size="sm" className={styles.table}>
          <thead>
            <tr>
              <th>Month</th>
              {categories.map((cat) => (
                <th key={cat.id}>{cat.name}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((row) => (
              <tr key={row.month}>
                <td>{row.month}</td>
                {categories.map((cat) => (
                  <td key={cat.id} className={styles.amount}>
                    {formatAmount(row.categoryTotals?.[cat.id])}
                  </td>
                ))}
                <td className={styles.amount}>{formatAmount(row.total)}</td>
              </tr>
            ))}
            <tr className={styles.totalRow}>
              <td>Total</td>
              {categories.map((cat) => (
                <td key={cat.id} className={styles.amount}>
                  {formatAmount(categoryYearlyTotals[cat.id])}
                </td>
              ))}
              <td className={`${styles.amount} ${styles.grandTotal}`}>
                {formatAmount(grandTotal)}
              </td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default YearlyExpenseReport;
