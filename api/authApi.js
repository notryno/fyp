import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/";

export const register = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}register/`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}login/`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
