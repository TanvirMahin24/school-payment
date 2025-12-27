import axios from "axios";
import { toast } from "react-toastify";
import {
  CREATE_EXPENSE_CATEGORY,
  GET_EXPENSE_CATEGORIES,
  UPDATE_EXPENSE_CATEGORY,
  DELETE_EXPENSE_CATEGORY,
  CREATE_REVENUE_CATEGORY,
  GET_REVENUE_CATEGORIES,
  UPDATE_REVENUE_CATEGORY,
  DELETE_REVENUE_CATEGORY,
} from "../constants/Type";
import { BASE_URL } from "../constants/URL";

// Expense Categories
export const getExpenseCategories = (tenant) => async (dispatch) => {
  try {
    const queryParams = new URLSearchParams();
    if (tenant) queryParams.append("tenant", tenant);

    const queryString = queryParams.toString();
    const url = queryString
      ? `${BASE_URL}/api/expense-category?${queryString}`
      : `${BASE_URL}/api/expense-category`;

    const res = await axios.get(url);
    dispatch({
      type: GET_EXPENSE_CATEGORIES,
      payload: res.data.data,
    });
  } catch (err) {
    toast.error(err.response?.data?.message || "Error fetching expense categories");
  }
};

export const createExpenseCategory = (values) => async (dispatch) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/expense-category`, values);
    dispatch({
      type: CREATE_EXPENSE_CATEGORY,
      payload: res.data.data,
    });
    toast.success("Expense category created successfully");
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error creating expense category");
    return false;
  }
};

export const updateExpenseCategory = (id, values) => async (dispatch) => {
  try {
    const res = await axios.patch(`${BASE_URL}/api/expense-category/${id}`, values);
    dispatch({
      type: UPDATE_EXPENSE_CATEGORY,
      payload: res.data.data,
    });
    toast.success("Expense category updated successfully");
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error updating expense category");
    return false;
  }
};

export const deleteExpenseCategory = (id) => async (dispatch) => {
  try {
    await axios.delete(`${BASE_URL}/api/expense-category/${id}`);
    dispatch({
      type: DELETE_EXPENSE_CATEGORY,
      payload: id,
    });
    toast.success("Expense category deleted successfully");
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error deleting expense category");
    return false;
  }
};

// Revenue Categories
export const getRevenueCategories = (tenant) => async (dispatch) => {
  try {
    const queryParams = new URLSearchParams();
    if (tenant) queryParams.append("tenant", tenant);

    const queryString = queryParams.toString();
    const url = queryString
      ? `${BASE_URL}/api/revenue-category?${queryString}`
      : `${BASE_URL}/api/revenue-category`;

    const res = await axios.get(url);
    dispatch({
      type: GET_REVENUE_CATEGORIES,
      payload: res.data.data,
    });
  } catch (err) {
    toast.error(err.response?.data?.message || "Error fetching revenue categories");
  }
};

export const createRevenueCategory = (values) => async (dispatch) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/revenue-category`, values);
    dispatch({
      type: CREATE_REVENUE_CATEGORY,
      payload: res.data.data,
    });
    toast.success("Revenue category created successfully");
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error creating revenue category");
    return false;
  }
};

export const updateRevenueCategory = (id, values) => async (dispatch) => {
  try {
    const res = await axios.patch(`${BASE_URL}/api/revenue-category/${id}`, values);
    dispatch({
      type: UPDATE_REVENUE_CATEGORY,
      payload: res.data.data,
    });
    toast.success("Revenue category updated successfully");
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error updating revenue category");
    return false;
  }
};

export const deleteRevenueCategory = (id) => async (dispatch) => {
  try {
    await axios.delete(`${BASE_URL}/api/revenue-category/${id}`);
    dispatch({
      type: DELETE_REVENUE_CATEGORY,
      payload: id,
    });
    toast.success("Revenue category deleted successfully");
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error deleting revenue category");
    return false;
  }
};


