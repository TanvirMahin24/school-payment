import { SET_TENANT } from "../constants/Type";

export const setTenant = (tenant) => (dispatch) => {
  dispatch({
    type: SET_TENANT,
    payload: tenant,
  });
};


