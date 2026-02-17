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
  const label = type === "expense" ? "Expenses" : "Revenues";
  const title = `${label} for ${monthLabel}`;
  const total = (items || []).reduce(
    (s, i) => s + parseFloat(i.amount || 0),
    0,
  );
  const isEmpty = !loading && (!items || items.length === 0);
  const totalColSpan = showMonthColumn ? 3 : 2;

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
            No {label.toLowerCase()} for this month.
          </p>
        )}
        {!loading && !isEmpty && (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {showMonthColumn && <th>Month</th>}
                <th>Description</th>
                <th>Category</th>
                <th className="text-end">Service Charge</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {showMonthColumn && <td>{item.month || "—"}</td>}
                  <td>{item.description || item.note || "—"}</td>
                  <td>{item.category?.name || "—"}</td>
                  <td className="text-end">
                    {parseFloat(item.amount || 0).toFixed(2)}
                  </td>
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
