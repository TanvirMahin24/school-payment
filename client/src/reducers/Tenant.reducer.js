import { SET_TENANT } from "../constants/Type";
import { DEFAULT_TENANT } from "../constants/Tenant";

// Load tenant from localStorage on initialization
const getInitialTenant = () => {
  try {
    const storedTenant = localStorage.getItem("selectedTenant");
    return storedTenant || DEFAULT_TENANT;
  } catch (error) {
    return DEFAULT_TENANT;
  }
};

const initialState = {
  selectedTenant: getInitialTenant(),
};

const tenantReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TENANT:
      // Persist to localStorage
      try {
        if (action.payload) {
          localStorage.setItem("selectedTenant", action.payload);
        } else {
          localStorage.removeItem("selectedTenant");
        }
      } catch (error) {
        console.error("Error saving tenant to localStorage:", error);
      }
      return {
        ...state,
        selectedTenant: action.payload,
      };
    default:
      return state;
  }
};

export default tenantReducer;



