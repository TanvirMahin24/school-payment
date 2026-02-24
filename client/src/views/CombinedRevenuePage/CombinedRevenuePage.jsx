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
import { getCombinedRevenues, deleteCombinedRevenue } from "../../actions/CombinedRevenue.action";
import CombinedRevenueEntry from "../../components/CombinedRevenueEntry/CombinedRevenueEntry";
import { months, years, getLastMonthAndYear } from "../../constants/MonthsAndYears";
import { FaEdit, FaTrash } from "react-icons/fa";

const CombinedRevenuePage = ({
  combinedRevenues,
  getCombinedRevenues,
  deleteCombinedRevenue,
}) => {
  const { month: defaultMonth, year: defaultYear } = getLastMonthAndYear();
  const [showEntry, setShowEntry] = useState(false);
  const [editingCombinedRevenue, setEditingCombinedRevenue] = useState(null);
  const [combinedRevenueToDelete, setCombinedRevenueToDelete] = useState(null);
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);

  useEffect(() => {
    loadCombinedRevenues();
  }, [month, year]);

  const loadCombinedRevenues = () => {
    getCombinedRevenues({ month, year });
  };

  const handleAdd = () => {
    setEditingCombinedRevenue(null);
    setShowEntry(true);
  };

  const handleEdit = (item) => {
    setEditingCombinedRevenue(item);
    setShowEntry(true);
  };

  const handleDeleteClick = (id) => setCombinedRevenueToDelete(id);
  const handleDeleteConfirm = async () => {
    if (combinedRevenueToDelete == null) return;
    const success = await deleteCombinedRevenue(combinedRevenueToDelete);
    if (success) loadCombinedRevenues();
  };

  const handleClose = () => {
    setShowEntry(false);
    setEditingCombinedRevenue(null);
    loadCombinedRevenues();
  };

  const totalAmount =
    combinedRevenues?.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0) || 0;

  return (
    <Layout title="Combined Revenue Management">
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
                  Add Combined Revenue
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card bg="white" text="dark" className="shadow">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Combined Revenues</h5>
            <div className="fw-bold">Total: {totalAmount.toFixed(2)}</div>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {combinedRevenues && combinedRevenues.length > 0 ? (
                  combinedRevenues.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.month} {item.year}
                      </td>
                      <td>{item.type || "-"}</td>
                      <td>{parseFloat(item.amount || 0).toFixed(2)}</td>
                      <td>{item.description || "-"}</td>
                      <td>{item.note || "-"}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(item)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(item.id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No combined revenues found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <CombinedRevenueEntry
          show={showEntry}
          handleClose={handleClose}
          combinedRevenue={editingCombinedRevenue}
        />

        <ConfirmModal
          show={combinedRevenueToDelete != null}
          onHide={() => setCombinedRevenueToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Combined Revenue"
          message="Are you sure you want to delete this combined revenue? This action cannot be undone."
        />
      </Container>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  combinedRevenues: state.combinedRevenue?.combinedRevenues || [],
});

export default connect(mapStateToProps, {
  getCombinedRevenues,
  deleteCombinedRevenue,
})(CombinedRevenuePage);
