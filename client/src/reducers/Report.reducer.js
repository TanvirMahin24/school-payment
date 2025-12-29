import { GET_MONTHLY_STATS, GET_FILTERED_STATS } from "../constants/Type";

const initialState = {
  monthlyStats: [],
  filteredStats: [],
  loading: false,
};

const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MONTHLY_STATS:
      return {
        ...state,
        monthlyStats: action.payload,
        loading: false,
      };
    case GET_FILTERED_STATS:
      return {
        ...state,
        filteredStats: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default reportReducer;

