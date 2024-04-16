import axios from "axios";
import { BASE_URL } from "./authApi";

export const getClass = async (userToken) => {
  try {
    const response = await axios.get(`${BASE_URL}class/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching classroom:", error);
    throw "Error fetching class";
  }
};

export const getClassName = async (userToken) => {
  try {
    const response = await axios.get(`${BASE_URL}classroom/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching classroom:", error);
    throw "Error fetching class";
  }
};
