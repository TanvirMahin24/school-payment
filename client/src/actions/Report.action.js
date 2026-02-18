import axios from "axios";
import { toast } from "react-toastify";
import { GET_MONTHLY_STATS, GET_FILTERED_STATS, GET_GRADE_BREAKDOWN, GET_SHIFT_BREAKDOWN, GET_BATCH_BREAKDOWN, GET_MONTHLY_INCOME_EXPENSE } from "../constants/Type";
import { BASE_URL } from "../constants/URL";

export const getMonthlyStats = (tenant) => async (dispatch) => {
  try {
    const queryParams = new URLSearchParams();
    if (tenant) queryParams.append("tenant", tenant);

    const queryString = queryParams.toString();
    const url = queryString
      ? `${BASE_URL}/api/report/monthly?${queryString}`
      : `${BASE_URL}/api/report/monthly`;

    const res = await axios.get(url);
    dispatch({
      type: GET_MONTHLY_STATS,
      payload: res.data.data,
    });
  } catch (err) {
    toast.error(err.response?.data?.message || "Error fetching monthly stats");
  }
};

export const getFilteredStats = (filters = {}) => async (dispatch) => {
  try {
    // If clear flag is set, just clear filtered stats and return
    if (filters.clear) {
      dispatch({
        type: GET_FILTERED_STATS,
        payload: null,
      });
      return;
    }

    const queryParams = new URLSearchParams();
    if (filters.tenant) queryParams.append("tenant", filters.tenant);
    if (filters.gradeId) queryParams.append("gradeId", filters.gradeId);
    if (filters.shiftId) queryParams.append("shiftId", filters.shiftId);
    if (filters.batchId) queryParams.append("batchId", filters.batchId);
    if (filters.startMonth) queryParams.append("startMonth", filters.startMonth);
    if (filters.startYear) queryParams.append("startYear", filters.startYear);
    if (filters.endMonth) queryParams.append("endMonth", filters.endMonth);
    if (filters.endYear) queryParams.append("endYear", filters.endYear);

    const queryString = queryParams.toString();
    const url = queryString
      ? `${BASE_URL}/api/report/filtered?${queryString}`
      : `${BASE_URL}/api/report/filtered`;

    const res = await axios.get(url);
    dispatch({
      type: GET_FILTERED_STATS,
      payload: res.data.data,
    });
  } catch (err) {
    toast.error(err.response?.data?.message || "Error fetching filtered stats");
  }
};

export const getGradeBreakdown = (filters = {}) => async (dispatch) => {
  try {
    // If clear flag is set, just clear grade breakdown and return
    if (filters.clear) {
      dispatch({
        type: GET_GRADE_BREAKDOWN,
        payload: null,
        isClearing: true,
      });
      return;
    }

    dispatch({ type: GET_GRADE_BREAKDOWN, payload: undefined }); // Set loading
    const queryParams = new URLSearchParams();
    if (filters.tenant) queryParams.append("tenant", filters.tenant);
    if (filters.startMonth) queryParams.append("startMonth", filters.startMonth);
    if (filters.startYear) queryParams.append("startYear", filters.startYear);
    if (filters.endMonth) queryParams.append("endMonth", filters.endMonth);
    if (filters.endYear) queryParams.append("endYear", filters.endYear);

    const queryString = queryParams.toString();
    const url = `${BASE_URL}/api/report/grade-breakdown?${queryString}`;

    const res = await axios.get(url);
    dispatch({
      type: GET_GRADE_BREAKDOWN,
      payload: res.data.data || [],
    });
  } catch (err) {
    toast.error(err.response?.data?.message || "Error fetching grade breakdown");
    dispatch({ type: GET_GRADE_BREAKDOWN, payload: [] });
  }
};

export const getShiftBreakdown = (filters = {}) => async (dispatch) => {
  try {
    // If clear flag is set, just clear shift breakdown and return
    if (filters.clear) {
      dispatch({
        type: GET_SHIFT_BREAKDOWN,
        payload: null,
        isClearing: true,
      });
      return;
    }

    dispatch({ type: GET_SHIFT_BREAKDOWN, payload: undefined }); // Set loading
    const queryParams = new URLSearchParams();
    if (filters.tenant) queryParams.append("tenant", filters.tenant);
    if (filters.startMonth) queryParams.append("startMonth", filters.startMonth);
    if (filters.startYear) queryParams.append("startYear", filters.startYear);
    if (filters.endMonth) queryParams.append("endMonth", filters.endMonth);
    if (filters.endYear) queryParams.append("endYear", filters.endYear);

    const queryString = queryParams.toString();
    const url = `${BASE_URL}/api/report/shift-breakdown?${queryString}`;

    const res = await axios.get(url);
    dispatch({
      type: GET_SHIFT_BREAKDOWN,
      payload: res.data.data || [],
    });
  } catch (err) {
    toast.error(err.response?.data?.message || "Error fetching shift breakdown");
    dispatch({ type: GET_SHIFT_BREAKDOWN, payload: [] });
  }
};

export const getBatchBreakdown = (filters = {}) => async (dispatch) => {
  try {
    // If clear flag is set, just clear batch breakdown and return
    if (filters.clear) {
      dispatch({
        type: GET_BATCH_BREAKDOWN,
        payload: null,
        isClearing: true,
      });
      return;
    }

    dispatch({ type: GET_BATCH_BREAKDOWN, payload: undefined }); // Set loading
    const queryParams = new URLSearchParams();
    if (filters.tenant) queryParams.append("tenant", filters.tenant);
    if (filters.startMonth) queryParams.append("startMonth", filters.startMonth);
    if (filters.startYear) queryParams.append("startYear", filters.startYear);
    if (filters.endMonth) queryParams.append("endMonth", filters.endMonth);
    if (filters.endYear) queryParams.append("endYear", filters.endYear);

    const queryString = queryParams.toString();
    const url = `${BASE_URL}/api/report/batch-breakdown?${queryString}`;

    const res = await axios.get(url);
    dispatch({
      type: GET_BATCH_BREAKDOWN,
      payload: res.data.data || [],
    });
  } catch (err) {
    toast.error(err.response?.data?.message || "Error fetching batch breakdown");
    dispatch({ type: GET_BATCH_BREAKDOWN, payload: [] });
  }
};

export const getMonthlyIncomeExpense = (filters = {}) => async (dispatch) => {
  try {
    if (filters.clear) {
      dispatch({
        type: GET_MONTHLY_INCOME_EXPENSE,
        payload: null,
        isClearing: true,
      });
      return;
    }

    if (!filters.tenant) {
      toast.error("Tenant is required");
      return;
    }

    dispatch({ type: GET_MONTHLY_INCOME_EXPENSE, payload: undefined });
    const queryParams = new URLSearchParams();
    queryParams.append("tenant", filters.tenant);
    if (filters.gradeId) queryParams.append("gradeId", filters.gradeId);
    if (filters.shiftId) queryParams.append("shiftId", filters.shiftId);
    if (filters.batchId) queryParams.append("batchId", filters.batchId);
    if (filters.month) queryParams.append("month", filters.month);
    if (filters.year) queryParams.append("year", filters.year);

    const queryString = queryParams.toString();
    const url = `${BASE_URL}/api/report/income-expense-statement?${queryString}`;

    const res = await axios.get(url);
    dispatch({
      type: GET_MONTHLY_INCOME_EXPENSE,
      payload: res.data.data,
    });
  } catch (err) {
    toast.error(err.response?.data?.message || "Error fetching income and expense statement");
    dispatch({ type: GET_MONTHLY_INCOME_EXPENSE, payload: null });
  }
};



