import { GET_GRADE } from "../constants/Type";

const initialState = {
  grade: null,
  loading: true,
};

const gradeReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_GRADE:
      return {
        ...state,
        grade: payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default gradeReducer;

