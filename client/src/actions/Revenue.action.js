import axios from "axios";
import { toast } from "react-toastify";
import {
  CREATE_REVENUE,
  GET_REVENUES,
  UPDATE_REVENUE,
  DELETE_REVENUE,
} from "../constants/Type";
import { BASE_URL } from "../constants/URL";

export const getRevenues = (filters = {}) => async (dispatch) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.tenant) queryParams.append("tenant", filters.tenant);
    if (filters.month) queryParams.append("month", filters.month);
    if (filters.year) queryParams.append("year", filters.year);

    const queryString = queryParams.toString();
    const url = queryString
      ? `${BASE_URL}/api/revenue?${queryString}`
      : `${BASE_URL}/api/revenue`;

    const res = await axios.get(url);
    dispatch({
      type: GET_REVENUES,
      payload: res.data.data,
    });
  } catch (err) {
    toast.error(err.response?.data?.message || "Error fetching revenues");
  }
};

export const createRevenue = (values) => async (dispatch) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/revenue`, values);
    dispatch({
      type: CREATE_REVENUE,
      payload: res.data.data,
    });
    toast.success("Revenue created successfully");
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error creating revenue");
    return false;
  }
};

export const updateRevenue = (id, values) => async (dispatch) => {
  try {
    const res = await axios.patch(`${BASE_URL}/api/revenue/${id}`, values);
    dispatch({
      type: UPDATE_REVENUE,
      payload: res.data.data,
    });
    toast.success("Revenue updated successfully");
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error updating revenue");
    return false;
  }
};

export const deleteRevenue = (id) => async (dispatch) => {
  try {
    await axios.delete(`${BASE_URL}/api/revenue/${id}`);
    dispatch({
      type: DELETE_REVENUE,
      payload: id,
    });
    toast.success("Revenue deleted successfully");
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error deleting revenue");
    return false;
  }
};




