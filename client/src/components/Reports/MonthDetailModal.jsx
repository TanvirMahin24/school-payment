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
}) => {
  const isDueModal = type === "due";
  const label = type === "expense" ? "Expenses" : isDueModal ? "Due Payments" : "Revenues";
  const title = `${label} for ${monthLabel}`;
  const total = (items || []).reduce(
    (s, i) => s + parseFloat(isDueModal ? i.due_amount || 0 : i.amount || 0),
    0,
  );
  const isEmpty = !loading && (!items || items.length === 0);
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
        {!loading && !isEmpty && (
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
                    <th className="text-end">Service Charge</th>
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
