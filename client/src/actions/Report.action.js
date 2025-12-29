import axios from "axios";
import { toast } from "react-toastify";
import { GET_MONTHLY_STATS, GET_FILTERED_STATS } from "../constants/Type";
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

export const getFilteredStats = (filters) => async (dispatch) => {
  try {
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

