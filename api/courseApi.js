import axios from "axios";
import { BASE_URL } from "./authApi";

export const getEnrolledCourses = async (userToken) => {
  try {
    const response = await axios.get(`${BASE_URL}enrolled/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    throw "Error fetching enrolled courses";
  }
};

export const getCourseSchedule = async (userToken, courseId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}single-schedule/${courseId}/`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw "Error fetching course";
  }
};

export const getCoursesByStudent = async (userToken, studentId) => {
  try {
    const response = await axios.get(`${BASE_URL}enrolled/${studentId}/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
