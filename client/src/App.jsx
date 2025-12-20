import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import PrivateOutlet from "./utils/PrivateOutlet.jsx";
import setAuthToken from "./utils/setAuthToken";
import DashboardPage from "./views/DashboardPage/DashboardPage.jsx";
import LoginPage from "./views/LoginPage/LoginPage.jsx";
import LandingPage from "./views/LandingPage/LandingPage.jsx";
import PaymentsPage from "./views/PaymentsPage/PaymentsPage.jsx";

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (localStorage.getItem("token_coaching")) {
      setAuthToken(localStorage.getItem("token_coaching"));
    }
    loadingHandeler();

    return () => {
      setLoading(false);
    };
  }, [loading]);

  const loadingHandeler = () => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  return (
    <>
      {loading ? (
        <div className={`landing_loader`}>
          <span className="d-block text-light fs-4 py-4">Loading...</span>
          <ScaleLoader color={"#f68a3c"} loading={loading} size={150} />
        </div>
      ) : (
        <></>
      )}
      <ToastContainer newestOnTop theme="dark" />
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<PrivateOutlet />}>
            <>
              {/* PRIVATE ROUTES */}
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="payments" element={<PaymentsPage />} />
            </>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

