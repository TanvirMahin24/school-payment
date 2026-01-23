import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Alert } from "react-bootstrap";
import { connect } from "react-redux";
import Layout from "../../components/shared/Layout/Layout";
import PaymentEditForm from "../../components/PaymentEditForm/PaymentEditForm";
import { getPaymentDetails } from "../../actions/Payment.action";

const PaymentEditPage = ({ payment, getPaymentDetails, selectedTenant }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && selectedTenant) {
      setLoading(true);
      setError(null);
      getPaymentDetails(id);
    }
  }, [id, selectedTenant, getPaymentDetails]);

  useEffect(() => {
    if (payment) {
      setLoading(false);
      setError(null);
    }
  }, [payment]);

  // Set a timeout to detect if payment never loads
  useEffect(() => {
    if (loading && id) {
      const timer = setTimeout(() => {
        if (!payment) {
          setLoading(false);
          setError("Payment not found or failed to load");
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, id, payment]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        navigate("/payments");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, navigate]);

  if (loading) {
    return (
      <Layout title="Edit Payment">
        <Container>
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
            <Spinner animation="border" variant="primary" />
          </div>
        </Container>
      </Layout>
    );
  }

  if (error || !payment) {
    return (
      <Layout title="Edit Payment">
        <Container>
          <Alert variant="danger" className="mt-4">
            {error || "Payment not found. Redirecting to payments page..."}
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout title="Edit Payment">
      <Container>
        <PaymentEditForm payment={payment} />
      </Container>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  payment: state.payment?.payment,
  loading: state.payment?.loading || false,
  selectedTenant: state.tenant?.selectedTenant,
});

export default connect(mapStateToProps, { getPaymentDetails })(PaymentEditPage);
