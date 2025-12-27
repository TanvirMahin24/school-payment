import { combineReducers } from "redux";
import authReducer from "./Auth.reducer";
import paymentReducer from "./Payment.reducer";
import gradeReducer from "./Grade.reducer";
import studentReducer from "./Student.reducer";
import tenantReducer from "./Tenant.reducer";
import expenseReducer from "./Expense.reducer";
import revenueReducer from "./Revenue.reducer";
import categoryReducer from "./Category.reducer";

const reducer = combineReducers({
  auth: authReducer,
  payment: paymentReducer,
  grade: gradeReducer,
  student: studentReducer,
  tenant: tenantReducer,
  expense: expenseReducer,
  revenue: revenueReducer,
  category: categoryReducer,
});

export default reducer;


