import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "./authApi";

export const getTasks = async (userToken) => {
  try {
    const response = await axios.get(`${BASE_URL}tasks/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw "Error fetching tasks";
  }
};

export const createTask = async (userToken, taskData) => {
  try {
    const response = await axios.post(`${BASE_URL}tasks/`, taskData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw "Error creating task";
  }
};

export const updateTask = async (userToken, taskId, taskData) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}tasks/${taskId}/`,
      taskData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw "Error updating task";
  }
};

export const deleteTask = async (userToken, taskId) => {
  try {
    const response = await axios.delete(`${BASE_URL}tasks/${taskId}/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server responded with an error:", error.response.data);
      throw error.response.data;
    } else if (error.request) {
      console.error("No response received from the server");
      throw "No response received from the server";
    } else {
      console.error("Error setting up the request:", error.message);
      throw "Error setting up the request";
    }
  }
};
