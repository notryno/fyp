import axios from "axios";
import { BASE_URL } from "./authApi";

export const getGrades = async (userToken, courseId) => {
  try {
    const response = await axios.get(`${BASE_URL}grade/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching grades for course:", error);
    throw "Error fetching grades";
  }
};
