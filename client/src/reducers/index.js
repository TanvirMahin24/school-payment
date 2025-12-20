import { combineReducers } from "redux";
import authReducer from "./Auth.reducer";
import paymentReducer from "./Payment.reducer";

const reducer = combineReducers({
  auth: authReducer,
  payment: paymentReducer,
});

export default reducer;

