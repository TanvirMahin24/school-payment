import React, { useEffect } from "react";
import { Col, Container, Row, Button, ButtonGroup } from "react-bootstrap";
import { AiOutlineHome } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";
import { connect } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../../actions/Dashboard.action";
import { setTenant } from "../../../actions/Tenant.action";
import {
  canViewSchoolPrimaryReport,
  getAllowedTenantList,
  getDefaultAllowedTenant,
} from "../../../constants/Tenant";
import styles from "./Layout.module.css";
import {
  MdPayment,
  MdSettings,
  MdBarChart,
  MdAddCircle,
  MdTrendingDown,
  MdTrendingUp,
  MdCategory,
  MdAdminPanelSettings,
  MdReceipt,
  MdAssessment,
  MdSummarize,
  MdBusiness,
  MdAccountBalance,
  MdPendingActions,
} from "react-icons/md";

const Layout = ({ logout, children, title, selectedTenant, permissions, setTenant }) => {
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);
  const allowedTenants = React.useMemo(
    () => getAllowedTenantList(permissions),
    [permissions],
  );
  const canSeeSchoolPrimaryReport = canViewSchoolPrimaryReport(permissions);

  useEffect(() => {
    if (!permissions) {
      return;
    }

    const allowedTenantValues = allowedTenants.map((tenant) => tenant.value);
    const storedTenant = localStorage.getItem("selectedTenant");
    const tenantToValidate = selectedTenant || storedTenant;

    if (tenantToValidate && allowedTenantValues.includes(tenantToValidate)) {
      if (tenantToValidate !== selectedTenant) {
        setTenant(tenantToValidate);
      }
      return;
    }

    setTenant(getDefaultAllowedTenant(permissions));
  }, [allowedTenants, permissions, selectedTenant, setTenant]);

  const logoutHandeler = async () => {
    let check = await logout();
    if (check === true) {
      navigate("/");
    }
  };

  const handleTenantChange = (tenant) => {
    setTenant(tenant);
  };
  return (
    <div>
      {/* Fixed Tenant Selector Header */}
      <div className={styles.tenant_header}>
        <Container fluid>
          <div className={styles.tenant_header_content}>
            {/* <span className={styles.tenant_label}>Select Tenant:</span> */}
            <ButtonGroup className={styles.tenant_buttons}>
              {allowedTenants.map((tenant) => (
                <Button
                  key={tenant.value}
                  variant={
                    selectedTenant === tenant.value
                      ? "primary"
                      : "outline-primary"
                  }
                  size="sm"
                  onClick={() => handleTenantChange(tenant.value)}
                  className={styles.tenant_button}
                >
                  {tenant.label}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </Container>
      </div>

      <Container fluid className={styles.main_container}>
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
              <NavLink to="/reports" className={styles.nav__item}>
                <span className={styles.icon}>
                  <MdBarChart />
                </span>
                <span className={styles.nav__item_text}>Reports</span>
              </NavLink>
            </div>
            <div className={styles.nav}>
              <NavLink to="/income-expense" className={styles.nav__item}>
                <span className={styles.icon}>
                  <MdReceipt />
                </span>
                <span className={styles.nav__item_text}>Income & Expense Statement</span>
              </NavLink>
            </div>
            <div className={styles.nav}>
              <NavLink to="/yearly-expense" className={styles.nav__item}>
                <span className={styles.icon}>
                  <MdAssessment />
                </span>
                <span className={styles.nav__item_text}>Yearly Expense Report</span>
              </NavLink>
            </div>
            <div className={styles.nav}>
              <NavLink to="/yearly-income" className={styles.nav__item}>
                <span className={styles.icon}>
                  <MdSummarize />
                </span>
                <span className={styles.nav__item_text}>Yearly Income Report</span>
              </NavLink>
            </div>
            {canSeeSchoolPrimaryReport && (
              <div className={styles.nav}>
                <NavLink to="/school-primary" className={styles.nav__item}>
                  <span className={styles.icon}>
                    <MdBusiness />
                  </span>
                  <span className={styles.nav__item_text}>School and Primary Report</span>
                </NavLink>
              </div>
            )}
            <div className={styles.nav}>
              <NavLink to="/payments" className={styles.nav__item}>
                <span className={styles.icon}>
                  <MdPayment />
                </span>
                <span className={styles.nav__item_text}>Payments</span>
              </NavLink>
            </div>
            <div className={styles.nav}>
              <NavLink to="/due-payments" className={styles.nav__item}>
                <span className={styles.icon}>
                  <MdPendingActions />
                </span>
                <span className={styles.nav__item_text}>Due Payments</span>
              </NavLink>
            </div>
            <div className={styles.nav}>
              <NavLink to="/payment-entry" className={styles.nav__item}>
                <span className={styles.icon}>
                  <MdAddCircle />
                </span>
                <span className={styles.nav__item_text}>Payment Entry</span>
              </NavLink>
            </div>
            <div className={styles.nav}>
              <NavLink to="/expenses" className={styles.nav__item}>
                <span className={styles.icon}>
                  <MdTrendingDown />
                </span>
                <span className={styles.nav__item_text}>Expenses</span>
              </NavLink>
            </div>
            <div className={styles.nav}>
              <NavLink to="/revenues" className={styles.nav__item}>
                <span className={styles.icon}>
                  <MdTrendingUp />
                </span>
                <span className={styles.nav__item_text}>Revenues</span>
              </NavLink>
            </div>
            <div className={styles.nav}>
              <NavLink to="/combined-revenue" className={styles.nav__item}>
                <span className={styles.icon}>
                  <MdAccountBalance />
                </span>
                <span className={styles.nav__item_text}>Combined Revenue</span>
              </NavLink>
            </div>
            <div className={styles.nav}>
              <NavLink to="/categories" className={styles.nav__item}>
                <span className={styles.icon}>
                  <MdCategory />
                </span>
                <span className={styles.nav__item_text}>Categories</span>
              </NavLink>
            </div>

            <div className={styles.nav}>
              <NavLink to="/management" className={styles.nav__item}>
                <span className={styles.icon}>
                  <MdAdminPanelSettings />
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

const mapStateToProps = (state) => ({
  selectedTenant: state.tenant?.selectedTenant,
  permissions: state.auth?.permissions,
});

export default connect(mapStateToProps, { logout, setTenant })(Layout);
