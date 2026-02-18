import { GET_MONTHLY_STATS, GET_FILTERED_STATS, GET_GRADE_BREAKDOWN, GET_SHIFT_BREAKDOWN, GET_BATCH_BREAKDOWN, GET_MONTHLY_INCOME_EXPENSE } from "../constants/Type";

const initialState = {
  monthlyStats: [],
  filteredStats: null,
  gradeBreakdown: null,
  shiftBreakdown: null,
  batchBreakdown: null,
  monthlyIncomeExpense: null,
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
        filteredStats: action.payload === null ? null : (action.payload || []),
        loading: false,
      };
    case GET_GRADE_BREAKDOWN:
      // If isClearing flag is set, we're clearing (set loading to false)
      // If payload is undefined, we're starting to load (set loading to true)
      // Otherwise, we have data (set loading to false)
      if (action.isClearing) {
        return {
          ...state,
          gradeBreakdown: null,
          loading: false,
        };
      }
      if (action.payload === undefined) {
        return {
          ...state,
          loading: true,
        };
      }
      // Data received - ensure it's an array
      const gradeData = Array.isArray(action.payload) ? action.payload : [];
      return {
        ...state,
        gradeBreakdown: gradeData,
        loading: false,
      };
    case GET_SHIFT_BREAKDOWN:
      if (action.isClearing) {
        return {
          ...state,
          shiftBreakdown: null,
          loading: false,
        };
      }
      if (action.payload === undefined) {
        return {
          ...state,
          loading: true,
        };
      }
      // Data received - ensure it's an array
      const shiftData = Array.isArray(action.payload) ? action.payload : [];
      return {
        ...state,
        shiftBreakdown: shiftData,
        loading: false,
      };
    case GET_BATCH_BREAKDOWN:
      if (action.isClearing) {
        return {
          ...state,
          batchBreakdown: null,
          loading: false,
        };
      }
      if (action.payload === undefined) {
        return {
          ...state,
          loading: true,
        };
      }
      // Data received - ensure it's an array
      const batchData = Array.isArray(action.payload) ? action.payload : [];
      return {
        ...state,
        batchBreakdown: batchData,
        loading: false,
      };
    case GET_MONTHLY_INCOME_EXPENSE:
      if (action.isClearing) {
        return {
          ...state,
          monthlyIncomeExpense: null,
          loading: false,
        };
      }
      if (action.payload === undefined) {
        return {
          ...state,
          loading: true,
        };
      }
      return {
        ...state,
        monthlyIncomeExpense: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default reportReducer;



