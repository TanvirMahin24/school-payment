import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import {
  AiOutlineUser,
} from "react-icons/ai";
import {
  BsFillDiagram3Fill,
} from "react-icons/bs";
import { HiOutlineUserGroup } from "react-icons/hi";
import { connect } from "react-redux";
import { getDashboardData } from "../../actions/Dashboard.action";
import Layout from "../../components/shared/Layout/Layout";
import StatCard from "../../components/shared/StatCard/StatCard";
import { MdPayment } from "react-icons/md";

const DashboardPage = ({ data, getDashboardData }) => {
  useEffect(() => {
    if (!data) {
      getDashboardData();
    }
  }, []);
  return (
    <Layout>
      {data ? (
        <Row className="pt-0">
          <Col md={3} className="py-3">
            <StatCard
              title="Total Payments"
              icon={<MdPayment />}
              count={data.payments || 0}
            />
          </Col>
          <Col md={3} className="py-3">
            <StatCard
              title="Total Amount"
              icon={<BsFillDiagram3Fill />}
              count={data.totalAmount || 0}
            />
          </Col>

          <Col md={3} className="py-3">
            <StatCard
              title="This Month"
              icon={<HiOutlineUserGroup />}
              count={data.thisMonth || 0}
            />
          </Col>

          <Col md={12} className="py-3">
            <span className="d-block fs-4 border-bottom pt-4">Quick Links</span>
          </Col>
        </Row>
      ) : (
        <></>
      )}
    </Layout>
  );
};
const mapStateToProps = (state) => ({
  data: state.auth.dashboard,
});
export default connect(mapStateToProps, { getDashboardData })(DashboardPage);
