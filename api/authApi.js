//authApi.js

import axios from "axios";

const BASE_URL = "http://100.64.225.87:8000/api/";

export const register = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}register/`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code that falls out of the range of 200s
      console.error("Server responded with an error:", error.response.data);
      throw error.response.data; // Return the server response data
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from the server");
      throw "No response received from the server";
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up the request:", error.message);
      throw "Error setting up the request";
    }
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}login/`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle specific login-related errors
      if (error.response.data.email) {
        throw error.response.data.email[0];
      }
      // Handle other errors
      console.error("Server responded with an error:", error.response.data);
      throw "Login failed due to server error";
    } else if (error.request) {
      console.error("No response received from the server");
      throw "No response received from the server";
    } else {
      console.error("Error setting up the request:", error.message);
      throw "Error setting up the request";
    }
  }
};
