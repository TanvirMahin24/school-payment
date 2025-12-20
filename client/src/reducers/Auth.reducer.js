import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  AUTH_USER_LOAD,
  DASHBOARD_DATA,
} from "../constants/Type";
import setAuthToken from "../utils/setAuthToken";

const initialState = {
  isAuthenticated: false,
  name: "",
  email: "",
  dashboard: null,
  loading: true,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      localStorage.setItem("token_coaching", action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        name: action.payload.name,
      };
    case DASHBOARD_DATA:
      return {
        ...state,
        dashboard: action.payload,
        loading: false,
      };
    case AUTH_USER_LOAD:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        name: action.payload.name,
        email: action.payload.email,
      };

    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case LOGOUT_FAIL:
      localStorage.removeItem("token_coaching");
      setAuthToken();
      return {
        ...state,
        name: "",
        email: "",
        isAuthenticated: false,
        loading: false,
      };

    default:
      return state;
  }
};

export default authReducer;

