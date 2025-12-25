import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { AiOutlineHome } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";
import { connect } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../../actions/Dashboard.action";
import styles from "./Layout.module.css";
import { MdPayment, MdSettings } from "react-icons/md";

const Layout = ({ logout, children, title }) => {
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);

  const logoutHandeler = async () => {
    let check = await logout();
    if (check === true) {
      navigate("/");
    }
  };
  return (
    <div>
      <Container fluid>
        <Row className="position-relative">
          <Col
            md={2}
            className={`px-4 ${styles.wrapper} ${show ? styles.active : ""}`}
          >
            <div className="d-flex justify-content-between align-items-center w-100">
              <Link
                to="/"
                className="d-flex align-items-center py-3 text-decoration-none text-dark"
              >
                <span className="d-block fs-4">Payment System</span>
              </Link>
              <div
                className={`${styles.ham}  ms-auto`}
                onClick={() => setShow(!show)}
              >
                <HiMenu />
              </div>
            </div>

            <div className={styles.nav}>
              <NavLink to="/dashboard" className={styles.nav__item}>
                <span className={styles.icon}>
                  <AiOutlineHome />
                </span>
                <span className={styles.nav__item_text}>Dashboard</span>
              </NavLink>
            </div>
            <div className={styles.nav}>
              <NavLink to="/payments" className={styles.nav__item}>
                <span className={styles.icon}>
                  <MdPayment />
                </span>
                <span className={styles.nav__item_text}>Payments</span>
              </NavLink>
            </div>
            <div className={styles.nav}>
              <NavLink to="/payment-entry" className={styles.nav__item}>
                <span className={styles.icon}>
                  <MdPayment />
                </span>
                <span className={styles.nav__item_text}>Payment Entry</span>
              </NavLink>
            </div>
            <div className={styles.nav}>
              <NavLink to="/management" className={styles.nav__item}>
                <span className={styles.icon}>
                  <MdSettings />
                </span>
                <span className={styles.nav__item_text}>Management</span>
              </NavLink>
            </div>

            <div className={styles.nav}>
              <div className={styles.nav__item} onClick={logoutHandeler}>
                <span className={styles.icon}>
                  <FiLogOut />
                </span>
                <span className={styles.nav__item_text}>Logout</span>
              </div>
            </div>
          </Col>
          <Col md={10} className="bg-light">
            <div className="d-flex justify-content-end align-items-center py-3">
              <div
                className={`${styles.ham}  me-auto`}
                onClick={() => setShow(!show)}
              >
                <HiMenu />
              </div>
              {title ? (
                <h3 className="me-auto ps-4 fs-3 my-auto">{title}</h3>
              ) : (
                <></>
              )}
            </div>
            <Container>{children}</Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default connect(null, { logout })(Layout);

