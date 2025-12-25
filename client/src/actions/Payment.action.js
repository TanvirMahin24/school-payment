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

// GET PAYMENTS BY STUDENTS
export const getPaymentsByStudents = async (filters) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.tenant) queryParams.append("tenant", filters.tenant);
    if (filters.year) queryParams.append("year", filters.year);
    if (filters.gradeId) queryParams.append("gradeId", filters.gradeId);
    if (filters.shiftId) queryParams.append("shiftId", filters.shiftId);
    if (filters.batchId) queryParams.append("batchId", filters.batchId);
    if (filters.month) queryParams.append("month", filters.month);
    if (filters.studentIds) {
      // If array, join with comma; if string, use as is
      const studentIds = Array.isArray(filters.studentIds)
        ? filters.studentIds.join(",")
        : filters.studentIds;
      queryParams.append("studentIds", studentIds);
    }

    const queryString = queryParams.toString();
    const url = `${BASE_URL}/api/payment/by-students?${queryString}`;

    const res = await axios.get(url);
    return res.data.data; // Returns a map of userId to payment
  } catch (err) {
    console.error("Error fetching payments by students:", err);
    return {};
  }
};

// CREATE MULTIPLE PAYMENTS - Submit payments in bulk (create or update)
export const createPayments = async (paymentsArray) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/payment/create-bulk`,
      { payments: paymentsArray },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      // Map the results to include status for each student
      const results = {
        successful: [],
        failed: [],
        statusMap: {}, // Map userId to status (created/updated)
      };

      // Process created payments
      response.data.data.results.created.forEach((item) => {
        const payment = paymentsArray.find((p) => p.userId === item.userId);
        results.successful.push({
          studentId: payment?.meta?.studentId || item.userId,
          studentName: payment?.meta?.studentName || `Student ${item.userId}`,
          status: "created",
          data: item.data,
        });
        results.statusMap[item.userId] = "created";
      });

      // Process updated payments
      response.data.data.results.updated.forEach((item) => {
        const payment = paymentsArray.find((p) => p.userId === item.userId);
        results.successful.push({
          studentId: payment?.meta?.studentId || item.userId,
          studentName: payment?.meta?.studentName || `Student ${item.userId}`,
          status: "updated",
          data: item.data,
        });
        results.statusMap[item.userId] = "updated";
      });

      // Process failed payments
      response.data.data.results.failed.forEach((item) => {
        const payment = paymentsArray.find((p) => p.userId === item.userId);
        results.failed.push({
          studentId: payment?.meta?.studentId || item.userId,
          studentName: payment?.meta?.studentName || `Student ${item.userId}`,
          error: item.error,
        });
        results.statusMap[item.userId] = "failed";
      });

      return results;
    } else {
      return {
        successful: [],
        failed: paymentsArray.map((p) => ({
          studentId: p.meta?.studentId,
          studentName: p.meta?.studentName,
          error: response.data.message || "Bulk payment creation failed",
        })),
        statusMap: {},
      };
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error creating bulk payments";
    return {
      successful: [],
      failed: paymentsArray.map((p) => ({
        studentId: p.meta?.studentId,
        studentName: p.meta?.studentName,
        error: errorMessage,
      })),
      statusMap: {},
    };
  }
};


