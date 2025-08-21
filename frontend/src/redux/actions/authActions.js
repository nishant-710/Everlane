import axios from "axios";
const API_URL = import.meta.env.VITE_BASEURL_API;

export const loginUser = (credentials) => async (dispatch) => {
    try {
        dispatch({ type: "LOGIN_REQUEST" });

        const response = await axios.post(`${API_URL}/login`, credentials);
        localStorage.setItem("token", response.data.token);
        dispatch({
            type: "LOGIN_SUCCESS",
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: "LOGIN_FAILURE",
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const loadUserFromStorage = () => (dispatch) => {
  const token = localStorage.getItem("token");
  if (token) {
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: { token }, // ya user info yahan bhejo
    });
  }
};
