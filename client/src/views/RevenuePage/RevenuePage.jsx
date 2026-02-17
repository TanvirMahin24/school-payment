import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
  Table,
  Button,
  Form,
  Card,
} from "react-bootstrap";
import { connect } from "react-redux";
import Layout from "../../components/shared/Layout/Layout";
import ConfirmModal from "../../components/shared/ConfirmModal/ConfirmModal";
import { getRevenues, deleteRevenue } from "../../actions/Revenue.action";
import RevenueEntry from "../../components/RevenueEntry/RevenueEntry";
import { months, years } from "../../constants/MonthsAndYears";
import { FaEdit, FaTrash } from "react-icons/fa";

const RevenuePage = ({
  revenues,
  getRevenues,
  deleteRevenue,
  selectedTenant,
}) => {
  const [showEntry, setShowEntry] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState(null);
  const [revenueToDelete, setRevenueToDelete] = useState(null);
  const [month, setMonth] = useState(months[new Date().getMonth()]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (selectedTenant) {
      loadRevenues();
    }
  }, [selectedTenant, month, year]);

  const loadRevenues = () => {
    const filters = {
      tenant: selectedTenant,
      month,
      year,
    };
    getRevenues(filters);
  };

  const handleAdd = () => {
    setEditingRevenue(null);
    setShowEntry(true);
  };

  const handleEdit = (revenue) => {
    setEditingRevenue(revenue);
    setShowEntry(true);
  };

  const handleDeleteClick = (id) => setRevenueToDelete(id);
  const handleDeleteConfirm = async () => {
    if (revenueToDelete == null) return;
    const success = await deleteRevenue(revenueToDelete);
    if (success) loadRevenues();
  };

  const handleClose = () => {
    setShowEntry(false);
    setEditingRevenue(null);
    loadRevenues();
  };

  const totalAmount =
    revenues?.reduce((sum, rev) => sum + parseFloat(rev.amount || 0), 0) || 0;

  return (
    <Layout title="Revenue Management">
      <Container>
        <Card bg="white" text="dark" className="shadow mb-4">
          <Card.Body>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Year</Form.Label>
                  <Form.Select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Month</Form.Label>
                  <Form.Select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Button variant="primary" onClick={handleAdd}>
                  Add Revenue
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card bg="white" text="dark" className="shadow">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Revenues</h5>
            <div className="fw-bold">Total: {totalAmount.toFixed(2)}</div>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Service Charge</th>
                  <th>Description</th>
                  <th>Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {revenues && revenues.length > 0 ? (
                  revenues.map((revenue) => (
                    <tr key={revenue.id}>
                      <td>
                        {revenue.month} {revenue.year}
                      </td>
                      <td>{revenue.category?.name || "N/A"}</td>
                      <td>{parseFloat(revenue.amount || 0).toFixed(2)}</td>
                      <td>{revenue.description || "-"}</td>
                      <td>{revenue.note || "-"}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(revenue)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(revenue.id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No revenues found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <RevenueEntry
          show={showEntry}
          handleClose={handleClose}
          revenue={editingRevenue}
          selectedTenant={selectedTenant}
        />

        <ConfirmModal
          show={revenueToDelete != null}
          onHide={() => setRevenueToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Revenue"
          message="Are you sure you want to delete this revenue? This action cannot be undone."
        />
      </Container>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  revenues: state.revenue?.revenues || [],
  selectedTenant: state.tenant?.selectedTenant,
});

export default connect(mapStateToProps, { getRevenues, deleteRevenue })(
  RevenuePage,
);
