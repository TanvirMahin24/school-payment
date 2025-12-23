import axios from "axios";
import { toast } from "react-toastify";
import {
  CREATE_PAYMENT,
  DELETE_PAYMENT,
  GET_PAYMENT_DETAILS,
  UPDATE_PAYMENT,
  GET_PAYMENT,
} from "../constants/Type";
import { BASE_URL } from "../constants/URL";

// GET PAYMENT LIST
export const getPayments = (filters = {}) => async (dispatch) => {
  try {
    // If clear flag is set, just clear payments and return
    if (filters.clear) {
      dispatch({
        type: GET_PAYMENT,
        payload: [],
      });
      return;
    }

    // Build query string from filters
    const queryParams = new URLSearchParams();
    if (filters.tenant) queryParams.append("tenant", filters.tenant);
    if (filters.year) queryParams.append("year", filters.year);
    if (filters.gradeId) queryParams.append("gradeId", filters.gradeId);
    if (filters.shiftId) queryParams.append("shiftId", filters.shiftId);
    if (filters.batchId) queryParams.append("batchId", filters.batchId);

    const queryString = queryParams.toString();
    const url = queryString 
      ? `${BASE_URL}/api/payment?${queryString}`
      : `${BASE_URL}/api/payment`;

    const res = await axios.get(url);
    dispatch({
      type: GET_PAYMENT,
      payload: res.data.data,
    });
  } catch (err) {
    toast.error(err.response?.data?.message || "Error fetching payments");
  }
};

// CREATE PAYMENT
export const createPayment = (values) => async (dispatch) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/payment`, values);
    dispatch({
      type: CREATE_PAYMENT,
      payload: res.data.data,
    });
    toast.success("Payment created successfully");
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error creating payment");
    return false;
  }
};

// UPDATE PAYMENT
export const updatePayment = (id, values) => async (dispatch) => {
  try {
    const res = await axios.patch(`${BASE_URL}/api/payment/${id}`, values);
    dispatch({
      type: UPDATE_PAYMENT,
      payload: res.data.data,
    });
    toast.success("Payment updated successfully");
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error updating payment");
    return false;
  }
};

// DELETE PAYMENT
export const deletePayment = (id) => async (dispatch) => {
  try {
    await axios.delete(`${BASE_URL}/api/payment/${id}`);
    dispatch({
      type: DELETE_PAYMENT,
      payload: id,
    });
    toast.success("Payment deleted successfully");
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error deleting payment");
    return false;
  }
};

// GET PAYMENT DETAILS
export const getPaymentDetails = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/payment/${id}`);
    dispatch({
      type: GET_PAYMENT_DETAILS,
      payload: res.data.data,
    });
  } catch (err) {
    toast.error(err.response?.data?.message || "Error fetching payment details");
  }
};


