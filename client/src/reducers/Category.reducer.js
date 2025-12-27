import {
  CREATE_EXPENSE_CATEGORY,
  GET_EXPENSE_CATEGORIES,
  UPDATE_EXPENSE_CATEGORY,
  DELETE_EXPENSE_CATEGORY,
  CREATE_REVENUE_CATEGORY,
  GET_REVENUE_CATEGORIES,
  UPDATE_REVENUE_CATEGORY,
  DELETE_REVENUE_CATEGORY,
} from "../constants/Type";

const initialState = {
  expenseCategories: [],
  revenueCategories: [],
  loading: false,
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EXPENSE_CATEGORIES:
      return {
        ...state,
        expenseCategories: action.payload,
        loading: false,
      };
    case CREATE_EXPENSE_CATEGORY:
      return {
        ...state,
        expenseCategories: [action.payload, ...state.expenseCategories],
        loading: false,
      };
    case UPDATE_EXPENSE_CATEGORY:
      return {
        ...state,
        expenseCategories: state.expenseCategories.map((category) =>
          category.id === action.payload.id ? action.payload : category
        ),
        loading: false,
      };
    case DELETE_EXPENSE_CATEGORY:
      return {
        ...state,
        expenseCategories: state.expenseCategories.filter(
          (category) => category.id !== action.payload
        ),
        loading: false,
      };
    case GET_REVENUE_CATEGORIES:
      return {
        ...state,
        revenueCategories: action.payload,
        loading: false,
      };
    case CREATE_REVENUE_CATEGORY:
      return {
        ...state,
        revenueCategories: [action.payload, ...state.revenueCategories],
        loading: false,
      };
    case UPDATE_REVENUE_CATEGORY:
      return {
        ...state,
        revenueCategories: state.revenueCategories.map((category) =>
          category.id === action.payload.id ? action.payload : category
        ),
        loading: false,
      };
    case DELETE_REVENUE_CATEGORY:
      return {
        ...state,
        revenueCategories: state.revenueCategories.filter(
          (category) => category.id !== action.payload
        ),
        loading: false,
      };
    default:
      return state;
  }
};

export default categoryReducer;


