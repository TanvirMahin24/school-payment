import axios from "axios";
import { toast } from "react-toastify";
import {
  SYNC_ALL_STUDENTS,
  SYNC_RECENT_STUDENTS,
  GET_SYNC_STATUS,
  GET_STUDENT,
} from "../constants/Type";
import { BASE_URL } from "../constants/URL";

// SYNC ALL STUDENTS
export const syncAllStudents = (tenant) => async (dispatch) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/student/sync-all`, {
      tenant,
    });

    dispatch({
      type: SYNC_ALL_STUDENTS,
      payload: res.data.data,
    });

    toast.success(
      `Sync completed: ${res.data.data.created} created, ${res.data.data.updated} updated`
    );
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error syncing all students");
    return { success: false, error: err.message };
  }
};

// SYNC RECENT STUDENTS (Last 48 hours)
export const syncRecentStudents = (tenant) => async (dispatch) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/student/sync-recent`, {
      tenant,
    });

    dispatch({
      type: SYNC_RECENT_STUDENTS,
      payload: res.data.data,
    });

    toast.success(
      `Recent sync completed: ${res.data.data.created} created, ${res.data.data.updated} updated`
    );
    return res.data;
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Error syncing recent students"
    );
    return { success: false, error: err.message };
  }
};

// GET SYNC STATUS
export const getSyncStatus = (tenant) => async (dispatch) => {
  try {
    const url = tenant
      ? `${BASE_URL}/api/student/sync-status?tenant=${tenant}`
      : `${BASE_URL}/api/student/sync-status`;

    const res = await axios.get(url);

    dispatch({
      type: GET_SYNC_STATUS,
      payload: res.data.data,
    });

    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error fetching sync status");
    return null;
  }
};

// GET STUDENT LIST
export const getStudentList = (year, gradeId, shiftId, batchId, tenant) => async (dispatch) => {
  try {
    const queryParams = new URLSearchParams();
    if (year) queryParams.append("year", year);
    if (gradeId) queryParams.append("gradeId", gradeId);
    if (shiftId) queryParams.append("shiftId", shiftId);
    if (batchId) queryParams.append("batchId", batchId);
    if (tenant) queryParams.append("tenant", tenant);

    const queryString = queryParams.toString();
    const url = queryString
      ? `${BASE_URL}/api/student?${queryString}`
      : `${BASE_URL}/api/student`;

    const res = await axios.get(url);

    dispatch({
      type: GET_STUDENT,
      payload: res.data.data,
    });

    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Error fetching students");
    return false;
  }
};

