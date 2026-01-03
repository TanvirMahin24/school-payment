import { GET_GRADE, SYNC_GRADES } from "../constants/Type";

const initialState = {
  grade: null,
  loading: true,
  error: null,
};

const gradeReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_GRADE:
      return {
        ...state,
        grade: payload,
        loading: false,
        error: null,
      };
    case SYNC_GRADES:
      return {
        ...state,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export default gradeReducer;

