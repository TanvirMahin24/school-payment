import {
  CREATE_EXPENSE,
  GET_EXPENSES,
  UPDATE_EXPENSE,
  DELETE_EXPENSE,
} from "../constants/Type";

const initialState = {
  expenses: [],
  loading: false,
};

const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EXPENSES:
      return {
        ...state,
        expenses: action.payload,
        loading: false,
      };
    case CREATE_EXPENSE:
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
        loading: false,
      };
    case UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
        loading: false,
      };
    case DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(
          (expense) => expense.id !== action.payload
        ),
        loading: false,
      };
    default:
      return state;
  }
};

export default expenseReducer;




