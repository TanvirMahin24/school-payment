import React from "react";
import { Table, Card } from "react-bootstrap";
import { getTenantInstitutionName } from "../../../constants/Tenant";
import styles from "./SchoolPrimaryReport.module.css";

const formatAmount = (n) =>
  (n ?? 0).toLocaleString("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const SchoolPrimaryReport = ({ data, month, year }) => {
  if (!data) return null;

  const {
    school = { income: 0, expense: 0, revenue: 0 },
    primary = { income: 0, expense: 0, revenue: 0 },
    combinedPaymentCount = 0,
  } = data;

  const schoolName = getTenantInstitutionName("school");
  const primaryName = getTenantInstitutionName("primary");
  const totalExpense = school.expense + primary.expense;
  const finalTotal = school.income + primary.income + school.revenue + primary.revenue;

  return (
    <Card className={styles.card}>
      <Card.Body className={styles.report}>
        <div className={styles.header}>
          <h5 className={styles.title}>School and Primary Report</h5>
          <p className={styles.subtitle}>
            {month} {year}
          </p>
        </div>

        <Table bordered striped hover size="sm" className={styles.table}>
          <thead>
            <tr>
              <th>Institution</th>
              <th>Income</th>
              <th>Expense</th>
              <th>Student</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{schoolName}</td>
              <td className={styles.amount}>{formatAmount(school.income)}</td>
              <td className={styles.amount}>{formatAmount(school.expense)}</td>
              <td rowSpan={2} className={styles.amount}>
                {combinedPaymentCount}
              </td>
            </tr>
            <tr>
              <td>{primaryName}</td>
              <td className={styles.amount}>{formatAmount(primary.income)}</td>
              <td className={styles.amount}>{formatAmount(primary.expense)}</td>
            </tr>
          </tbody>
        </Table>

        <div className={styles.revenueSection}>
          <div className={styles.revenueList}>
            <p className={styles.revenueRow}>
              Total Revenue for {schoolName}: <span className={styles.amount}>{formatAmount(school.revenue)}</span>
            </p>
            <p className={styles.revenueRow}>
              Total Revenue for {primaryName}: <span className={styles.amount}>{formatAmount(primary.revenue)}</span>
            </p>
          </div>
          <div className={styles.totalExpense}>
            Total Expense: <span className={styles.amount}>{formatAmount(totalExpense)}</span>
          </div>
        </div>

        <h3 className={styles.finalTotal}>
          Final Total: <span className={styles.amount}>{formatAmount(finalTotal)}</span>
        </h3>
      </Card.Body>
    </Card>
  );
};

export default SchoolPrimaryReport;
