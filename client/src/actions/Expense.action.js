import axios from "axios";
import { toast } from "react-toastify";
import {
  CREATE_EXPENSE,
  GET_EXPENSES,
  UPDATE_EXPENSE,
  DELETE_EXPENSE,
} from "../constants/Type";
import { BASE_URL } from "../constants/URL";

export const getExpenses = (filters = {}) => async (dispatch) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.tenant) queryParams.append("tenant", filters.tenant);
    if (filters.month) queryParams.append("month", filters.month);
    if (filters.year) queryParams.append("year", filters.year);

    const queryString = queryParams.toString();
    const url = queryString
      ? `${BASE_URL}/api/expense?${queryString}`
      : `${BASE_URL}/api/expense`;

    const res = await axios.get(url);
    dispatch({
      type: GET_EXPENSES,
      payload: res.data.data,
    });
  } catch (err) {
    toast.error(err.response?.data?.message || "Error fetching expenses");
  }
};

export const createExpense = (values) => async (dispatch) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/expense`, values);
    dispatch({
      type: CREATE_EXPENSE,
      payload: res.data.data,
    });
    toast.success("Expense created successfully");
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error creating expense");
    return false;
  }
};

export const updateExpense = (id, values) => async (dispatch) => {
  try {
    const res = await axios.patch(`${BASE_URL}/api/expense/${id}`, values);
    dispatch({
      type: UPDATE_EXPENSE,
      payload: res.data.data,
    });
    toast.success("Expense updated successfully");
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error updating expense");
    return false;
  }
};

export const deleteExpense = (id) => async (dispatch) => {
  try {
    await axios.delete(`${BASE_URL}/api/expense/${id}`);
    dispatch({
      type: DELETE_EXPENSE,
      payload: id,
    });
    toast.success("Expense deleted successfully");
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error deleting expense");
    return false;
  }
};


