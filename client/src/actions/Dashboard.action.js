import axios from "axios";
import { toast } from "react-toastify";
import {
  AUTH_USER_LOAD,
  AUTH_USER_LOAD_ERROR,
  DASHBOARD_DATA,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  PROFILE_UPDATE,
  PROFILE_UPDATE_ERROR,
} from "../constants/Type";
import { BASE_URL } from "../constants/URL";
import setAuthToken from "../utils/setAuthToken";

//GET DASHBOARD DATA
export const getDashboardData = (tenant, filters = {}) => async (dispatch) => {
  try {
    const queryParams = new URLSearchParams();
    if (tenant) queryParams.append("tenant", tenant);
    if (filters.month) queryParams.append("month", filters.month);
    if (filters.year != null && filters.year !== "") queryParams.append("year", filters.year);
    if (filters.yearly != null && filters.yearly !== "") queryParams.append("yearly", filters.yearly);

    const queryString = queryParams.toString();
    const url = queryString
      ? `${BASE_URL}/api/dashboard?${queryString}`
      : `${BASE_URL}/api/dashboard`;

    const res = await axios.get(url);
    dispatch({
      type: DASHBOARD_DATA,
      payload: res.data.data,
    });
  } catch (err) {
    toast.error(err.response?.data?.message || "Error fetching dashboard data");
  }
};

// LOGIN ACTION
export const login = (values) => async (dispatch) => {
  let formData = {
    password: values.password,
    email: values.email,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.post(
      `${BASE_URL}/api/login`,
      JSON.stringify(formData),
      config
    );
    setAuthToken(res.data.data.token);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token: res.data.data.token,
        name: res.data.data.name,
        email: res.data.data.email,
      },
    });
    toast.success("Logged in successfully");
    dispatch(authUserAction());
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Login failed");
    dispatch({
      type: LOGIN_FAIL,
    });
    return false;
  }
};

//LOGOUT ACTION
export const logout = () => async (dispatch) => {
  dispatch({
    type: LOGOUT_SUCCESS,
  });
  toast.success("Logout successfully");
  return true;
};

// AUTH USER DATA ACTION
export const authUserAction = () => async (dispatch) => {
  try {
    if (localStorage.getItem("token_coaching")) {
      setAuthToken(localStorage.getItem("token_coaching"));
    } else {
      setAuthToken();
    }

    const res = await axios.get(`${BASE_URL}/api/profile`);

    dispatch({
      type: AUTH_USER_LOAD,
      payload: res.data.data,
    });
    return true;
  } catch (error) {
    dispatch({
      type: AUTH_USER_LOAD_ERROR,
    });
    return false;
  }
};

// UPDATE ACTION
export const updateUserAction = (values) => async (dispatch) => {
  try {
    let data = {
      name: values.name,
      email: values.email,
    };

    if (values.password !== "") {
      data = {
        ...data,
        password: values.password2,
        oldPassword: values.password,
      };
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const res = await axios.patch(
      `${BASE_URL}/api/profile`,
      JSON.stringify(data),
      config
    );

    dispatch({
      type: PROFILE_UPDATE,
      payload: res.data.data,
    });
    dispatch(authUserAction());

    return true;
  } catch (error) {
    dispatch({
      type: PROFILE_UPDATE_ERROR,
    });
    toast.error(error.response?.data?.message || "Update failed");
    return false;
  }
};

