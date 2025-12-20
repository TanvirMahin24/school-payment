import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import Login from "../../components/Login/Login.jsx";

const LoginPage = ({ token }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, []);
  return <>{!token && <Login />}</>;
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
});

export default connect(mapStateToProps, null)(LoginPage);

