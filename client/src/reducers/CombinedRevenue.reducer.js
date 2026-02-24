import {
  CREATE_COMBINED_REVENUE,
  GET_COMBINED_REVENUES,
  UPDATE_COMBINED_REVENUE,
  DELETE_COMBINED_REVENUE,
} from "../constants/Type";

const initialState = {
  combinedRevenues: [],
  loading: false,
};

const combinedRevenueReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMBINED_REVENUES:
      return {
        ...state,
        combinedRevenues: action.payload,
        loading: false,
      };
    case CREATE_COMBINED_REVENUE:
      return {
        ...state,
        combinedRevenues: [action.payload, ...state.combinedRevenues],
        loading: false,
      };
    case UPDATE_COMBINED_REVENUE:
      return {
        ...state,
        combinedRevenues: state.combinedRevenues.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
        loading: false,
      };
    case DELETE_COMBINED_REVENUE:
      return {
        ...state,
        combinedRevenues: state.combinedRevenues.filter(
          (item) => item.id !== action.payload
        ),
        loading: false,
      };
    default:
      return state;
  }
};

export default combinedRevenueReducer;
