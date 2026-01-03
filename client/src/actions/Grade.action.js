import axios from "axios";
import { toast } from "react-toastify";
import { GET_GRADE, SYNC_GRADES } from "../constants/Type";
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

// SYNC GRADES
export const syncGrades = (tenant) => async (dispatch) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/grade/sync`, {
      tenant,
    });

    dispatch({
      type: SYNC_GRADES,
      payload: res.data.data,
    });

    toast.success(
      `Sync completed: ${res.data.data.grades} grades, ${res.data.data.shifts} shifts, ${res.data.data.batches} batches synced`
    );
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error syncing grades");
    return { success: false, error: err.message };
  }
};

