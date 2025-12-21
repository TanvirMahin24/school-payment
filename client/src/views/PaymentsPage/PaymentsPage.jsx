import React, { useEffect } from "react";
import { Col, Container, Row, Table, Button } from "react-bootstrap";
import { connect } from "react-redux";
import Layout from "../../components/shared/Layout/Layout";
import { getPayments } from "../../actions/Payment.action";
import { useNavigate } from "react-router-dom";

const PaymentsPage = ({ payments, getPayments, loading }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!payments || payments.length === 0) {
      getPayments();
    }
  }, []);

  return (
    <Layout title="Payments">
      <Container>
        <Row className="mb-3">
          <Col>
            <Button
              variant="primary"
              onClick={() => navigate("/payments/add")}
            >
              Add Payment
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            {loading ? (
              <div className="text-center py-5">Loading...</div>
            ) : payments && payments.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Month</th>
                    <th>User</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.id}</td>
                      <td>${payment.amount}</td>
                      <td>{payment.month}</td>
                      <td>
                        {payment.user ? payment.user.name : `User ${payment.userId}`}
                      </td>
                      <td>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/payments/${payment.id}/edit`)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            // Handle delete
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-5">
                <p>No payments found. Add your first payment!</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  payments: state.payment.payments,
  loading: state.payment.loading,
});

export default connect(mapStateToProps, { getPayments })(PaymentsPage);


