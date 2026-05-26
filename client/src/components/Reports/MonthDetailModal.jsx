import React from "react";
import { Button, Modal, Spinner, Table } from "react-bootstrap";

const MonthDetailModal = ({
  show,
  onHide,
  type,
  monthLabel,
  items,
  loading,
  showMonthColumn = false,
  detailData = null,
}) => {
  const isDueModal = type === "due";
  const isCombinedIncomeModal = type === "combined-income";
  const label = isCombinedIncomeModal
    ? "Combined Income"
    : type === "expense"
      ? "Expenses"
      : isDueModal
        ? "Due Payments"
        : "Revenues";
  const title = `${label} for ${monthLabel}`;
  const total = (items || []).reduce(
    (s, i) => s + parseFloat(isDueModal ? i.due_amount || 0 : i.amount || 0),
    0,
  );
  const isEmpty = !loading && (
    isCombinedIncomeModal
      ? !detailData
      : (!items || items.length === 0)
  );
  const totalColSpan = isDueModal
    ? showMonthColumn
      ? 4
      : 3
    : showMonthColumn
      ? 3
      : 2;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="d-flex justify-content-center align-items-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        )}
        {!loading && isEmpty && (
          <p className="text-muted mb-0">
            No {label.toLowerCase()} for this period.
          </p>
        )}
        {!loading && isCombinedIncomeModal && detailData && (
          <>
            <Table striped bordered hover responsive className="mb-4">
              <thead>
                <tr>
                  <th>Income Source</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Service Charge</td>
                  <td className="text-end">
                    {parseFloat(detailData.paymentSummary?.payment || 0).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td>Session Charge / Extra Cost</td>
                  <td className="text-end">
                    {parseFloat(detailData.paymentSummary?.extraPayment || 0).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td>Admission Fee / Exam Fee</td>
                  <td className="text-end">
                    {parseFloat(detailData.paymentSummary?.examPayment || 0).toFixed(2)}
                  </td>
                </tr>
                <tr className="table-info fw-bold">
                  <td>Payment-Derived Income</td>
                  <td className="text-end">
                    {parseFloat(detailData.paymentSummary?.totalPaymentIncome || 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </Table>

            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {detailData.revenueEntries?.length > 0 ? (
                  detailData.revenueEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.description || entry.note || "—"}</td>
                      <td>{entry.categoryName || "—"}</td>
                      <td className="text-end">
                        {parseFloat(entry.amount || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-muted">
                      No manual revenue entries for this period.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="table-info fw-bold">
                  <td colSpan={2}>Total Income</td>
                  <td className="text-end">
                    {parseFloat(detailData.totalIncome || 0).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </Table>
          </>
        )}
        {!loading && !isEmpty && !isCombinedIncomeModal && (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {showMonthColumn && <th>Month</th>}
                {isDueModal ? (
                  <>
                    <th>Roll</th>
                    <th>Student Name</th>
                    <th>Note</th>
                    <th className="text-end">Due Amount</th>
                  </>
                ) : (
                  <>
                    <th>Description</th>
                    <th>Category</th>
                    <th className="text-end">Amount</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {showMonthColumn && <td>{item.month || "—"}</td>}
                  {isDueModal ? (
                    <>
                      <td>{item.student?.uid || item.userId || "—"}</td>
                      <td>{item.student?.name || "—"}</td>
                      <td>{item.note || "—"}</td>
                      <td className="text-end">
                        {parseFloat(item.due_amount || 0).toFixed(2)}
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.description || item.note || "—"}</td>
                      <td>{item.category?.name || "—"}</td>
                      <td className="text-end">
                        {parseFloat(item.amount || 0).toFixed(2)}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="table-info fw-bold">
                <td colSpan={totalColSpan}>Total</td>
                <td className="text-end">{total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </Table>
        )}
        {!loading && isEmpty && (
          <p className="text-end fw-bold mb-0 mt-2">Total: 0.00</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MonthDetailModal;
