import {
  SYNC_ALL_STUDENTS,
  SYNC_RECENT_STUDENTS,
  GET_SYNC_STATUS,
  GET_STUDENT,
} from "../constants/Type";

const initialState = {
  syncStatus: {
    primary: { lastSyncTime: null },
    coaching: { lastSyncTime: null },
  },
  student: null,
  loading: false,
  error: null,
};

const studentReducer = (state = initialState, action) => {
  switch (action.type) {
    case SYNC_ALL_STUDENTS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case SYNC_RECENT_STUDENTS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case GET_SYNC_STATUS:
      // If action.payload is an object with tenant keys, update all
      // If it's a single tenant object, update that tenant
      if (action.payload && typeof action.payload === "object") {
        if (action.payload.tenant) {
          // Single tenant response
          return {
            ...state,
            syncStatus: {
              ...state.syncStatus,
              [action.payload.tenant]: {
                lastSyncTime: action.payload.lastSyncTime,
              },
            },
            loading: false,
            error: null,
          };
        } else {
          // Multiple tenants response
          return {
            ...state,
            syncStatus: {
              ...state.syncStatus,
              ...action.payload,
            },
            loading: false,
            error: null,
          };
        }
      }
      return state;
    case GET_STUDENT:
      return {
        ...state,
        student: action.payload,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export default studentReducer;

