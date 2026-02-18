import React from "react";
import { Table, Card } from "react-bootstrap";
import { getTenantInstitutionName } from "../../../constants/Tenant";
import styles from "./MonthlyIncomeExpenseReport.module.css";

const formatAmount = (n) =>
  (n ?? 0).toLocaleString("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const MonthlyIncomeExpenseReport = ({ data, month, year, tenant }) => {
  if (!data) return null;

  const {
    incomeByGrade = [],
    expenses = [],
    revenues = [],
    totalPaymentIncome = 0,
    totalRevenue = 0,
    totalExpense = 0,
    totalStudents = 0,
  } = data;

  const totalIncome = totalPaymentIncome + totalRevenue;

  const incomeDataRows = 3 * incomeByGrade.length;
  const expenseDataRows = expenses.length;
  const maxDataRows = Math.max(incomeDataRows, expenseDataRows);
  const incomePadRows = Math.max(0, maxDataRows - incomeDataRows);
  const expensePadRows = Math.max(0, maxDataRows - expenseDataRows);

  return (
    <Card className={styles.card}>
      <Card.Body className={styles.report}>
        <div className={styles.header}>
          {tenant && (
            <p className={styles.institutionName}>{getTenantInstitutionName(tenant)}</p>
          )}
          <h5 className={styles.title}>Monthly Income & Expense Statement</h5>
          <p className={styles.subtitle}>
            {month} {year}
          </p>
        </div>

        <div className={styles.splitTable}>
          <div className={styles.tableSection}>
            <h6 className={styles.sectionTitle}>Income</h6>
            <Table bordered striped hover size="sm" className={styles.table}>
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Students</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {incomeByGrade.map((row) => (
                  <React.Fragment key={row.gradeId}>
                    <tr>
                      <td rowSpan={3} className={styles.verticalAlign}>
                        {row.gradeName}
                      </td>
                      <td rowSpan={3} className={styles.verticalAlign}>
                        {row.studentCount}
                      </td>
                      <td>Admission Fee</td>
                      <td className={styles.amount}>
                        {formatAmount(row.examFee)}
                      </td>
                      <td rowSpan={3} className={styles.verticalAlign}>
                        {formatAmount(row.total)}
                      </td>
                    </tr>
                    <tr>
                      <td>Service Charge</td>
                      <td className={styles.amount}>
                        {formatAmount(row.serviceCharge)}
                      </td>
                    </tr>
                    <tr>
                      <td>Session Charge</td>
                      <td className={styles.amount}>
                        {formatAmount(row.sessionCharge)}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
                {Array.from({ length: incomePadRows }).map((_, i) => (
                  <tr key={`pad-${i}`} className={styles.emptyRow}>
                    <td colSpan={5}>&nbsp;</td>
                  </tr>
                ))}
                {(incomeByGrade.length > 0 || expenseDataRows > 0) && (
                  <tr className={styles.subtotal}>
                    <td colSpan={1}> Total Students</td>
                    <td colSpan={1}>{totalStudents}</td>
                    <td>Subtotal</td>
                    <td colSpan={2} className={styles.amount}>
                      {formatAmount(totalPaymentIncome)}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            {revenues.length > 0 && (
              <>
                <h6 className={styles.revenueSubtitle}>Revenue Entries</h6>
                <Table
                  bordered
                  striped
                  hover
                  size="sm"
                  className={styles.table}
                >
                  <thead>
                    <tr>
                      <th>Sl</th>
                      <th>Category</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenues.map((rev, idx) => (
                      <tr key={rev.id}>
                        <td>{idx + 1}</td>
                        <td>{rev.categoryName}</td>
                        <td className={styles.amount}>
                          {formatAmount(rev.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </div>

          <div className={styles.tableSection}>
            <h6 className={styles.sectionTitle}>Expense</h6>
            <Table bordered striped hover size="sm" className={styles.table}>
              <thead>
                <tr>
                  <th>Sl</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp, idx) => (
                  <tr key={exp.id}>
                    <td>{idx + 1}</td>
                    <td>{exp.categoryName}</td>
                    <td className={styles.amount}>
                      {formatAmount(exp.amount)}
                    </td>
                  </tr>
                ))}
                {Array.from({ length: expensePadRows }).map((_, i) => (
                  <tr key={`pad-${i}`} className={styles.emptyRow}>
                    <td colSpan={3}>&nbsp;</td>
                  </tr>
                ))}
                {(expenses.length > 0 || incomeDataRows > 0) && (
                  <tr className={styles.subtotal}>
                    <td colSpan={2}>Subtotal</td>
                    <td className={styles.amount}>
                      {formatAmount(totalExpense)}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>

        <div className={styles.totalsRow}>
          <div className={styles.totalBlock}>
            <span className={styles.totalLabel}>Total Income</span>
            <span className={styles.totalValue}>
              {formatAmount(totalIncome)}
            </span>
          </div>
          <div className={styles.totalBlock}>
            <span className={styles.totalLabel}>Total Expense</span>
            <span className={styles.totalValue}>
              {formatAmount(totalExpense)}
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MonthlyIncomeExpenseReport;
