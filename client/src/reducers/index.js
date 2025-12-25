import { combineReducers } from "redux";
import authReducer from "./Auth.reducer";
import paymentReducer from "./Payment.reducer";
import gradeReducer from "./Grade.reducer";
import studentReducer from "./Student.reducer";

const reducer = combineReducers({
  auth: authReducer,
  payment: paymentReducer,
  grade: gradeReducer,
  student: studentReducer,
});

export default reducer;


