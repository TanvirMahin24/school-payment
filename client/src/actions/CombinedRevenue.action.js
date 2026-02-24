import axios from "axios";
import { toast } from "react-toastify";
import {
  CREATE_COMBINED_REVENUE,
  GET_COMBINED_REVENUES,
  UPDATE_COMBINED_REVENUE,
  DELETE_COMBINED_REVENUE,
} from "../constants/Type";
import { BASE_URL } from "../constants/URL";

export const getCombinedRevenues = (filters = {}) => async (dispatch) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.month) queryParams.append("month", filters.month);
    if (filters.year) queryParams.append("year", filters.year);

    const queryString = queryParams.toString();
    const url = queryString
      ? `${BASE_URL}/api/combined-revenue?${queryString}`
      : `${BASE_URL}/api/combined-revenue`;

    const res = await axios.get(url);
    dispatch({
      type: GET_COMBINED_REVENUES,
      payload: res.data.data,
    });
  } catch (err) {
    toast.error(err.response?.data?.message || "Error fetching combined revenues");
  }
};

export const createCombinedRevenue = (values) => async (dispatch) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/combined-revenue`, values);
    dispatch({
      type: CREATE_COMBINED_REVENUE,
      payload: res.data.data,
    });
    toast.success("Combined revenue created successfully");
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error creating combined revenue");
    return false;
  }
};

export const updateCombinedRevenue = (id, values) => async (dispatch) => {
  try {
    const res = await axios.patch(`${BASE_URL}/api/combined-revenue/${id}`, values);
    dispatch({
      type: UPDATE_COMBINED_REVENUE,
      payload: res.data.data,
    });
    toast.success("Combined revenue updated successfully");
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error updating combined revenue");
    return false;
  }
};

export const deleteCombinedRevenue = (id) => async (dispatch) => {
  try {
    await axios.delete(`${BASE_URL}/api/combined-revenue/${id}`);
    dispatch({
      type: DELETE_COMBINED_REVENUE,
      payload: id,
    });
    toast.success("Combined revenue deleted successfully");
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error deleting combined revenue");
    return false;
  }
};
