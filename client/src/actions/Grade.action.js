import axios from "axios";
import { toast } from "react-toastify";
import { GET_GRADE } from "../constants/Type";
import { BASE_URL } from "../constants/URL";

// GET GRADE LIST
export const getGradeList = (tenant) => async (dispatch) => {
  try {
    const url = tenant 
      ? `${BASE_URL}/api/grade?tenant=${tenant}`
      : `${BASE_URL}/api/grade`;
    
    const res = await axios.get(url);
    
    dispatch({
      type: GET_GRADE,
      payload: res.data.data,
    });
  } catch (err) {
    toast.error(err.response?.data?.message || "Error fetching grades");
  }
};

