import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { authUserAction } from "../actions/Dashboard.action";
import AuthWrapper from "../components/shared/AuthWrapper/AuthWrapper.jsx";

const PrivateOutlet = ({ auth, authUserAction }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const refFunc = async () => {
      if (auth === null || auth === false) {
        let check = await authUserAction();
        if (check === true) {
          return <Outlet />;
        } else {
          navigate("/login");
        }
      }
    };
    refFunc();
  }, [auth, authUserAction]);
  return auth === null ? (
    <AuthWrapper auth={auth}>
      <Outlet></Outlet>
    </AuthWrapper>
  ) : auth === true ? (
    <AuthWrapper auth={auth}>
      <Outlet></Outlet>
    </AuthWrapper>
  ) : null;
};

const mapStateToProps = (state) => ({
  auth: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { authUserAction })(PrivateOutlet);

