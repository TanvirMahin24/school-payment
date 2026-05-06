import {
  CREATE_PAYMENT,
  DELETE_PAYMENT,
  GET_PAYMENT_DETAILS,
  UPDATE_PAYMENT,
  GET_PAYMENT,
  GET_DUE_PAYMENTS,
  CLEAR_DUE_PAYMENT,
} from "../constants/Type";

const initialState = {
  payments: [],
  duePayments: [],
  payment: null,
  loading: false,
};

const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PAYMENT:
      return {
        ...state,
        payments: action.payload,
        loading: false,
      };
    case GET_DUE_PAYMENTS:
      return {
        ...state,
        duePayments: action.payload,
        loading: false,
      };
    case GET_PAYMENT_DETAILS:
      return {
        ...state,
        payment: action.payload,
        loading: false,
      };
    case CREATE_PAYMENT:
      return {
        ...state,
        payments: [action.payload, ...state.payments],
        loading: false,
      };
    case UPDATE_PAYMENT:
      return {
        ...state,
        payments: state.payments.map((payment) =>
          payment.id === action.payload.id ? action.payload : payment
        ),
        loading: false,
      };
    case DELETE_PAYMENT:
      return {
        ...state,
        payments: state.payments.filter(
          (payment) => payment.id !== action.payload
        ),
        loading: false,
      };
    case CLEAR_DUE_PAYMENT:
      return {
        ...state,
        duePayments: state.duePayments.filter(
          (payment) => payment.id !== action.payload
        ),
        loading: false,
      };
    default:
      return state;
  }
};

export default paymentReducer;

