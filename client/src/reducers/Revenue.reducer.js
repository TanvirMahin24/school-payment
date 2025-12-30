import {
  CREATE_REVENUE,
  GET_REVENUES,
  UPDATE_REVENUE,
  DELETE_REVENUE,
} from "../constants/Type";

const initialState = {
  revenues: [],
  loading: false,
};

const revenueReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVENUES:
      return {
        ...state,
        revenues: action.payload,
        loading: false,
      };
    case CREATE_REVENUE:
      return {
        ...state,
        revenues: [action.payload, ...state.revenues],
        loading: false,
      };
    case UPDATE_REVENUE:
      return {
        ...state,
        revenues: state.revenues.map((revenue) =>
          revenue.id === action.payload.id ? action.payload : revenue
        ),
        loading: false,
      };
    case DELETE_REVENUE:
      return {
        ...state,
        revenues: state.revenues.filter(
          (revenue) => revenue.id !== action.payload
        ),
        loading: false,
      };
    default:
      return state;
  }
};

export default revenueReducer;




